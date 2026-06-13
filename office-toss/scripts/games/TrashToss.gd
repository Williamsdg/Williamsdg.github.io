extends Node3D
## Trash Can Paper Toss — the flagship low-poly 3D mini-game.
##
## Builds an office scene procedurally (floor, walls, desk, breakable props and
## an open-top bin), then lets the player flick paper balls at the bin.
##
## Gameplay:
## - Drag up to aim: a dotted trajectory preview shows where the throw will go
##   (wind included). Release to throw.
## - Sinking a shot scores 100, multiplied by your consecutive-make combo.
## - Banking the ball off a wall or the desk first adds a bank-shot bonus.
## - The bin slides to a new spot between shots; wind changes too.
## - Each office location has its own set of breakable bonus props.

const Prop := preload("res://scripts/games/Breakable.gd")

const TOTAL_SHOTS := 10
const COINS_PER_POINT := 0.1   # score -> coins conversion on game over

const BASE_SINK_POINTS := 100
const BANK_BONUS := 50
const MAX_COMBO_MULT := 5

# Where the bin starts and where balls launch from.
const BIN_POS := Vector3(0, 0, -5.5)
const BIN_RADIUS := 0.45
const BIN_HEIGHT := 0.7
const LAUNCH_POS := Vector3(0, 1.35, 2.2)

const DESK_TOP_Y := 0.95
const PREVIEW_DOTS := 16

# Per-location breakable prop sets (concept board: mug, monitor, plant pot,
# picture frame, window, printer, desk lamp, folder stacks...).
# Desk-top positions are relative to the desk surface; "anchored" props are
# placed absolutely (e.g. the rooftop window on the back wall).
const LEVEL_PROPS := {
	"classic": [
		{ "pos": Vector3(-1.0, 0.15, -2.6), "size": Vector3(0.3, 0.3, 0.3),   "color": Color(0.85, 0.78, 0.72), "points": 50 },   # coffee mug
		{ "pos": Vector3(0.0, 0.22, -2.7),  "size": Vector3(0.7, 0.44, 0.12), "color": Color(0.12, 0.12, 0.14), "points": 100 },  # monitor
		{ "pos": Vector3(1.0, 0.18, -2.5),  "size": Vector3(0.34, 0.36, 0.34), "color": Color(0.78, 0.45, 0.30), "points": 75 },  # plant pot
		{ "pos": Vector3(1.5, 0.13, -2.8),  "size": Vector3(0.26, 0.26, 0.05), "color": Color(0.70, 0.60, 0.35), "points": 75 },  # picture frame
		{ "pos": Vector3(-1.6, 0.20, -2.7), "size": Vector3(0.16, 0.4, 0.16), "color": Color(0.30, 0.55, 0.75), "points": 60 },   # desk lamp
	],
	"executive": [
		{ "pos": Vector3(-1.2, 0.20, -2.6), "size": Vector3(0.22, 0.4, 0.22), "color": Color(0.95, 0.78, 0.20), "points": 125 },  # golden trophy
		{ "pos": Vector3(0.0, 0.22, -2.7),  "size": Vector3(0.7, 0.44, 0.12), "color": Color(0.12, 0.12, 0.14), "points": 100 },  # monitor
		{ "pos": Vector3(1.1, 0.20, -2.6),  "size": Vector3(0.16, 0.4, 0.16), "color": Color(0.20, 0.45, 0.30), "points": 60 },   # banker's lamp
		{ "pos": Vector3(1.6, 0.13, -2.8),  "size": Vector3(0.26, 0.26, 0.05), "color": Color(0.55, 0.40, 0.22), "points": 75 },  # framed portrait
		{ "pos": Vector3(-0.6, 0.15, -2.5), "size": Vector3(0.3, 0.3, 0.3),   "color": Color(0.92, 0.90, 0.88), "points": 50 },   # fine china cup
	],
	"startup": [
		{ "pos": Vector3(-1.1, 0.22, -2.7), "size": Vector3(0.7, 0.44, 0.12), "color": Color(0.12, 0.12, 0.14), "points": 100 },  # monitor
		{ "pos": Vector3(0.0, 0.18, -2.5),  "size": Vector3(0.34, 0.36, 0.34), "color": Color(0.40, 0.65, 0.35), "points": 75 },  # succulent
		{ "pos": Vector3(0.9, 0.14, -2.6),  "size": Vector3(0.28, 0.28, 0.28), "color": Color(0.85, 0.30, 0.35), "points": 60 },  # rubber band ball
		{ "pos": Vector3(1.5, 0.10, -2.7),  "size": Vector3(0.24, 0.2, 0.24), "color": Color(0.98, 0.85, 0.25), "points": 40 },   # sticky note stack
		{ "pos": Vector3(-1.7, 0.15, -2.5), "size": Vector3(0.3, 0.3, 0.2),   "color": Color(0.90, 0.55, 0.15), "points": 50 },   # nerf blaster
	],
	"archive": [
		{ "pos": Vector3(-1.3, 0.18, -2.6), "size": Vector3(0.4, 0.36, 0.3),  "color": Color(0.78, 0.68, 0.50), "points": 40 },   # folder stack
		{ "pos": Vector3(-0.6, 0.18, -2.7), "size": Vector3(0.4, 0.36, 0.3),  "color": Color(0.70, 0.58, 0.42), "points": 40 },   # folder stack
		{ "pos": Vector3(0.4, 0.25, -2.6),  "size": Vector3(0.6, 0.5, 0.5),   "color": Color(0.80, 0.80, 0.78), "points": 100 },  # printer
		{ "pos": Vector3(1.4, 0.22, -2.6),  "size": Vector3(0.35, 0.44, 0.35), "color": Color(0.62, 0.50, 0.36), "points": 50 },  # archive box
		{ "pos": Vector3(-1.7, 0.13, -2.8), "size": Vector3(0.26, 0.26, 0.05), "color": Color(0.50, 0.50, 0.52), "points": 75 },  # old photo frame
	],
	"rooftop": [
		{ "pos": Vector3(-1.0, 0.15, -2.6), "size": Vector3(0.3, 0.3, 0.3),   "color": Color(0.85, 0.78, 0.72), "points": 50 },   # coffee mug
		{ "pos": Vector3(0.6, 0.18, -2.5),  "size": Vector3(0.34, 0.36, 0.34), "color": Color(0.35, 0.60, 0.30), "points": 75 },  # planter
		{ "pos": Vector3(1.4, 0.20, -2.7),  "size": Vector3(0.16, 0.4, 0.16), "color": Color(0.90, 0.90, 0.92), "points": 60 },   # patio lamp
		# The skyline window behind the bin — big bonus, breaks easily.
		# Stands in a freestanding glass divider frame (posts built by Decor).
		{ "abs_pos": Vector3(0, 1.1, -8.0), "size": Vector3(2.2, 1.4, 0.08),  "color": Color(0.55, 0.75, 0.95), "points": 150, "break_speed": 1.0, "anchored": true },
	],
}

