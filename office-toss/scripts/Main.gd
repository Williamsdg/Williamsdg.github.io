extends Control
## Main menu. A live, self-playing 3D office scene renders behind the UI
## (attract mode), with the menu drawn on top. UI is built in code so the
## .tscn stays a thin root node.

const LEVEL_SELECT := "res://scenes/LevelSelect.tscn"
const GAME_SCENE := "res://scenes/games/TrashToss.tscn"
const TrashTossScene := preload("res://scenes/games/TrashToss.tscn")

func _ready() -> void:
	_build_backdrop()
	_build_ui()

# ---------------------------------------------------------------------------
# Live 3D backdrop
# ---------------------------------------------------------------------------

func _build_backdrop() -> void:
	# Tell the game scene to run as a non-interactive, auto-tossing backdrop.
	GameState.set_meta("attract_mode", true)
	GameState.set_meta("current_level", GameState.LEVELS[0])  # Classic Office
	var scene := TrashTossScene.instantiate()
	# 3D nodes render into the window's world regardless of having a Control
	# parent, and always draw behind 2D — so the menu sits cleanly on top.
	add_child(scene)

# ---------------------------------------------------------------------------
# Menu UI
# ---------------------------------------------------------------------------

func _build_ui() -> void:
	# Readability scrim: darker at the bottom where the buttons live.
	var scrim := TextureRect.new()
	scrim.set_anchors_preset(Control.PRESET_FULL_RECT)
	scrim.texture = _vertical_gradient(
		Color(0.05, 0.07, 0.12, 0.15), Color(0.04, 0.06, 0.10, 0.85))
	scrim.stretch_mode = TextureRect.STRETCH_SCALE
	add_child(scrim)

	# Coin pill, top-right.
	add_child(_coin_pill())

	# Centered content column.
	var center := CenterContainer.new()
	center.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(center)

	var col := VBoxContainer.new()
	col.alignment = BoxContainer.ALIGNMENT_CENTER
	col.add_theme_constant_override("separation", 10)
	center.add_child(col)

	# Logo: "OFFICE" over a big "TOSS" with a paper-ball accent.
	var office := _title_label("OFFICE", 44, Color(0.92, 0.95, 1.0))
	office.add_theme_constant_override("outline_size", 0)
	col.add_child(office)

	var toss := _title_label("TOSS  🗑", 96, Color(1.0, 0.83, 0.24))
	col.add_child(toss)

	var tagline := _title_label("Flick. Toss. Score.", 26, Color(0.72, 0.80, 0.92))
	col.add_child(tagline)

	col.add_child(_spacer(0, 26))

	var play := _make_button("▶  PLAY", Color(0.20, 0.70, 0.32), 360, 84, 38)
	play.pressed.connect(_on_play)
	col.add_child(play)

	var locations := _make_button("Locations", Color(0.20, 0.34, 0.56), 360, 64, 28)
	locations.pressed.connect(_on_locations)
	col.add_child(locations)

	col.add_child(_spacer(0, 8))

	var hint := _title_label("Drag up to throw — longer = more power. Drag sideways to aim.",
		17, Color(0.6, 0.68, 0.8))
	hint.add_theme_constant_override("outline_size", 0)
	col.add_child(hint)

	# Version, bottom-left.
	var ver := Label.new()
	ver.text = "v1.0  •  low-poly 3D"
	ver.add_theme_font_size_override("font_size", 14)
	ver.add_theme_color_override("font_color", Color(0.45, 0.52, 0.62))
	ver.set_anchors_preset(Control.PRESET_BOTTOM_LEFT)
	ver.position = Vector2(20, -32)
	add_child(ver)

func _on_play() -> void:
	# Fast path: jump straight into the Classic Office.
	GameState.set_meta("attract_mode", false)
	GameState.set_meta("current_level", GameState.LEVELS[0])
	get_tree().change_scene_to_file(GAME_SCENE)

func _on_locations() -> void:
	GameState.set_meta("attract_mode", false)
	get_tree().change_scene_to_file(LEVEL_SELECT)

# ---------------------------------------------------------------------------
# UI building blocks
# ---------------------------------------------------------------------------

func _coin_pill() -> Control:
	var pill := PanelContainer.new()
	pill.set_anchors_preset(Control.PRESET_TOP_RIGHT)
	pill.position = Vector2(-150, 18)
	pill.custom_minimum_size = Vector2(128, 0)
	var sb := StyleBoxFlat.new()
	sb.bg_color = Color(0.10, 0.13, 0.20, 0.85)
	sb.set_corner_radius_all(22)
	sb.set_content_margin_all(10)
	sb.border_color = Color(1.0, 0.83, 0.24, 0.6)
	sb.set_border_width_all(2)
	pill.add_theme_stylebox_override("panel", sb)

	var row := HBoxContainer.new()
	row.alignment = BoxContainer.ALIGNMENT_CENTER
	row.add_theme_constant_override("separation", 8)
	pill.add_child(row)

	var coin := Label.new()
	coin.text = "🪙"
	coin.add_theme_font_size_override("font_size", 24)
	row.add_child(coin)

	var amount := Label.new()
	amount.text = "%d" % GameState.coins
	amount.add_theme_font_size_override("font_size", 26)
	amount.add_theme_color_override("font_color", Color(1.0, 0.83, 0.24))
	row.add_child(amount)
	return pill

func _make_button(text: String, color: Color, w: int, h: int, font_size: int) -> Button:
	var b := Button.new()
	b.text = text
	b.custom_minimum_size = Vector2(w, h)
	b.add_theme_font_size_override("font_size", font_size)
	b.add_theme_color_override("font_color", Color.WHITE)

	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(18)
	sb.shadow_color = Color(0, 0, 0, 0.45)
	sb.shadow_size = 8
	sb.shadow_offset = Vector2(0, 5)
	b.add_theme_stylebox_override("normal", sb)

	var hover := sb.duplicate() as StyleBoxFlat
	hover.bg_color = color.lightened(0.12)
	b.add_theme_stylebox_override("hover", hover)

	var pressed := sb.duplicate() as StyleBoxFlat
	pressed.bg_color = color.darkened(0.1)
	pressed.shadow_size = 3
	pressed.shadow_offset = Vector2(0, 2)
	b.add_theme_stylebox_override("pressed", pressed)
	b.add_theme_stylebox_override("focus", StyleBoxEmpty.new())
	return b

func _title_label(text: String, font_size: int, color: Color) -> Label:
	var l := Label.new()
	l.text = text
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	l.add_theme_font_size_override("font_size", font_size)
	l.add_theme_color_override("font_color", color)
	# Soft drop shadow for legibility over the moving 3D backdrop.
	l.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.55))
	l.add_theme_constant_override("shadow_offset_x", 2)
	l.add_theme_constant_override("shadow_offset_y", 3)
	l.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.5))
	l.add_theme_constant_override("outline_size", 6)
	return l

func _vertical_gradient(top: Color, bottom: Color) -> GradientTexture2D:
	var g := Gradient.new()
	g.set_color(0, top)
	g.set_color(1, bottom)
	var tex := GradientTexture2D.new()
	tex.gradient = g
	tex.fill_from = Vector2(0, 0)
	tex.fill_to = Vector2(0, 1)
	tex.width = 8
	tex.height = 256
	return tex

func _spacer(w: int, h: int) -> Control:
	var c := Control.new()
	c.custom_minimum_size = Vector2(w, h)
	return c
