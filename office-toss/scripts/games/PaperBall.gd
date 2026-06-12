extends RigidBody3D
class_name PaperBall
## A crumpled paper ball. Builds its own low-poly mesh and collision in code,
## so it can be spawned with `PaperBall.new()` — no scene file needed.

const RADIUS := 0.13

var settled := false        # true once it has effectively stopped moving
var has_scored := false     # guards against double-counting a sink
var _life := 0.0

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
