class_name Decor
## Procedural low-poly set dressing for each office location.
##
## Everything is built from primitive meshes so the game needs no external
## assets. Pieces the ball can plausibly reach are collidable StaticBody3D
## (walls/partitions are also bank-shot surfaces); distant dressing is
## visual-only meshes to keep physics cheap on mobile.
##
## Layout contract with TrashToss: the throwing lane (|x| < 2.0 from the
## player at z=2.2 to past the bin at z≈-6.5) stays clear. Furniture lives in
## the side strips (|x| > 2.3), along the back (z < -7.5), and overhead.

static func build(level_id: String, parent: Node3D) -> void:
	match level_id:
		"executive": _executive(parent)
		"startup": _startup(parent)
		"archive": _archive(parent)
		"rooftop": _rooftop(parent)
		_: _classic(parent)

# ---------------------------------------------------------------------------
# Rooms
# ---------------------------------------------------------------------------

static func _classic(p: Node3D) -> void:
	var fabric := Color(0.48, 0.52, 0.58)            # cubicle partition fabric
	var desk_c := Color(0.72, 0.58, 0.40)            # light oak desk tops
	var chair_blue := Color(0.22, 0.38, 0.65)
	# Cubicle rows down both sides: partition facing the lane, desk + monitor
	# + chair behind it, pedestal cabinet, desk plant, loose papers.
	for side in [-1.0, 1.0]:
		for z in [-1.5, -4.5, -7.5]:
			box(p, Vector3(2.45 * side, 0.8, z), Vector3(0.07, 1.6, 2.5), fabric,
				{ "collide": true, "bankable": true })
			# partition top trim
			box(p, Vector3(2.45 * side, 1.62, z), Vector3(0.10, 0.05, 2.5), fabric.darkened(0.35))
			box(p, Vector3(3.3 * side, 0.72, z), Vector3(1.3, 0.06, 0.8), desk_c)      # desk top
			box(p, Vector3(3.3 * side, 0.36, z), Vector3(1.1, 0.66, 0.1), desk_c.darkened(0.2))  # modesty panel
			_monitor(p, Vector3(3.5 * side, 0.75, z), PI * 0.5 * side)
			_office_chair(p, Vector3(2.95 * side, 0.0, z + 0.6), -PI * 0.5 * side, chair_blue)
			# pedestal filing cabinet under the desk (handle facing the lane)
			box(p, Vector3(3.45 * side, 0.3, z - 0.5), Vector3(0.42, 0.6, 0.45), Color(0.55, 0.57, 0.60))
			box(p, Vector3(3.22 * side, 0.45, z - 0.5), Vector3(0.02, 0.03, 0.3), Color(0.35, 0.37, 0.4))
			# small desk plant + loose papers
			_plant(p, Vector3(3.55 * side, 0.75, z + 0.32), 0.45)
			box(p, Vector3(3.1 * side, 0.78, z + 0.42), Vector3(0.25, 0.01, 0.32), Color(0.95, 0.95, 0.93))
	# Ceiling light panels
	for z in [-1.0, -4.0, -7.0]:
		for x in [-1.8, 1.8]:
			box(p, Vector3(x, 3.5, z), Vector3(1.2, 0.06, 2.2), Color(1, 1, 0.96), { "emissive": 1.6 })
	# --- Back wall, left to right: door + EXIT, two windows, clock high up.
	# (x ≈ 3.0 stays clear for the wall-mounted hoop target.)
	box(p, Vector3(-2.9, 1.1, -9.88), Vector3(0.95, 2.2, 0.08), Color(0.45, 0.30, 0.18))
	box(p, Vector3(-2.55, 1.05, -9.82), Vector3(0.06, 0.16, 0.05), Color(0.75, 0.72, 0.55))  # handle
	box(p, Vector3(-2.9, 2.45, -9.85), Vector3(0.55, 0.26, 0.08), Color(0.2, 0.85, 0.35), { "emissive": 2.2 })
	for wx in [-0.9, 1.4]:
		_window(p, Vector3(wx, 2.2, -9.86), Vector2(1.5, 1.3))
	cylinder(p, Vector3(0.25, 3.15, -9.85), 0.26, 0.06, Color(0.95, 0.95, 0.95), { "rot_x": PI * 0.5 })
	cylinder(p, Vector3(0.25, 3.15, -9.81), 0.05, 0.06, Color(0.15, 0.15, 0.18), { "rot_x": PI * 0.5 })
	# Water cooler beside the door
	cylinder(p, Vector3(-2.0, 0.5, -9.4), 0.17, 1.0, Color(0.92, 0.93, 0.95))
	cylinder(p, Vector3(-2.0, 1.18, -9.4), 0.13, 0.36, Color(0.45, 0.7, 0.9, 0.75))
	# Posters: blue TEAM poster (left wall), corkboard with notes (right wall)
	box(p, Vector3(-3.92, 2.2, -3.0), Vector3(0.06, 1.0, 0.75), Color(0.18, 0.35, 0.6))
	box(p, Vector3(-3.88, 2.35, -3.0), Vector3(0.05, 0.18, 0.5), Color(0.9, 0.92, 0.95))
	box(p, Vector3(3.92, 2.1, -2.4), Vector3(0.06, 0.9, 1.2), Color(0.72, 0.58, 0.42))
	for note in [[1.95, -2.7, Color(0.95, 0.9, 0.4)], [2.25, -2.2, Color(0.5, 0.8, 0.95)], [1.9, -2.05, Color(0.95, 0.6, 0.6)]]:
		box(p, Vector3(3.88, note[0], note[1]), Vector3(0.05, 0.16, 0.16), note[2])
	# Tall filing cabinet + corner plant at the back
	box(p, Vector3(3.45, 0.65, -8.9), Vector3(0.55, 1.3, 0.6), Color(0.62, 0.64, 0.66), { "collide": true })
	for dy in [0.35, 0.75, 1.15]:
		box(p, Vector3(3.45, dy, -8.59), Vector3(0.35, 0.04, 0.03), Color(0.4, 0.42, 0.44))
	_plant(p, Vector3(-3.4, 0, -9.2), 1.2)

