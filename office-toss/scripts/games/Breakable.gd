extends RigidBody3D
class_name Breakable
## A bonus desk prop (mug, monitor, plant pot, lamp, picture frame...).
## Awards points the first time it is hit hard enough, then visibly "breaks"
## by scattering a few low-poly shards.

signal broken(points: int)

@export var points: int = 50
@export var prop_color: Color = Color(0.8, 0.3, 0.3)
@export var size: Vector3 = Vector3(0.3, 0.3, 0.3)

const BREAK_SPEED := 1.6   # relative impact speed needed to break it

var _alive := true
var _mesh_instance: MeshInstance3D

func _ready() -> void:
	mass = 0.5
	# Layer 4 = props. Collide with world(1) and balls(2).
	collision_layer = 4
	collision_mask = 1 | 2
	contact_monitor = true
	max_contacts_reported = 6
	body_entered.connect(_on_body_entered)

	var mesh := BoxMesh.new()
	mesh.size = size
	var mat := StandardMaterial3D.new()
	mat.albedo_color = prop_color
	mat.roughness = 0.7
	mesh.material = mat
	_mesh_instance = MeshInstance3D.new()
	_mesh_instance.mesh = mesh
	add_child(_mesh_instance)

	var shape := CollisionShape3D.new()
	var box := BoxShape3D.new()
	box.size = size
	shape.shape = box
	add_child(shape)

func _on_body_entered(body: Node) -> void:
	if not _alive or not (body is PaperBall):
		return
	var rel_speed: float = (linear_velocity - (body as PaperBall).linear_velocity).length()
	if rel_speed < BREAK_SPEED:
		return
	_break()

func _break() -> void:
	_alive = false
	broken.emit(points)
	_spawn_shards()
	queue_free()

func _spawn_shards() -> void:
	# A handful of small cubes flung outward — cheap, readable "smash" feedback.
	var parent := get_parent()
	if parent == null:
		return
	for i in 6:
		var shard := RigidBody3D.new()
		shard.collision_layer = 0
		shard.collision_mask = 1
		shard.mass = 0.05
		var m := BoxMesh.new()
		m.size = size * 0.3
		var mat := StandardMaterial3D.new()
		mat.albedo_color = prop_color
		m.material = mat
		var mi := MeshInstance3D.new()
		mi.mesh = m
		shard.add_child(mi)
		var cs := CollisionShape3D.new()
		var bs := BoxShape3D.new()
		bs.size = size * 0.3
		cs.shape = bs
		shard.add_child(cs)
		parent.add_child(shard)
		shard.global_position = global_position + Vector3(randf_range(-0.1, 0.1), randf_range(0.0, 0.2), randf_range(-0.1, 0.1))
		shard.linear_velocity = Vector3(randf_range(-2, 2), randf_range(1.5, 3.5), randf_range(-2, 2))
		shard.angular_velocity = Vector3(randf_range(-6, 6), randf_range(-6, 6), randf_range(-6, 6))
		# Auto-clean shards so they don't pile up. Bind the timer to the shard
		# (which outlives this prop) so cleanup still runs after we free ourselves.
		get_tree().create_timer(2.5).timeout.connect(shard.queue_free)