## Per-room look: surfaces, lighting and sky. "back" is "solid" or "window"
## (glass wall with a skyline behind it); rooftop is open-air with parapets.
const ROOMS := {
	"classic": {
		"floor": Color(0.40, 0.44, 0.50), "wall": Color(0.78, 0.78, 0.74), "bg": Color(0.16, 0.18, 0.22),
		"ambient": Color(0.72, 0.74, 0.78), "ambient_energy": 0.6, "sun": 1.0, "sun_color": Color(1, 1, 1),
		"indoor": true, "back": "solid", "bin": Color(0.18, 0.32, 0.65), "desk": Color(0.42, 0.30, 0.20),
	},
	"executive": {
		"floor": Color(0.34, 0.23, 0.14), "wall": Color(0.60, 0.48, 0.34), "bg": Color(0.10, 0.08, 0.05),
		"ambient": Color(0.9, 0.75, 0.55), "ambient_energy": 0.55, "sun": 0.9, "sun_color": Color(1, 0.92, 0.8),
		"indoor": true, "back": "solid", "bin": Color(0.16, 0.55, 0.27), "desk": Color(0.30, 0.18, 0.10),
	},
	"startup": {
		"floor": Color(0.70, 0.68, 0.64), "wall": Color(0.88, 0.88, 0.86), "bg": Color(0.55, 0.72, 0.90),
		"ambient": Color(0.80, 0.85, 0.92), "ambient_energy": 0.7, "sun": 1.1, "sun_color": Color(1, 1, 1),
		"indoor": true, "back": "window", "bin": Color(0.45, 0.28, 0.60), "desk": Color(0.85, 0.83, 0.80),
	},
	"archive": {
		"floor": Color(0.35, 0.33, 0.30), "wall": Color(0.52, 0.47, 0.41), "bg": Color(0.07, 0.06, 0.05),
		"ambient": Color(0.55, 0.48, 0.40), "ambient_energy": 0.4, "sun": 0.55, "sun_color": Color(1, 0.95, 0.85),
		"indoor": true, "back": "solid", "bin": Color(0.42, 0.43, 0.46), "desk": Color(0.48, 0.46, 0.44),
	},
	"rooftop": {
		"floor": Color(0.55, 0.55, 0.56), "bg": Color(0.48, 0.72, 0.95),
		"ambient": Color(0.75, 0.85, 1.0), "ambient_energy": 0.8, "sun": 1.4, "sun_color": Color(1, 0.97, 0.88),
		"indoor": false, "bin": Color(0.72, 0.24, 0.20), "desk": Color(0.55, 0.40, 0.25),
	},
}