## A framed wall window: sky pane, distant skyline silhouettes and half-drawn
## venetian blinds (matches the concept board's classic office).
static func _window(p: Node3D, pos: Vector3, size: Vector2) -> void:
	box(p, pos, Vector3(size.x + 0.14, size.y + 0.14, 0.06), Color(0.85, 0.85, 0.82))      # frame
	box(p, pos + Vector3(0, 0, 0.025), Vector3(size.x, size.y, 0.04), Color(0.62, 0.78, 0.92), { "emissive": 0.35 })
	# skyline silhouettes inside the pane
	for b in [[-0.35, 0.45, 0.55], [0.05, 0.3, 0.75], [0.42, 0.5, 0.45]]:
		box(p, pos + Vector3(b[0], -size.y * 0.5 + b[2] * 0.5, 0.045), Vector3(b[1], b[2], 0.02), Color(0.38, 0.45, 0.55))
	# blinds drawn over the top half
	for i in 4:
		box(p, pos + Vector3(0, size.y * 0.5 - 0.10 - i * 0.11, 0.06), Vector3(size.x, 0.06, 0.02), Color(0.9, 0.9, 0.86))

static func _executive(p: Node3D) -> void:
	var wood := Color(0.34, 0.22, 0.13)
	# Deep red rug under the lane (visual only — the ball rolls "on" it)
	box(p, Vector3(0, 0.012, -4.2), Vector3(3.6, 0.02, 5.5), Color(0.45, 0.12, 0.12))
	box(p, Vector3(0, 0.013, -4.2), Vector3(3.2, 0.02, 5.1), Color(0.55, 0.18, 0.15))
	# Bookshelf along the left wall
	box(p, Vector3(-3.65, 1.5, -8.0), Vector3(0.55, 3.0, 2.0), wood, { "collide": true })
	var book_colors := [Color(0.55, 0.2, 0.18), Color(0.2, 0.35, 0.5), Color(0.25, 0.45, 0.25), Color(0.6, 0.5, 0.25)]
	for row in 3:
		var y := 0.65 + row * 0.85
		for i in 4:
			var c: Color = book_colors[(row + i) % book_colors.size()]
			box(p, Vector3(-3.55, y, -8.65 + i * 0.44), Vector3(0.35, 0.5, 0.36), c)
	# Painting on the back wall
	box(p, Vector3(-1.6, 2.4, -9.86), Vector3(1.7, 1.2, 0.06), Color(0.78, 0.62, 0.25))
	box(p, Vector3(-1.6, 2.4, -9.82), Vector3(1.5, 1.0, 0.06), Color(0.35, 0.5, 0.62))
	box(p, Vector3(-1.6, 2.15, -9.78), Vector3(1.5, 0.45, 0.05), Color(0.3, 0.42, 0.3))  # foothills
	# Mini basketball hoop in the back corner (decor — the desk hoop game comes later)
	box(p, Vector3(3.0, 2.65, -9.85), Vector3(0.95, 0.7, 0.06), Color(0.92, 0.92, 0.9))
	_torus(p, Vector3(3.0, 2.35, -9.55), 0.25, 0.03, Color(0.9, 0.45, 0.15))
	# Guest chairs flanking the lane near the player
	for side in [-1.0, 1.0]:
		_armchair(p, Vector3(2.9 * side, 0, -0.8), -PI * 0.45 * side)
	# Tall corner plants
	_plant(p, Vector3(3.4, 0, -9.1), 1.6)
	_plant(p, Vector3(-3.4, 0, -1.0), 1.4)
	# Warm picture lights
	_omni(p, Vector3(-2.0, 3.0, -7.0), Color(1.0, 0.85, 0.6), 0.9, 7.0)
	_omni(p, Vector3(2.0, 3.0, -2.0), Color(1.0, 0.85, 0.6), 0.7, 7.0)

