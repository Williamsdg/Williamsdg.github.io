extends Node
## Global, persistent game state (autoloaded singleton).
##
## Holds coins, per-level best scores and which office locations are unlocked,
## and persists everything to user://savegame.json between runs.

const SAVE_PATH := "user://savegame.json"

## The five starter office locations from the concept board.
## Each level references which mini-game scene it loads. For the MVP every
## location loads the Trash Toss game with a different environment tint; new
## games can be slotted in by changing "scene".
const LEVELS := [
	{ "id": "classic",   "name": "Classic Office",   "tint": Color(0.62, 0.66, 0.72), "cost": 0,    "scene": "res://scenes/games/TrashToss.tscn" },
	{ "id": "executive", "name": "Executive Office", "tint": Color(0.45, 0.36, 0.28), "cost": 250,  "scene": "res://scenes/games/TrashToss.tscn" },
	{ "id": "startup",   "name": "Startup Space",    "tint": Color(0.30, 0.55, 0.62), "cost": 500,  "scene": "res://scenes/games/TrashToss.tscn" },
	{ "id": "archive",   "name": "Archive Room",     "tint": Color(0.40, 0.34, 0.30), "cost": 750,  "scene": "res://scenes/games/TrashToss.tscn" },
	{ "id": "rooftop",   "name": "Rooftop Office",   "tint": Color(0.36, 0.58, 0.78), "cost": 1000, "scene": "res://scenes/games/TrashToss.tscn" },
]

## Dev convenience: unlock every location while play-testing. Only takes
## effect in debug builds (running from the editor / debug exports), so
## release builds keep the real coin-gated progression automatically.
const DEV_UNLOCK_ALL := true

## Throwable objects from the concept board. Each has its own physics feel
## and a score multiplier — the harder it is to sink, the more it pays.
## shape: "sphere" (radius), "box"/"plane" (size), "cylinder" (radius+height).
## gravity scales gravity (paper airplane glides); bounce/friction tune feel.
const THROWABLES := [
	{ "id": "paper",   "name": "Paper Ball",      "icon": "⚪", "mult": 1.0,  "shape": "sphere",   "radius": 0.13, "color": Color(0.93, 0.93, 0.90), "mass": 0.06, "bounce": 0.25, "friction": 0.8 },
	{ "id": "sticky",  "name": "Sticky Note Ball", "icon": "🟡", "mult": 0.9,  "shape": "sphere",   "radius": 0.12, "color": Color(0.97, 0.85, 0.25), "mass": 0.09, "bounce": 0.05, "friction": 1.0 },
	{ "id": "tape",    "name": "Tape Roll",        "icon": "⭕", "mult": 1.1,  "shape": "cylinder", "radius": 0.13, "height": 0.07, "color": Color(0.82, 0.74, 0.58), "mass": 0.10, "bounce": 0.3,  "friction": 0.6 },
	{ "id": "cup",     "name": "Crumpled Cup",     "icon": "🥤", "mult": 1.2,  "shape": "cylinder", "radius": 0.10, "height": 0.17, "color": Color(0.80, 0.30, 0.28), "mass": 0.08, "bounce": 0.2,  "friction": 0.7 },
	{ "id": "plane",   "name": "Paper Airplane",   "icon": "✈️", "mult": 1.25, "shape": "plane",    "size": Vector3(0.36, 0.07, 0.44), "color": Color(0.95, 0.95, 0.93), "mass": 0.04, "bounce": 0.1, "friction": 0.6, "gravity": 0.55 },
	{ "id": "stapler", "name": "Stapler",          "icon": "📎", "mult": 1.3,  "shape": "box",      "size": Vector3(0.30, 0.11, 0.13), "color": Color(0.78, 0.16, 0.14), "mass": 0.45, "bounce": 0.1, "friction": 0.9 },
	{ "id": "pencil",  "name": "Pencil",           "icon": "✏️", "mult": 1.4,  "shape": "box",      "size": Vector3(0.05, 0.05, 0.48), "color": Color(0.95, 0.72, 0.18), "mass": 0.05, "bounce": 0.35, "friction": 0.5 },
	{ "id": "rubber",  "name": "Rubber Band Ball", "icon": "🔴", "mult": 1.5,  "shape": "sphere",   "radius": 0.12, "color": Color(0.85, 0.35, 0.20), "mass": 0.12, "bounce": 0.75, "friction": 0.6 },
]

var selected_throwable: String = "paper"

func throwable_def() -> Dictionary:
	for t in THROWABLES:
		if t["id"] == selected_throwable:
			return t
	return THROWABLES[0]

## Cycles to the next throwable and returns its definition.
func next_throwable() -> Dictionary:
	for i in THROWABLES.size():
		if THROWABLES[i]["id"] == selected_throwable:
			selected_throwable = THROWABLES[(i + 1) % THROWABLES.size()]["id"]
			save_game()
			return throwable_def()
	selected_throwable = THROWABLES[0]["id"]
	return THROWABLES[0]

var coins: int = 0
var best_scores: Dictionary = {}   # level_id -> int
var unlocked: Dictionary = { "classic": true }  # level_id -> bool

func _ready() -> void:
	load_game()

func get_best(level_id: String) -> int:
	return int(best_scores.get(level_id, 0))

func is_unlocked(level_id: String) -> bool:
	if DEV_UNLOCK_ALL and OS.is_debug_build():
		return true
	return bool(unlocked.get(level_id, false))

## Records a completed run. Returns true if it set a new best for the level.
func submit_run(level_id: String, score: int, coins_earned: int) -> bool:
	coins += coins_earned
	var is_best := score > get_best(level_id)
	if is_best:
		best_scores[level_id] = score
	save_game()
	return is_best

## Attempts to unlock a level by spending coins. Returns true on success.
func try_unlock(level_id: String, cost: int) -> bool:
	if is_unlocked(level_id):
		return true
	if coins < cost:
		return false
	coins -= cost
	unlocked[level_id] = true
	save_game()
	return true

func save_game() -> void:
	var data := {
		"coins": coins,
		"best_scores": best_scores,
		"unlocked": unlocked,
	}
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data))
		f.close()

func load_game() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if f == null:
		return
	var parsed: Variant = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(parsed) != TYPE_DICTIONARY:
		return
	coins = int(parsed.get("coins", 0))
	best_scores = parsed.get("best_scores", {})
	unlocked = parsed.get("unlocked", { "classic": true })
	unlocked["classic"] = true  # the starter location is always playable
