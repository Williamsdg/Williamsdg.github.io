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