static func _startup(p: Node3D) -> void:
	# Long shared work tables down both sides with monitor rows
	for side in [-1.0, 1.0]:
		box(p, Vector3(3.2 * side, 0.74, -2.2), Vector3(1.3, 0.06, 3.6), Color(0.92, 0.92, 0.9), { "collide": true })
		for lz in [-3.7, -2.2, -0.7]:
			box(p, Vector3(3.2 * side, 0.37, lz), Vector3(0.08, 0.74, 0.08), Color(0.2, 0.2, 0.22))
			_monitor(p, Vector3(3.45 * side, 0.77, lz + 0.7), PI * 0.5 * side)
			_office_chair(p, Vector3(2.7 * side, 0.0, lz + 0.7), -PI * 0.5 * side)
	# Ping-pong table along the left wall, past the work table
	box(p, Vector3(-3.15, 0.76, -7.6), Vector3(1.5, 0.06, 2.6), Color(0.12, 0.35, 0.6), { "collide": true })
	box(p, Vector3(-3.15, 0.795, -7.6), Vector3(0.04, 0.01, 2.6), Color(0.95, 0.95, 0.95))
	box(p, Vector3(-3.15, 0.86, -7.6), Vector3(1.5, 0.16, 0.03), Color(0.85, 0.88, 0.9))
	box(p, Vector3(-3.15, 0.38, -7.6), Vector3(0.9, 0.7, 0.7), Color(0.18, 0.2, 0.24))
	# Bean bags
	sphere(p, Vector3(3.2, 0.32, -7.6), 0.55, Color(0.2, 0.3, 0.65), { "squash": Vector3(1, 0.62, 1) })
	sphere(p, Vector3(3.0, 0.30, 1.4), 0.5, Color(0.45, 0.25, 0.6), { "squash": Vector3(1, 0.62, 1) })
	# Whiteboard with marker scribbles on the right wall
	box(p, Vector3(3.92, 1.9, -1.2), Vector3(0.06, 1.3, 2.3), Color(0.96, 0.96, 0.96))
	box(p, Vector3(3.88, 2.2, -0.7), Vector3(0.05, 0.05, 0.9), Color(0.85, 0.25, 0.25))
	box(p, Vector3(3.88, 1.95, -1.3), Vector3(0.05, 0.05, 1.2), Color(0.2, 0.4, 0.75))
	box(p, Vector3(3.88, 1.7, -0.9), Vector3(0.05, 0.05, 0.7), Color(0.25, 0.55, 0.3))
	# THINK / CODE / BUILD poster on the left wall
	box(p, Vector3(-3.92, 2.3, -4.5), Vector3(0.06, 1.0, 0.75), Color(0.9, 0.75, 0.2))
	box(p, Vector3(-3.88, 2.3, -4.5), Vector3(0.05, 0.7, 0.5), Color(0.15, 0.15, 0.2))
	# Hanging pendant lights over the tables
	for side in [-1.0, 1.0]:
		for lz in [-3.0, -1.0]:
			box(p, Vector3(3.2 * side, 3.0, lz), Vector3(0.025, 1.1, 0.025), Color(0.1, 0.1, 0.1))
			cylinder(p, Vector3(3.2 * side, 2.4, lz), 0.18, 0.22, Color(1.0, 0.95, 0.8), { "emissive": 2.0 })
	_plant(p, Vector3(-3.4, 0, 1.6), 1.3)