var _tint := Color(0.62, 0.66, 0.72)
var _level_name := "Classic Office"
var _level_id := "classic"
var _cfg: Dictionary = ROOMS["classic"]

var _score := 0
var _shots_left := TOTAL_SHOTS
var _combo := 0
var _wind := Vector3.ZERO         # horizontal acceleration applied to the ball (m/s²)
var _active_ball: PaperBall = null
var _game_over := false
var _gravity: float = 9.8

var _bin_root: Node3D             # bin + goal trigger; slides between shots

## Attract mode: when true the scene plays itself as a menu backdrop —
## no HUD, no input, auto-tossing balls, slowly orbiting camera.
var _attract := false
var _cam: Camera3D
var _cam_angle := 0.0

# Swipe tracking.
var _dragging := false
var _drag_start := Vector2.ZERO

# Trajectory preview.
var _preview_dots: Array[MeshInstance3D] = []

# UI references.
var _score_label: Label
var _shots_label: Label
var _combo_label: Label
var _wind_label: Label
var _message_label: Label

func _ready() -> void:
	_attract = bool(GameState.get_meta("attract_mode", false))
	var level: Variant = GameState.get_meta("current_level", null)
	if typeof(level) == TYPE_DICTIONARY:
		_tint = level.get("tint", _tint)
		_level_name = level.get("name", _level_name)
		_level_id = level.get("id", _level_id)

	_gravity = float(ProjectSettings.get_setting("physics/3d/default_gravity", 9.8))
	_cfg = ROOMS.get(_level_id, ROOMS["classic"])

	_build_environment()
	_build_bin()
	_build_desk_with_props()
	_build_camera_and_light()
	Decor.build(_level_id, self)
	_new_wind()

	if _attract:
		# Backdrop only: skip the HUD/aim preview and start auto-tossing.
		_auto_toss_loop()
		return

	_build_preview()
	_build_ui()
	_update_hud()

## Configures this scene as a self-playing menu backdrop. Call before adding
## it to the tree (it reads the flag in _ready via GameState meta).
func set_attract_mode() -> void:
	_attract = true

# ---------------------------------------------------------------------------
# Scene construction
# ---------------------------------------------------------------------------

func _build_environment() -> void:
	var env := WorldEnvironment.new()
	var e := Environment.new()
	e.background_mode = Environment.BG_COLOR
	e.background_color = _cfg["bg"]
	e.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	e.ambient_light_color = _cfg["ambient"]
	e.ambient_light_energy = _cfg["ambient_energy"]
	env.environment = e
	add_child(env)

	# Floor.
	_add_box(Vector3(0, -0.05, -3), Vector3(8, 0.1, 14), _cfg["floor"])

	if _cfg["indoor"]:
		var wall: Color = _cfg["wall"]
		# Side walls (bank-shot surfaces) and a ceiling just above max throw apex.
		_add_box(Vector3(-4, 1.5, -3), Vector3(0.2, 4, 14), wall, true)
		_add_box(Vector3(4, 1.5, -3), Vector3(0.2, 4, 14), wall, true)
		_add_box(Vector3(0, 3.55, -3), Vector3(8, 0.1, 14), wall.darkened(0.12))
		if _cfg["back"] == "window":
			_build_window_wall(wall)
		else:
			_add_box(Vector3(0, 1.5, -10), Vector3(8, 4, 0.2), wall.lightened(0.05), true)
	else:
		# Open-air rooftop: low concrete parapets instead of walls.
		var concrete := Color(0.62, 0.62, 0.63)
		_add_box(Vector3(0, 0.5, -9.9), Vector3(8, 1.0, 0.25), concrete, true)
		_add_box(Vector3(-3.9, 0.5, -3), Vector3(0.25, 1.0, 14), concrete, true)
		_add_box(Vector3(3.9, 0.5, -3), Vector3(0.25, 1.0, 14), concrete, true)

