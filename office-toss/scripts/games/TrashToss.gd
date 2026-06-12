extends Node3D
## Trash Can Paper Toss — the flagship low-poly 3D mini-game.
##
## Builds an office scene procedurally (floor, walls, desk, breakable props and
## an open-top bin), then lets the player flick paper balls at the bin. Sinking
## a shot scores; smashing desk props awards bonus points. Wind nudges the ball
## in flight for an extra challenge.

const Prop := preload("res://scripts/games/Breakable.gd")

const TOTAL_SHOTS := 10
const COINS_PER_POINT := 0.1   # score -> coins conversion on game over

# Where the bin sits and where balls launch from.
const BIN_POS := Vector3(0, 0, -5.5)
const BIN_RADIUS := 0.45
const BIN_HEIGHT := 0.7
const LAUNCH_POS := Vector3(0, 1.35, 2.2)

var _tint := Color(0.62, 0.66, 0.72)
var _level_name := "Classic Office"
var _level_id := "classic"

var _score := 0
var _shots_left := TOTAL_SHOTS
var _wind := Vector3.ZERO
var _active_ball: PaperBall = null
var _game_over := false

# Swipe tracking.
var _dragging := false
var _drag_start := Vector2.ZERO
var _drag_start_time := 0.0

# UI references.
var _score_label: Label
var _shots_label: Label
var _wind_label: Label
var _message_label: Label

func _ready() -> void:
	var level: Variant = GameState.get_meta("current_level", null)
	if typeof(level) == TYPE_DICTIONARY:
		_tint = level.get("tint", _tint)
		_level_name = level.get("name", _level_name)
		_level_id = level.get("id", _level_id)

	_build_environment()
	_build_bin()
	_build_desk_with_props()
	_build_camera_and_light()
	_build_ui()
	_new_wind()
	_update_hud()

# ---------------------------------------------------------------------------
# Scene construction
# ---------------------------------------------------------------------------

func _build_environment() -> void:
	var env := WorldEnvironment.new()
	var e := Environment.new()
	e.background_mode = Environment.BG_COLOR
	e.background_color = _tint.darkened(0.55)
	e.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	e.ambient_light_color = _tint.lightened(0.2)
	e.ambient_light_energy = 0.6
	env.environment = e
	add_child(env)

	# Floor.
	_add_box(Vector3(0, -0.05, -3), Vector3(8, 0.1, 14), _tint.darkened(0.25))
	# Back and side walls for a sense of enclosure.
	_add_box(Vector3(0, 1.5, -10), Vector3(8, 4, 0.2), _tint.lightened(0.05))
	_add_box(Vector3(-4, 1.5, -3), Vector3(0.2, 4, 14), _tint)
	_add_box(Vector3(4, 1.5, -3), Vector3(0.2, 4, 14), _tint)

func _build_bin() -> void:
	# Open-top bin made from a ring of thin wall segments + a base, so balls
	# bounce off the rim on a miss and drop in cleanly on a make.
	var bin := StaticBody3D.new()
	bin.collision_layer = 1
	bin.collision_mask = 0
	bin.position = BIN_POS
	add_child(bin)

	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.16, 0.55, 0.27)
	mat.roughness = 0.6

	var segments := 14
	for i in segments:
		var a := TAU * float(i) / float(segments)
		var seg_pos := Vector3(cos(a) * BIN_RADIUS, BIN_HEIGHT * 0.5, sin(a) * BIN_RADIUS)
		var seg_w := (TAU * BIN_RADIUS / segments) * 1.15
		var mi := MeshInstance3D.new()
		var bm := BoxMesh.new()
		bm.size = Vector3(seg_w, BIN_HEIGHT, 0.05)
		bm.material = mat
		mi.mesh = bm
		mi.position = seg_pos
		# Orient each wall segment tangent to the bin circle.
		mi.rotation = Vector3(0, -a + PI * 0.5, 0)
		bin.add_child(mi)

		var cs := CollisionShape3D.new()
		var bs := BoxShape3D.new()
		bs.size = bm.size
		cs.shape = bs
		cs.position = seg_pos
		cs.rotation = Vector3(0, -a + PI * 0.5, 0)
		bin.add_child(cs)

	# Base of the bin.
	var base := MeshInstance3D.new()
	var base_mesh := CylinderMesh.new()
	base_mesh.top_radius = BIN_RADIUS
	base_mesh.bottom_radius = BIN_RADIUS
	base_mesh.height = 0.06
	base_mesh.radial_segments = segments
	base_mesh.material = mat
	base.mesh = base_mesh
	base.position = Vector3(0, 0.03, 0)
	bin.add_child(base)
	var base_cs := CollisionShape3D.new()
	var base_shape := CylinderShape3D.new()
	base_shape.radius = BIN_RADIUS
	base_shape.height = 0.06
	base_cs.shape = base_shape
	base_cs.position = Vector3(0, 0.03, 0)
	bin.add_child(base_cs)

	# Scoring trigger: a disc just inside the rim. A ball entering counts as a make.
	var goal := Area3D.new()
	goal.collision_layer = 0
	goal.collision_mask = 2  # detect balls
	goal.position = BIN_POS + Vector3(0, BIN_HEIGHT * 0.55, 0)
	var goal_cs := CollisionShape3D.new()
	var goal_shape := CylinderShape3D.new()
	goal_shape.radius = BIN_RADIUS * 0.8
	goal_shape.height = 0.1
	goal_cs.shape = goal_shape
	goal.add_child(goal_cs)
	add_child(goal)
	goal.body_entered.connect(_on_goal_entered)