static func _archive(p: Node3D) -> void:
	# Steel shelving stacked with cardboard boxes down both walls
	for side in [-1.0, 1.0]:
		for z in [-2.0, -4.6, -7.2]:
			_shelf_unit(p, Vector3(3.4 * side, 0, z))
	# Big office copier in the back-right corner
	box(p, Vector3(3.0, 0.55, -9.0), Vector3(1.0, 1.1, 0.75), Color(0.82, 0.82, 0.80), { "collide": true })
	box(p, Vector3(3.0, 1.14, -9.0), Vector3(0.85, 0.08, 0.6), Color(0.35, 0.36, 0.38))
	box(p, Vector3(3.0, 0.95, -8.6), Vector3(0.5, 0.06, 0.12), Color(0.3, 0.65, 0.4), { "emissive": 1.2 })
	box(p, Vector3(2.6, 0.6, -8.55), Vector3(0.3, 0.05, 0.25), Color(0.9, 0.9, 0.88))  # paper tray
	# Step ladder, loose box stacks
	for side_x in [-0.2, 0.2]:
		box(p, Vector3(-3.2 + side_x, 0.8, -8.9), Vector3(0.06, 1.6, 0.06), Color(0.65, 0.65, 0.68))
	for step in 4:
		box(p, Vector3(-3.2, 0.3 + step * 0.36, -8.9), Vector3(0.42, 0.05, 0.16), Color(0.65, 0.65, 0.68))
	box(p, Vector3(2.7, 0.25, -7.3), Vector3(0.5, 0.5, 0.5), Color(0.66, 0.52, 0.36), { "collide": true })
	box(p, Vector3(2.72, 0.68, -7.32), Vector3(0.38, 0.38, 0.38), Color(0.72, 0.58, 0.40))
	box(p, Vector3(-2.7, 0.22, -6.9), Vector3(0.45, 0.44, 0.45), Color(0.6, 0.47, 0.33), { "collide": true })
	# EXIT sign and KEEP IT ORGANIZED poster
	box(p, Vector3(-1.5, 3.3, -9.85), Vector3(0.55, 0.28, 0.08), Color(0.2, 0.85, 0.35), { "emissive": 2.2 })
	box(p, Vector3(-3.92, 2.2, -3.2), Vector3(0.06, 0.8, 0.6), Color(0.92, 0.9, 0.85))
	# One warm hanging bulb — the room itself is kept dim
	box(p, Vector3(0, 3.3, -5.0), Vector3(0.025, 0.5, 0.025), Color(0.1, 0.1, 0.1))
	cylinder(p, Vector3(0, 3.0, -5.0), 0.12, 0.18, Color(1.0, 0.9, 0.7), { "emissive": 2.5 })
	_omni(p, Vector3(0, 3.0, -5.0), Color(1.0, 0.88, 0.65), 1.1, 9.0)