## Floor-to-ceiling glass back wall with a city skyline behind it (startup).
func _build_window_wall(wall: Color) -> void:
	var mullion := Color(0.18, 0.19, 0.22)
	# Solid strips top and bottom, glass panes between mullion posts.
	_add_box(Vector3(0, 0.25, -10), Vector3(8, 0.5, 0.2), wall, true)
	_add_box(Vector3(0, 3.65, -10), Vector3(8, 0.4, 0.2), wall)
	for mx in [-4.0, -2.0, 0.0, 2.0, 4.0]:
		Decor.box(self, Vector3(mx, 1.95, -10), Vector3(0.12, 2.9, 0.22), mullion, { "collide": true })
	for gx in [-3.0, -1.0, 1.0, 3.0]:
		Decor.box(self, Vector3(gx, 1.95, -10), Vector3(1.9, 2.9, 0.06),
			Color(0.65, 0.8, 0.92, 0.30), { "collide": true, "bankable": true })
	# Skyline beyond the glass.
	var sky_buildings := [
		[-6.0, -14.0, 2.5, 7.0], [-2.0, -15.5, 3.0, 9.0], [1.5, -13.0, 2.0, 5.5],
		[5.0, -15.0, 2.5, 8.0], [8.5, -13.0, 3.0, 6.0],
	]
	for b in sky_buildings:
		var h: float = b[3]
		Decor.box(self, Vector3(b[0], h * 0.5 - 2.0, b[1]), Vector3(b[2], h, b[2]), Color(0.40, 0.46, 0.56))

func _build_bin() -> void:
	# The main bin slides between shots; extra fixed targets pay more.
	_bin_root = _make_bin(BIN_POS, _cfg["bin"], BASE_SINK_POINTS, "SWISH")
	_build_extra_targets()

## Extra scoring targets per location (positions are skill shots: tucked
## behind partitions, mounted high on walls, etc.).
func _build_extra_targets() -> void:
	match _level_id:
		"classic":
			# Red bin hidden behind the left cubicle partition — lob it over.
			_make_bin(Vector3(-2.95, 0, -6.4), Color(0.75, 0.22, 0.18), 150, "RED BIN")
			# Mini hoop high on the back wall.
			_make_hoop(Vector3(3.0, 1.85, -9.55), 200, "BUCKETS")
		_:
			pass

## Builds an open-top bin (ring of wall segments + base) with a scoring
## trigger inside the rim. Returns the root so callers can move it.
func _make_bin(pos: Vector3, color: Color, points: int, label: String) -> Node3D:
	var root := Node3D.new()
	root.position = pos
	add_child(root)

	# Balls bounce off the rim on a miss and drop in cleanly on a make.
	var bin := StaticBody3D.new()
	bin.collision_layer = 1
	bin.collision_mask = 0
	root.add_child(bin)

	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
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
	goal.position = Vector3(0, BIN_HEIGHT * 0.55, 0)
	var goal_cs := CollisionShape3D.new()
	var goal_shape := CylinderShape3D.new()
	goal_shape.radius = BIN_RADIUS * 0.8
	goal_shape.height = 0.1
	goal_cs.shape = goal_shape
	goal.add_child(goal_cs)
	root.add_child(goal)
	goal.body_entered.connect(_on_goal_entered.bind(points, label))
	return root