func _build_desk_with_props() -> void:
	# A desk between the player and the bin, topped with breakable bonus props.
	var desk_top_y := 0.95
	_add_box(Vector3(0, desk_top_y, -2.6), Vector3(3.0, 0.1, 1.2), Color(0.42, 0.30, 0.20))
	# Desk legs.
	for sx in [-1.35, 1.35]:
		for sz in [-3.1, -2.1]:
			_add_box(Vector3(sx, desk_top_y * 0.5, sz), Vector3(0.12, desk_top_y, 0.12), Color(0.32, 0.22, 0.14))

	var top := desk_top_y + 0.05
	# props: (offset, size, color, points)
	var props := [
		{ "pos": Vector3(-1.0, top + 0.15, -2.6), "size": Vector3(0.3, 0.3, 0.3), "color": Color(0.85, 0.78, 0.72), "points": 50 },  # coffee mug
		{ "pos": Vector3(0.0, top + 0.22, -2.7),  "size": Vector3(0.7, 0.44, 0.12), "color": Color(0.12, 0.12, 0.14), "points": 100 }, # monitor
		{ "pos": Vector3(1.0, top + 0.18, -2.5),  "size": Vector3(0.34, 0.36, 0.34), "color": Color(0.78, 0.45, 0.30), "points": 75 },  # plant pot
		{ "pos": Vector3(1.5, top + 0.13, -2.8),  "size": Vector3(0.26, 0.26, 0.05), "color": Color(0.70, 0.60, 0.35), "points": 75 },  # picture frame
		{ "pos": Vector3(-1.6, top + 0.20, -2.7), "size": Vector3(0.16, 0.4, 0.16), "color": Color(0.30, 0.55, 0.75), "points": 60 },  # desk lamp
	]
	for p in props:
		var prop := Prop.new() as Breakable
		prop.size = p["size"]
		prop.prop_color = p["color"]
		prop.points = p["points"]
		add_child(prop)
		prop.global_position = p["pos"]
		prop.broken.connect(_on_prop_broken)

func _build_camera_and_light() -> void:
	var cam := Camera3D.new()
	cam.position = Vector3(0, 2.0, 3.6)
	cam.look_at_from_position(cam.position, Vector3(0, 0.7, -5.0), Vector3.UP)
	cam.fov = 60
	add_child(cam)

	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-55, -40, 0)
	sun.light_energy = 1.1
	sun.shadow_enabled = true
	add_child(sun)