static func _rooftop(p: Node3D) -> void:
	# City skyline poking up beyond the parapet (visual only)
	var skyline := [
		[-7.0, -14.0, 2.6, 7.0, Color(0.42, 0.48, 0.58)],
		[-3.0, -16.0, 3.0, 9.5, Color(0.35, 0.40, 0.50)],
		[0.5, -13.5, 2.0, 5.5, Color(0.55, 0.45, 0.40)],
		[3.5, -15.0, 2.6, 8.0, Color(0.46, 0.52, 0.62)],
		[7.5, -13.0, 3.0, 6.0, Color(0.50, 0.55, 0.60)],
		[-9.5, -12.5, 2.0, 5.0, Color(0.44, 0.46, 0.52)],
		[10.0, -16.0, 2.4, 9.0, Color(0.38, 0.44, 0.55)],
	]
	for b in skyline:
		var h: float = b[3]
		box(p, Vector3(b[0], h * 0.5 - 2.0, b[1]), Vector3(b[2], h, b[2]), b[4])
		# lit windows strip
		box(p, Vector3(b[0], h * 0.5 - 1.0, b[1] + b[2] * 0.5 + 0.01), Vector3(b[2] * 0.7, h * 0.5, 0.02),
			Color(1.0, 0.9, 0.6), { "emissive": 0.8 })
	# Clouds
	for c in [[-5.0, 7.0, -14.0], [3.0, 8.0, -16.0], [9.0, 6.5, -13.0]]:
		sphere(p, Vector3(c[0], c[1], c[2]), 1.3, Color(1, 1, 1), { "squash": Vector3(2.2, 0.55, 1.0), "unshaded": true })
	# String lights across the lane on two poles per strand
	for lz in [-7.2, 0.2]:
		for side in [-1.0, 1.0]:
			box(p, Vector3(3.6 * side, 1.4, lz), Vector3(0.07, 2.8, 0.07), Color(0.25, 0.22, 0.2))
		for i in 11:
			var t := float(i) / 10.0
			var bx := -3.6 + t * 7.2
			var by := 2.75 - 0.5 * sin(PI * t)
			sphere(p, Vector3(bx, by, lz), 0.055, Color(1.0, 0.85, 0.45), { "emissive": 2.5, "unshaded": true })
	# Picnic table + benches on the right
	box(p, Vector3(3.0, 0.7, 1.0), Vector3(1.2, 0.07, 0.95), Color(0.55, 0.40, 0.25), { "collide": true })
	box(p, Vector3(3.0, 0.35, 1.0), Vector3(0.2, 0.7, 0.7), Color(0.45, 0.32, 0.2))
	for bz in [0.35, 1.65]:
		box(p, Vector3(3.0, 0.42, bz), Vector3(1.2, 0.05, 0.25), Color(0.5, 0.36, 0.22))
	# Grill on the left
	cylinder(p, Vector3(-3.2, 0.78, 0.8), 0.32, 0.36, Color(0.12, 0.12, 0.13))
	cylinder(p, Vector3(-3.2, 1.0, 0.8), 0.30, 0.10, Color(0.18, 0.18, 0.2))
	for leg in 3:
		var la := TAU * leg / 3.0
		box(p, Vector3(-3.2 + cos(la) * 0.22, 0.3, 0.8 + sin(la) * 0.22), Vector3(0.04, 0.6, 0.04), Color(0.2, 0.2, 0.22))
	# Vending machine near the back-left parapet
	box(p, Vector3(-3.35, 0.9, -8.6), Vector3(0.75, 1.8, 0.65), Color(0.12, 0.2, 0.45), { "collide": true })
	box(p, Vector3(-3.35, 1.05, -8.26), Vector3(0.5, 1.2, 0.04), Color(0.5, 0.8, 0.95), { "emissive": 0.9 })
	# Planters along the back parapet, posts for the breakable glass divider
	for px in [-2.2, 0.0, 2.2]:
		_plant(p, Vector3(px, 0, -9.5), 1.0)
	for side in [-1.0, 1.0]:
		box(p, Vector3(1.18 * side, 0.9, -8.0), Vector3(0.08, 1.8, 0.08), Color(0.6, 0.62, 0.65), { "collide": true })
	box(p, Vector3(0, 1.84, -8.0), Vector3(2.45, 0.07, 0.1), Color(0.6, 0.62, 0.65))