## A wall-mounted mini basketball hoop: backboard + orange rim with a
## scoring trigger through the ring.
func _make_hoop(ring_pos: Vector3, points: int, label: String) -> void:
	# Backboard against the wall behind the ring.
	Decor.box(self, Vector3(ring_pos.x, ring_pos.y + 0.25, -9.84), Vector3(0.95, 0.7, 0.05), Color(0.94, 0.94, 0.92))
	Decor.box(self, Vector3(ring_pos.x, ring_pos.y + 0.18, -9.80), Vector3(0.45, 0.35, 0.04), Color(0.8, 0.3, 0.2))
	# Rim (visual) + a short "net" hint below it.
	var rim := MeshInstance3D.new()
	var tm := TorusMesh.new()
	tm.inner_radius = 0.22
	tm.outer_radius = 0.29
	var rim_mat := StandardMaterial3D.new()
	rim_mat.albedo_color = Color(0.9, 0.45, 0.15)
	tm.material = rim_mat
	rim.mesh = tm
	rim.position = ring_pos
	add_child(rim)
	var net := MeshInstance3D.new()
	var nm := CylinderMesh.new()
	nm.top_radius = 0.24
	nm.bottom_radius = 0.16
	nm.height = 0.28
	var net_mat := StandardMaterial3D.new()
	net_mat.albedo_color = Color(1, 1, 1, 0.4)
	net_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	nm.material = net_mat
	net.mesh = nm
	net.position = ring_pos + Vector3(0, -0.17, 0)
	add_child(net)
	# Scoring trigger through the ring.
	var goal := Area3D.new()
	goal.collision_layer = 0
	goal.collision_mask = 2
	goal.position = ring_pos + Vector3(0, -0.05, 0)
	var cs := CollisionShape3D.new()
	var shape := CylinderShape3D.new()
	shape.radius = 0.2
	shape.height = 0.12
	cs.shape = shape
	goal.add_child(cs)
	add_child(goal)
	goal.body_entered.connect(_on_goal_entered.bind(points, label))

func _move_bin() -> void:
	# Slide the bin to a fresh spot before the next shot.
	var target := Vector3(randf_range(-1.3, 1.3), 0, BIN_POS.z + randf_range(-0.8, 0.8))
	var tween := create_tween()
	tween.tween_property(_bin_root, "position", target, 0.5)\
		.set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)

func _build_desk_with_props() -> void:
	# A desk between the player and the bin, topped with breakable bonus props.
	# The desk top is a bank-shot surface. Wood tone matches the room.
	var desk_color: Color = _cfg["desk"]
	_add_box(Vector3(0, DESK_TOP_Y, -2.6), Vector3(3.0, 0.1, 1.2), desk_color, true)
	# Desk legs.
	for sx in [-1.35, 1.35]:
		for sz in [-3.1, -2.1]:
			_add_box(Vector3(sx, DESK_TOP_Y * 0.5, sz), Vector3(0.12, DESK_TOP_Y, 0.12), desk_color.darkened(0.25))

	var top := DESK_TOP_Y + 0.05
	var props: Array = LEVEL_PROPS.get(_level_id, LEVEL_PROPS["classic"])
	for p in props:
		var prop := Prop.new() as Breakable
		prop.size = p["size"]
		prop.prop_color = p["color"]
		prop.points = p["points"]
		prop.break_speed = p.get("break_speed", 1.6)
		prop.anchored = p.get("anchored", false)
		add_child(prop)
		if p.has("abs_pos"):
			prop.global_position = p["abs_pos"]
		else:
			var off: Vector3 = p["pos"]
			prop.global_position = Vector3(off.x, top + off.y, off.z)
		prop.broken.connect(_on_prop_broken)

func _build_camera_and_light() -> void:
	_cam = Camera3D.new()
	_cam.position = Vector3(0, 2.0, 3.6)
	_cam.look_at_from_position(_cam.position, Vector3(0, 0.7, -5.0), Vector3.UP)
	_cam.fov = 60
	_cam.current = true   # render this 3D world even when hosted behind the menu UI
	add_child(_cam)

	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-55, -40, 0)
	sun.light_energy = _cfg["sun"]
	sun.light_color = _cfg["sun_color"]
	sun.shadow_enabled = true
	add_child(sun)

func _build_preview() -> void:
	# A pool of small unshaded dots reused every frame while aiming.
	var mesh := SphereMesh.new()
	mesh.radius = 0.045
	mesh.height = 0.09
	mesh.radial_segments = 6
	mesh.rings = 3
	var mat := StandardMaterial3D.new()
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	mat.albedo_color = Color(1.0, 0.9, 0.3, 0.7)
	mesh.material = mat
	for i in PREVIEW_DOTS:
		var dot := MeshInstance3D.new()
		dot.mesh = mesh
		dot.visible = false
		add_child(dot)
		_preview_dots.append(dot)