func _build_ui() -> void:
	var layer := CanvasLayer.new()
	add_child(layer)

	var top := HBoxContainer.new()
	top.set_anchors_preset(Control.PRESET_TOP_WIDE)
	top.offset_top = 16
	top.offset_left = 20
	top.offset_right = -20
	top.add_theme_constant_override("separation", 12)
	layer.add_child(top)

	var back := Button.new()
	back.text = "< Quit"
	back.add_theme_font_size_override("font_size", 22)
	back.pressed.connect(func(): get_tree().change_scene_to_file("res://scenes/LevelSelect.tscn"))
	top.add_child(back)

	top.add_child(_hexpand())

	_wind_label = _hud_label(24, Color(0.7, 0.85, 1.0))
	top.add_child(_wind_label)

	var bottom := VBoxContainer.new()
	bottom.set_anchors_preset(Control.PRESET_TOP_LEFT)
	bottom.offset_left = 20
	bottom.offset_top = 60
	layer.add_child(bottom)

	_score_label = _hud_label(40, Color(1.0, 0.83, 0.24))
	bottom.add_child(_score_label)
	_shots_label = _hud_label(26, Color(0.9, 0.94, 1.0))
	bottom.add_child(_shots_label)

	_message_label = Label.new()
	_message_label.set_anchors_preset(Control.PRESET_FULL_RECT)
	_message_label.add_theme_font_size_override("font_size", 56)
	_message_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_message_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	_message_label.modulate.a = 0.0
	layer.add_child(_message_label)

# ---------------------------------------------------------------------------
# Input — flick to throw
# ---------------------------------------------------------------------------

func _unhandled_input(event: InputEvent) -> void:
	if _game_over:
		return
	if event is InputEventScreenTouch:
		if event.pressed:
			_dragging = true
			_drag_start = event.position
			_drag_start_time = Time.get_ticks_msec() / 1000.0
		elif _dragging:
			_dragging = false
			_resolve_flick(event.position)

func _resolve_flick(end_pos: Vector2) -> void:
	if _shots_left <= 0 or (_active_ball != null and is_instance_valid(_active_ball) and not _active_ball.settled):
		return
	var swipe := end_pos - _drag_start
	# Must be an upward swipe to throw toward the bin.
	if swipe.y > -40.0:
		return
	var dt: float = maxf(0.05, (Time.get_ticks_msec() / 1000.0) - _drag_start_time)
	var viewport_h: float = float(get_viewport().get_visible_rect().size.y)
	var viewport_w: float = float(get_viewport().get_visible_rect().size.x)

	# Power from how far (and how fast) the player swiped upward.
	var up_frac: float = clampf(-swipe.y / (viewport_h * 0.6), 0.1, 1.0)
	var speed_bonus: float = clampf((-swipe.y / dt) / 4000.0, 0.0, 0.5)
	var power: float = up_frac + speed_bonus           # ~0.1 .. 1.5
	# Aim from horizontal swipe component.
	var aim_x: float = clampf(swipe.x / (viewport_w * 0.5), -1.0, 1.0)

	_throw(power, aim_x)

func _throw(power: float, aim_x: float) -> void:
	var ball := PaperBall.new()
	add_child(ball)
	ball.global_position = LAUNCH_POS

	# Map the flick to a launch velocity: forward toward the bin, with an arc.
	var forward := 7.5 + power * 6.0          # toward -Z
	var lift := 3.2 + power * 3.0             # upward arc
	var side := aim_x * 3.0                    # left/right aim
	ball.linear_velocity = Vector3(side, lift, -forward)
	ball.angular_velocity = Vector3(randf_range(-4, 4), randf_range(-4, 4), randf_range(-4, 4))

	_active_ball = ball
	_shots_left -= 1
	_update_hud()
	# Give the player their next shot / end the game shortly after it settles.
	_watch_ball(ball)

func _watch_ball(ball: PaperBall) -> void:
	await get_tree().create_timer(4.5).timeout
	if is_instance_valid(ball):
		ball.queue_free()
	if _active_ball == ball:
		_active_ball = null
	if _shots_left <= 0 and not _game_over:
		_end_game()

# ---------------------------------------------------------------------------
# Wind affects the active ball each physics tick.
# ---------------------------------------------------------------------------

func _physics_process(_delta: float) -> void:
	if _active_ball != null and is_instance_valid(_active_ball) and not _active_ball.settled:
		_active_ball.apply_central_force(_wind)

func _new_wind() -> void:
	var strength := randf_range(0.0, 0.9)
	var angle := randf_range(0.0, TAU)
	_wind = Vector3(cos(angle) * strength, 0, sin(angle) * strength)

# ---------------------------------------------------------------------------
# Scoring
# ---------------------------------------------------------------------------

func _on_goal_entered(body: Node) -> void:
	if body is PaperBall and not (body as PaperBall).has_scored:
		(body as PaperBall).has_scored = true
		_add_score(100)
		_flash_message("SWISH! +100", Color(0.3, 1.0, 0.5))

func _on_prop_broken(points: int) -> void:
	_add_score(points)
	_flash_message("+%d" % points, Color(1.0, 0.7, 0.2))