# ---------------------------------------------------------------------------
# Reusable furniture pieces
# ---------------------------------------------------------------------------

static func _monitor(p: Node3D, pos: Vector3, rot_y: float) -> void:
	box(p, pos + Vector3(0, 0.04, 0), Vector3(0.22, 0.03, 0.16), Color(0.15, 0.15, 0.17), { "rot_y": rot_y })
	box(p, pos + Vector3(0, 0.14, 0), Vector3(0.04, 0.2, 0.04), Color(0.15, 0.15, 0.17), { "rot_y": rot_y })
	var fwd := Vector3(sin(rot_y), 0, cos(rot_y))
	box(p, pos + Vector3(0, 0.36, 0), Vector3(0.6, 0.38, 0.04), Color(0.1, 0.1, 0.12), { "rot_y": rot_y })
	box(p, pos + Vector3(0, 0.36, 0) + fwd * 0.022, Vector3(0.54, 0.32, 0.01), Color(0.25, 0.45, 0.6), { "rot_y": rot_y, "emissive": 0.5 })

static func _office_chair(p: Node3D, pos: Vector3, rot_y: float, seat_color := Color(0.16, 0.17, 0.2)) -> void:
	box(p, pos + Vector3(0, 0.48, 0), Vector3(0.46, 0.07, 0.46), seat_color, { "rot_y": rot_y })
	var back := Vector3(-sin(rot_y), 0, -cos(rot_y)) * 0.2
	box(p, pos + back + Vector3(0, 0.78, 0), Vector3(0.44, 0.55, 0.07), seat_color, { "rot_y": rot_y })
	box(p, pos + Vector3(0, 0.24, 0), Vector3(0.05, 0.48, 0.05), Color(0.4, 0.4, 0.42))
	box(p, pos + Vector3(0, 0.02, 0), Vector3(0.4, 0.04, 0.4), Color(0.3, 0.3, 0.32), { "rot_y": rot_y })

static func _armchair(p: Node3D, pos: Vector3, rot_y: float) -> void:
	var c := Color(0.3, 0.2, 0.14)
	box(p, pos + Vector3(0, 0.3, 0), Vector3(0.7, 0.55, 0.7), c, { "rot_y": rot_y, "collide": true })
	var back := Vector3(-sin(rot_y), 0, -cos(rot_y)) * 0.28
	box(p, pos + back + Vector3(0, 0.75, 0), Vector3(0.7, 0.65, 0.16), c.darkened(0.1), { "rot_y": rot_y })

static func _plant(p: Node3D, pos: Vector3, scale: float) -> void:
	cylinder(p, pos + Vector3(0, 0.18 * scale, 0), 0.18 * scale, 0.36 * scale, Color(0.6, 0.36, 0.24))
	sphere(p, pos + Vector3(0, 0.62 * scale, 0), 0.3 * scale, Color(0.22, 0.45, 0.22))
	sphere(p, pos + Vector3(0.12 * scale, 0.85 * scale, 0.05 * scale), 0.22 * scale, Color(0.26, 0.52, 0.26))