# ---------------------------------------------------------------------------
# Input — drag to aim (with live trajectory preview), release to throw
# ---------------------------------------------------------------------------

func _unhandled_input(event: InputEvent) -> void:
	if _game_over or _attract:
		return
	if event is InputEventScreenTouch:
		if event.pressed:
			_dragging = true
			_drag_start = event.position
		elif _dragging:
			_dragging = false
			_hide_preview()
			_resolve_flick(event.position)
	elif event is InputEventScreenDrag and _dragging:
		_update_preview(event.position)

func _can_throw() -> bool:
	if _shots_left <= 0:
		return false
	if _active_ball != null and is_instance_valid(_active_ball) and not _active_ball.settled:
		return false
	return true

## Maps a swipe to throw parameters: power from upward distance, aim from the
## horizontal component. Purely distance-based, so the preview is exact.
func _throw_params(end_pos: Vector2) -> Dictionary:
	var swipe := end_pos - _drag_start
	if swipe.y > -40.0:
		return {}  # not an upward swipe
	var vp := get_viewport().get_visible_rect().size
	var power: float = clampf(-swipe.y / (float(vp.y) * 0.6), 0.1, 1.2)
	var aim_x: float = clampf(swipe.x / (float(vp.x) * 0.5), -1.0, 1.0)
	return { "power": power, "aim_x": aim_x }

func _launch_velocity(power: float, aim_x: float) -> Vector3:
	var forward := 7.5 + power * 6.0          # toward -Z
	var lift := 3.2 + power * 2.6             # upward arc (apex stays under the ceiling)
	var side := aim_x * 3.0                    # left/right aim
	return Vector3(side, lift, -forward)

func _resolve_flick(end_pos: Vector2) -> void:
	if not _can_throw():
		return
	var params := _throw_params(end_pos)
	if params.is_empty():
		return
	_throw(params["power"], params["aim_x"])

func _throw(power: float, aim_x: float) -> void:
	var ball := PaperBall.new()
	add_child(ball)
	ball.global_position = LAUNCH_POS
	ball.linear_velocity = _launch_velocity(power, aim_x)
	ball.angular_velocity = Vector3(randf_range(-4, 4), randf_range(-4, 4), randf_range(-4, 4))

	_active_ball = ball
	_shots_left -= 1
	_update_hud()
	_watch_ball(ball)

func _watch_ball(ball: PaperBall) -> void:
	await get_tree().create_timer(4.5).timeout
	var scored := is_instance_valid(ball) and ball.has_scored
	if not scored:
		# A miss breaks the combo streak.
		if _combo > 0:
			_combo = 0
			_update_hud()
	if is_instance_valid(ball):
		ball.queue_free()
	if _active_ball == ball:
		_active_ball = null
	if _shots_left <= 0:
		if not _game_over:
			_end_game()
	else:
		# Freshen the challenge for the next shot.
		_move_bin()
		_new_wind()
		_update_hud()

# ---------------------------------------------------------------------------
# Trajectory preview — simulates the same launch + gravity + wind the ball
# will experience, so what you see is what you get.
# ---------------------------------------------------------------------------

func _update_preview(current_pos: Vector2) -> void:
	if not _can_throw():
		_hide_preview()
		return
	var params := _throw_params(current_pos)
	if params.is_empty():
		_hide_preview()
		return
	var v := _launch_velocity(params["power"], params["aim_x"])
	var accel := Vector3(_wind.x, -_gravity, _wind.z)
	for i in PREVIEW_DOTS:
		var t := 0.085 * float(i + 1)
		var p: Vector3 = LAUNCH_POS + v * t + 0.5 * accel * t * t
		var dot := _preview_dots[i]
		if p.y < 0.05 or p.z < BIN_POS.z - 2.0:
			dot.visible = false
		else:
			dot.position = p
			dot.visible = true

func _hide_preview() -> void:
	for dot in _preview_dots:
		dot.visible = false

# ---------------------------------------------------------------------------
# Wind nudges the active ball each physics tick. Stored as an acceleration so
# light objects aren't blasted sideways; capped well below gravity.
# ---------------------------------------------------------------------------