func _add_score(points: int) -> void:
	_score += points
	_update_hud()

# ---------------------------------------------------------------------------
# Game over
# ---------------------------------------------------------------------------

func _end_game() -> void:
	_game_over = true
	var coins_earned := int(round(_score * COINS_PER_POINT))
	var is_best := GameState.submit_run(_level_id, _score, coins_earned)
	_show_game_over(coins_earned, is_best)

func _show_game_over(coins_earned: int, is_best: bool) -> void:
	var layer := CanvasLayer.new()
	add_child(layer)

	var dim := ColorRect.new()
	dim.color = Color(0, 0, 0, 0.6)
	dim.set_anchors_preset(Control.PRESET_FULL_RECT)
	layer.add_child(dim)

	var center := CenterContainer.new()
	center.set_anchors_preset(Control.PRESET_FULL_RECT)
	layer.add_child(center)

	var col := VBoxContainer.new()
	col.alignment = BoxContainer.ALIGNMENT_CENTER
	col.add_theme_constant_override("separation", 18)
	center.add_child(col)

	var title := Label.new()
	title.text = "TIME'S UP!"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size", 56)
	title.add_theme_color_override("font_color", Color(1.0, 0.83, 0.24))
	col.add_child(title)

	var score_line := Label.new()
	score_line.text = "Score: %d" % _score
	score_line.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	score_line.add_theme_font_size_override("font_size", 36)
	col.add_child(score_line)

	if is_best:
		var best_tag := Label.new()
		best_tag.text = "NEW BEST!"
		best_tag.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		best_tag.add_theme_font_size_override("font_size", 28)
		best_tag.add_theme_color_override("font_color", Color(0.3, 1.0, 0.5))
		col.add_child(best_tag)

	var coins_line := Label.new()
	coins_line.text = "+%d coins" % coins_earned
	coins_line.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	coins_line.add_theme_font_size_override("font_size", 28)
	coins_line.add_theme_color_override("font_color", Color(1.0, 0.83, 0.24))
	col.add_child(coins_line)

	var retry := Button.new()
	retry.text = "Play Again"
	retry.custom_minimum_size = Vector2(240, 70)
	retry.add_theme_font_size_override("font_size", 30)
	retry.pressed.connect(func(): get_tree().reload_current_scene())
	col.add_child(retry)

	var menu := Button.new()
	menu.text = "Locations"
	menu.custom_minimum_size = Vector2(240, 60)
	menu.add_theme_font_size_override("font_size", 26)
	menu.pressed.connect(func(): get_tree().change_scene_to_file("res://scenes/LevelSelect.tscn"))
	col.add_child(menu)

# ---------------------------------------------------------------------------
# HUD helpers
# ---------------------------------------------------------------------------

func _update_hud() -> void:
	_score_label.text = "Score: %d" % _score
	_shots_label.text = "Shots left: %d   (Best: %d)" % [_shots_left, GameState.get_best(_level_id)]
	var w := int(round(_wind.length() * 10))
	_wind_label.text = "Wind: %d" % w

func _flash_message(text: String, color: Color) -> void:
	_message_label.text = text
	_message_label.add_theme_color_override("font_color", color)
	_message_label.modulate.a = 1.0
	var tween := create_tween()
	tween.tween_property(_message_label, "modulate:a", 0.0, 1.0).set_delay(0.4)

func _hud_label(font_size: int, color: Color) -> Label:
	var l := Label.new()
	l.add_theme_font_size_override("font_size", font_size)
	l.add_theme_color_override("font_color", color)
	return l

func _hexpand() -> Control:
	var c := Control.new()
	c.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	return c

# ---------------------------------------------------------------------------
# Generic box helper (static world geometry).
# ---------------------------------------------------------------------------

func _add_box(pos: Vector3, box_size: Vector3, color: Color) -> StaticBody3D:
	var body := StaticBody3D.new()
	body.collision_layer = 1
	body.collision_mask = 0
	body.position = pos
	add_child(body)

	var mi := MeshInstance3D.new()
	var bm := BoxMesh.new()
	bm.size = box_size
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.roughness = 0.85
	bm.material = mat
	mi.mesh = bm
	body.add_child(mi)

	var cs := CollisionShape3D.new()
	var bs := BoxShape3D.new()
	bs.size = box_size
	cs.shape = bs
	body.add_child(cs)
	return body