static func _shelf_unit(p: Node3D, pos: Vector3) -> void:
	var steel := Color(0.5, 0.51, 0.54)
	for cz in [-0.62, 0.62]:
		for cx in [-0.24, 0.24]:
			box(p, pos + Vector3(cx, 1.1, cz), Vector3(0.07, 2.2, 0.07), steel)
	for level in 3:
		var y := 0.45 + level * 0.7
		box(p, pos + Vector3(0, y, 0), Vector3(0.55, 0.05, 1.3), steel.darkened(0.15), { "collide": true })
		# cardboard boxes, slightly varied
		box(p, pos + Vector3(0, y + 0.23, -0.32), Vector3(0.42, 0.4, 0.45), Color(0.68, 0.54, 0.38).darkened(0.04 * level))
		box(p, pos + Vector3(0, y + 0.2, 0.3), Vector3(0.4, 0.34, 0.4), Color(0.62, 0.48, 0.33).lightened(0.05 * level))

static func _building(p: Node3D, pos: Vector3, size: Vector3, color: Color) -> void:
	box(p, pos, size, color)

# ---------------------------------------------------------------------------
# Primitive helpers
# ---------------------------------------------------------------------------

static func box(p: Node3D, pos: Vector3, size: Vector3, color: Color, opts: Dictionary = {}) -> void:
	var mi := MeshInstance3D.new()
	var bm := BoxMesh.new()
	bm.size = size
	bm.material = _mat(color, opts)
	mi.mesh = bm
	if opts.get("collide", false):
		var body := StaticBody3D.new()
		body.collision_layer = 1
		body.collision_mask = 0
		body.position = pos
		body.rotation.y = opts.get("rot_y", 0.0)
		if opts.get("bankable", false):
			body.set_meta("bankable", true)
		body.add_child(mi)
		var cs := CollisionShape3D.new()
		var bs := BoxShape3D.new()
		bs.size = size
		cs.shape = bs
		body.add_child(cs)
		p.add_child(body)
	else:
		mi.position = pos
		mi.rotation.y = opts.get("rot_y", 0.0)
		p.add_child(mi)

static func cylinder(p: Node3D, pos: Vector3, radius: float, height: float, color: Color, opts: Dictionary = {}) -> void:
	var mi := MeshInstance3D.new()
	var cm := CylinderMesh.new()
	cm.top_radius = radius
	cm.bottom_radius = radius
	cm.height = height
	cm.radial_segments = 10
	cm.material = _mat(color, opts)
	mi.mesh = cm
	mi.position = pos
	mi.rotation.x = opts.get("rot_x", 0.0)
	mi.rotation.y = opts.get("rot_y", 0.0)
	p.add_child(mi)

static func sphere(p: Node3D, pos: Vector3, radius: float, color: Color, opts: Dictionary = {}) -> void:
	var mi := MeshInstance3D.new()
	var sm := SphereMesh.new()
	sm.radius = radius
	sm.height = radius * 2.0
	sm.radial_segments = 10
	sm.rings = 6
	sm.material = _mat(color, opts)
	mi.mesh = sm
	mi.position = pos
	if opts.has("squash"):
		mi.scale = opts["squash"]
	p.add_child(mi)

static func _torus(p: Node3D, pos: Vector3, ring_radius: float, tube_radius: float, color: Color) -> void:
	var mi := MeshInstance3D.new()
	var tm := TorusMesh.new()
	tm.inner_radius = ring_radius - tube_radius
	tm.outer_radius = ring_radius + tube_radius
	tm.material = _mat(color, {})
	mi.mesh = tm
	mi.position = pos
	p.add_child(mi)

static func _omni(p: Node3D, pos: Vector3, color: Color, energy: float, light_range: float) -> void:
	var l := OmniLight3D.new()
	l.position = pos
	l.light_color = color
	l.light_energy = energy
	l.omni_range = light_range
	l.shadow_enabled = false   # keep mobile cost down
	p.add_child(l)

static func _mat(color: Color, opts: Dictionary) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = color
	m.roughness = opts.get("roughness", 0.85)
	var glow: float = opts.get("emissive", 0.0)
	if glow > 0.0:
		m.emission_enabled = true
		m.emission = color
		m.emission_energy_multiplier = glow
	if color.a < 1.0:
		m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	if opts.get("unshaded", false):
		m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	return m
