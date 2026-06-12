extends Control
## Main menu. Builds its UI in code so the .tscn stays a thin root node.

const LEVEL_SELECT := "res://scenes/LevelSelect.tscn"

func _ready() -> void:
	_build_ui()

func _build_ui() -> void:
	# Background panel.
	var bg := ColorRect.new()
	bg.color = Color(0.07, 0.10, 0.16)
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(bg)

	var center := CenterContainer.new()
	center.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(center)

	var col := VBoxContainer.new()
	col.alignment = BoxContainer.ALIGNMENT_CENTER
	col.add_theme_constant_override("separation", 24)
	center.add_child(col)

	var title := Label.new()
	title.text = "OFFICE TOSS"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size", 72)
	title.add_theme_color_override("font_color", Color(1.0, 0.83, 0.24))
	col.add_child(title)

	var subtitle := Label.new()
	subtitle.text = "Flick. Toss. Score."
	subtitle.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	subtitle.add_theme_font_size_override("font_size", 28)
	subtitle.add_theme_color_override("font_color", Color(0.7, 0.78, 0.9))
	col.add_child(subtitle)

	col.add_child(_spacer(20))

	var play := _make_button("PLAY", Color(0.18, 0.65, 0.30))
	play.pressed.connect(_on_play)
	col.add_child(play)

	var coins := Label.new()
	coins.text = "Coins: %d" % GameState.coins
	coins.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	coins.add_theme_font_size_override("font_size", 24)
	coins.add_theme_color_override("font_color", Color(1.0, 0.83, 0.24))
	col.add_child(coins)

	var hint := Label.new()
	hint.text = "Swipe up to throw — longer swipe = more power.\nSwipe left/right to aim. Sink shots and smash desk props for bonus points."
	hint.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	hint.add_theme_font_size_override("font_size", 18)
	hint.add_theme_color_override("font_color", Color(0.55, 0.62, 0.72))
	col.add_child(hint)

func _on_play() -> void:
	get_tree().change_scene_to_file(LEVEL_SELECT)

func _make_button(text: String, color: Color) -> Button:
	var b := Button.new()
	b.text = text
	b.custom_minimum_size = Vector2(280, 80)
	b.add_theme_font_size_override("font_size", 36)
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(16)
	b.add_theme_stylebox_override("normal", sb)
	var hover := sb.duplicate() as StyleBoxFlat
	hover.bg_color = color.lightened(0.12)
	b.add_theme_stylebox_override("hover", hover)
	b.add_theme_stylebox_override("pressed", hover)
	return b

func _spacer(h: int) -> Control:
	var c := Control.new()
	c.custom_minimum_size = Vector2(0, h)
	return c
