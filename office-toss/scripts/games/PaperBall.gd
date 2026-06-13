extends RigidBody3D
class_name PaperBall
## A crumpled paper ball. Builds its own low-poly mesh and collision in code,
## so it can be spawned with `PaperBall.new()` — no scene file needed.
##
## Leaves a fading trail while moving fast, and remembers whether it banked
## off a wall or the desk (bodies tagged with the "bankable" meta) so the
## game can award bank-shot bonuses.

const RADIUS := 0.13

var settled := false        # true once it has effectively stopped moving
var has_scored := false     # guards against double-counting a sink
var banked := false         # touched a wall/desk before (potentially) sinking
var _life := 0.0
var _trail_timer := 0.0

func _ready() -> void:
	mass = 0.06              # paper is light
	physics_material_override = PhysicsMaterial.new()
	physics_material_override.bounce = 0.25
	physics_material_override.friction = 0.8
	# Collision layer 2 (balls), collides with world(1) + props(4).
	collision_layer = 2
	collision_mask = 1 | 4
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_body_entered)

	var mesh := SphereMesh.new()
	mesh.radius = RADIUS
	mesh.height = RADIUS * 2.0
	mesh.radial_segments = 8     # low-poly faceting
	mesh.rings = 4
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.93, 0.93, 0.90)
	mat.roughness = 1.0
	mat.metallic = 0.0
	mesh.material = mat
	var mi := MeshInstance3D.new()
	mi.mesh = mesh
	add_child(mi)

	var shape := CollisionShape3D.new()
	var sphere := SphereShape3D.new()
	sphere.radius = RADIUS
	shape.shape = sphere
	add_child(shape)

func _physics_process(delta: float) -> void:
	_life += delta
	# Consider the ball settled once it slows down (after a short grace period).
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
	m.radius = RADIUS * 0.55
	m.height = RADIUS * 1.1
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
