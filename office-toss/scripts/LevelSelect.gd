extends Control
## Office location picker. Locked locations can be bought with coins.

const MAIN := "res://scenes/Main.tscn"

var _coins_label: Label

func _ready() -> void:
	_build_ui()

func _build_ui() -> void:
	var bg := ColorRect.new()
	bg.color = Color(0.07, 0.10, 0.16)
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(bg)

	var margin := MarginContainer.new()
	margin.set_anchors_preset(Control.PRESET_FULL_RECT)
	margin.add_theme_constant_override("margin_left", 32)
	margin.add_theme_constant_override("margin_right", 32)
	margin.add_theme_constant_override("margin_top", 40)
	margin.add_theme_constant_override("margin_bottom", 40)
	add_child(margin)

	var col := VBoxContainer.new()
	col.add_theme_constant_override("separation", 16)
	margin.add_child(col)

	var header := HBoxContainer.new()
	col.add_child(header)

	var back := Button.new()
	back.text = "< Back"
	back.add_theme_font_size_override("font_size", 24)
	back.pressed.connect(func(): get_tree().change_scene_to_file(MAIN))
	header.add_child(back)

	header.add_child(_hspacer())

	_coins_label = Label.new()
	_coins_label.add_theme_font_size_override("font_size", 24)
	_coins_label.add_theme_color_override("font_color", Color(1.0, 0.83, 0.24))
	header.add_child(_coins_label)
	_refresh_coins()

	var title := Label.new()
	title.text = "Choose an Office"
	title.add_theme_font_size_override("font_size", 40)
	title.add_theme_color_override("font_color", Color(0.92, 0.95, 1.0))
	col.add_child(title)

	if GameState.DEV_UNLOCK_ALL and OS.is_debug_build():
		var dev := Label.new()
		dev.text = "dev build: all locations unlocked for testing"
		dev.add_theme_font_size_override("font_size", 16)
		dev.add_theme_color_override("font_color", Color(0.95, 0.6, 0.3))
		col.add_child(dev)

	for level in GameState.LEVELS:
		col.add_child(_make_level_row(level))

func _make_level_row(level: Dictionary) -> Control:
	var unlocked: bool = GameState.is_unlocked(level["id"])
	var panel := PanelContainer.new()
	var sb := StyleBoxFlat.new()
	sb.bg_color = (level["tint"] as Color).darkened(0.2) if unlocked else Color(0.16, 0.18, 0.22)
	sb.set_corner_radius_all(14)
	sb.set_content_margin_all(16)
	panel.add_theme_stylebox_override("panel", sb)

	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 12)
	panel.add_child(row)

	# Color swatch standing in for the location thumbnail.
	var swatch := ColorRect.new()
	swatch.color = level["tint"]
	swatch.custom_minimum_size = Vector2(72, 72)
	row.add_child(swatch)

	var info := VBoxContainer.new()
	info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	row.add_child(info)

	var name_label := Label.new()
	name_label.text = level["name"]
	name_label.add_theme_font_size_override("font_size", 28)
	name_label.add_theme_color_override("font_color", Color.WHITE)
	info.add_child(name_label)

	var best := Label.new()
	best.text = "Best: %d" % GameState.get_best(level["id"])
	best.add_theme_font_size_override("font_size", 18)
	best.add_theme_color_override("font_color", Color(0.8, 0.86, 0.95))
	info.add_child(best)

	var action := Button.new()
	action.custom_minimum_size = Vector2(120, 56)
	action.add_theme_font_size_override("font_size", 24)
	if unlocked:
		action.text = "Play"
		action.pressed.connect(func(): _play(level))
	else:
		action.text = "%d" % int(level["cost"])
		action.disabled = GameState.coins < int(level["cost"])
		action.pressed.connect(func(): _buy(level))
	row.add_child(action)

	return panel

func _play(level: Dictionary) -> void:
	GameState.set_meta("attract_mode", false)
	GameState.set_meta("current_level", level)
	get_tree().change_scene_to_file(level["scene"])

func _buy(level: Dictionary) -> void:
	if GameState.try_unlock(level["id"], int(level["cost"])):
		# Rebuild to reflect the newly unlocked location.
		get_tree().reload_current_scene()

func _refresh_coins() -> void:
	_coins_label.text = "Coins: %d" % GameState.coins

func _hspacer() -> Control:
	var c := Control.new()
	c.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	return c
