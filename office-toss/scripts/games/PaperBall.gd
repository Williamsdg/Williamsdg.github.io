extends RigidBody3D
class_name PaperBall
## A throwable office object (paper ball, airplane, stapler, pencil, rubber-band
## ball, ...). Builds its own low-poly mesh and collision in code from a
## definition dictionary (see GameState.THROWABLES), so it can be spawned with
## `PaperBall.new()` — no scene file needed.
##
## Leaves a fading trail while moving fast, and remembers whether it banked
## off a wall or the desk (bodies tagged with the "bankable" meta) so the
## game can award bank-shot bonuses.

# Set by the spawner before add_child(); falls back to the plain paper ball.
var def: Dictionary = {}
var score_mult: float = 1.0

var settled := false        # true once it has effectively stopped moving
var has_scored := false     # guards against double-counting a sink
var banked := false         # touched a wall/desk before (potentially) sinking
var _trail_radius := 0.13
var _life := 0.0
var _trail_timer := 0.0

func _ready() -> void:
	if def.is_empty():
		def = GameState.THROWABLES[0]
	score_mult = float(def.get("mult", 1.0))

	mass = float(def.get("mass", 0.06))
	gravity_scale = float(def.get("gravity", 1.0))
	physics_material_override = PhysicsMaterial.new()
	physics_material_override.bounce = float(def.get("bounce", 0.25))
	physics_material_override.friction = float(def.get("friction", 0.8))
	# Collision layer 2 (balls), collides with world(1) + props(4).
	collision_layer = 2
	collision_mask = 1 | 4
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_body_entered)

	var color: Color = def.get("color", Color(0.93, 0.93, 0.90))
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.roughness = 1.0
	mat.metallic = 0.0

	var mesh: Mesh
	var shape: Shape3D
	match String(def.get("shape", "sphere")):
		"box", "plane":
			var size: Vector3 = def.get("size", Vector3(0.26, 0.26, 0.26))
			var bm := BoxMesh.new()
			bm.size = size
			mesh = bm
			var bs := BoxShape3D.new()
			bs.size = size
			shape = bs
			_trail_radius = size.length() * 0.25
		"cylinder":
			var r: float = def.get("radius", 0.12)
			var h: float = def.get("height", 0.12)
			var cm := CylinderMesh.new()
			cm.top_radius = r
			cm.bottom_radius = r
			cm.height = h
			cm.radial_segments = 10
			mesh = cm
			var cs := CylinderShape3D.new()
			cs.radius = r
			cs.height = h
			shape = cs
			_trail_radius = r
		_:  # sphere
			var rad: float = def.get("radius", 0.13)
			var sm := SphereMesh.new()
			sm.radius = rad
			sm.height = rad * 2.0
			sm.radial_segments = 8     # low-poly faceting
			sm.rings = 4
			mesh = sm
			var ss := SphereShape3D.new()
			ss.radius = rad
			shape = ss
			_trail_radius = rad

	mesh.surface_set_material(0, mat)
	var mi := MeshInstance3D.new()
	mi.mesh = mesh
	add_child(mi)

	var col := CollisionShape3D.new()
	col.shape = shape
	add_child(col)

func _physics_process(delta: float) -> void:
	_life += delta
	# Consider the throwable settled once it slows down (after a short grace).
	if _life > 0.6 and linear_velocity.length() < 0.35 and not settled:
		settled = true

	# Fading trail while in flight.
	_trail_timer += delta
	if _trail_timer >= 0.05 and linear_velocity.length() > 2.0:
		_trail_timer = 0.0
		_spawn_trail_puff()

func _on_body_entered(body: Node) -> void:
	if body is Node3D and (body as Node3D).get_meta("bankable", false):
		banked = true

func _spawn_trail_puff() -> void:
	var parent := get_parent()
	if parent == null:
		return
	var puff := MeshInstance3D.new()
	var m := SphereMesh.new()
	m.radius = _trail_radius * 0.55
	m.height = _trail_radius * 1.1
	m.radial_segments = 6
	m.rings = 3
	var mat := StandardMaterial3D.new()
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	mat.albedo_color = Color(1.0, 1.0, 1.0, 0.3)
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	m.material = mat
	puff.mesh = m
	parent.add_child(puff)
	puff.global_position = global_position
	# Fade out and clean up; the tween is owned by the puff so it survives
	# the ball being freed mid-flight.
	var tween := puff.create_tween()
	tween.tween_property(mat, "albedo_color:a", 0.0, 0.45)
	tween.tween_callback(puff.queue_free)