func _physics_process(delta: float) -> void:
	if _active_ball != null and is_instance_valid(_active_ball) and not _active_ball.settled:
		_active_ball.apply_central_force(_wind * _active_ball.mass)
	if _attract and _cam != null:
		# Slow lazy orbit around the bin for the menu backdrop.
		_cam_angle += delta * 0.12
		var r := 4.2
		_cam.position = Vector3(sin(_cam_angle) * r, 2.1, 3.0 + cos(_cam_angle) * 1.2)
		_cam.look_at_from_position(_cam.position, Vector3(0, 0.7, -4.5), Vector3.UP)

# ---------------------------------------------------------------------------
# Attract mode — auto-toss balls forever so the menu has a living backdrop.
# ---------------------------------------------------------------------------

func _auto_toss_loop() -> void:
	while is_inside_tree() and _attract:
		await get_tree().create_timer(randf_range(0.9, 1.6)).timeout
		if not (is_inside_tree() and _attract):
			return
		# Aim roughly at the bin with a little spread so some go in, some miss.
		var to_bin := _bin_root.position - LAUNCH_POS
		var ball := PaperBall.new()
		add_child(ball)
		ball.global_position = LAUNCH_POS
		var lift := 4.2 + randf_range(-0.3, 0.5)
		var fwd := -to_bin.z * 1.7 + randf_range(-0.6, 0.6)
		ball.linear_velocity = Vector3(to_bin.x * 1.6 + randf_range(-0.5, 0.5), lift, -fwd)
		ball.angular_velocity = Vector3(randf_range(-5, 5), randf_range(-5, 5), randf_range(-5, 5))
		get_tree().create_timer(4.0).timeout.connect(func():
			if is_instance_valid(ball):
				ball.queue_free())
		_new_wind()

func _new_wind() -> void:
	var strength := randf_range(0.0, 2.2)   # m/s² of sideways drift
	var angle := randf_range(0.0, TAU)
	_wind = Vector3(cos(angle) * strength, 0, sin(angle) * strength)

# ---------------------------------------------------------------------------
# Scoring — combo multiplier for consecutive makes, bonus for bank shots.
# ---------------------------------------------------------------------------

func _on_goal_entered(body: Node, base_points: int, label: String) -> void:
	if not (body is PaperBall) or (body as PaperBall).has_scored:
		return
	var ball := body as PaperBall
	ball.has_scored = true
	if _attract:
		return  # backdrop: register the sink visually but keep no score/HUD
	_combo += 1
	var mult: int = mini(_combo, MAX_COMBO_MULT)
	var pts := base_points * mult
	if ball.banked:
		pts += BANK_BONUS
	_add_score(pts)
	if ball.banked:
		_flash_message("BANK %s! +%d" % [label, pts], Color(0.4, 0.85, 1.0))
	elif mult > 1:
		_flash_message("%s COMBO x%d! +%d" % [label, mult, pts], Color(1.0, 0.55, 0.9))
	else:
		_flash_message("%s! +%d" % [label, pts], Color(0.3, 1.0, 0.5))

func _on_prop_broken(points: int) -> void:
	if _attract:
		return
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
	_hide_preview()
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
	_combo_label = _hud_label(26, Color(1.0, 0.55, 0.9))
	bottom.add_child(_combo_label)

	_message_label = Label.new()
	_message_label.set_anchors_preset(Control.PRESET_FULL_RECT)
	_message_label.add_theme_font_size_override("font_size", 56)
	_message_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_message_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	_message_label.modulate.a = 0.0
	layer.add_child(_message_label)

func _update_hud() -> void:
	_score_label.text = "Score: %d" % _score
	_shots_label.text = "Shots left: %d   (Best: %d)" % [_shots_left, GameState.get_best(_level_id)]
	_combo_label.text = ("Combo x%d" % mini(_combo, MAX_COMBO_MULT)) if _combo > 1 else ""
	var arrow := "→" if _wind.x > 0.15 else ("←" if _wind.x < -0.15 else "·")
	_wind_label.text = "Wind: %s %d" % [arrow, int(round(_wind.length() * 4.0))]

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
# Generic box helper (static world geometry). Bankable surfaces award the
# bank-shot bonus when the ball touches them before sinking.
# ---------------------------------------------------------------------------

func _add_box(pos: Vector3, box_size: Vector3, color: Color, bankable := false) -> StaticBody3D:
	var body := StaticBody3D.new()
	body.collision_layer = 1
	body.collision_mask = 0
	body.position = pos
	if bankable:
		body.set_meta("bankable", true)
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
