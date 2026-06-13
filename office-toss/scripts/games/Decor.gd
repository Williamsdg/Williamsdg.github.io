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
	var leather := Color(0.13, 0.13, 0.15)
	# Deep red rug under the lane (visual only — the ball rolls "on" it)
	box(p, Vector3(0, 0.012, -4.2), Vector3(3.6, 0.02, 5.5), Color(0.45, 0.12, 0.12))
	box(p, Vector3(0, 0.013, -4.2), Vector3(3.2, 0.02, 5.1), Color(0.55, 0.18, 0.15))
	# The boss's tall black leather chair behind the big desk (offset from
	# center so it doesn't block straight bin shots).
	_office_chair(p, Vector3(-0.9, 0.12, -3.6), 0.0, leather)
	box(p, Vector3(-0.9, 1.32, -3.85), Vector3(0.5, 0.35, 0.09), leather)  # tall headrest
	# Bookshelf on the back wall, right of the painting
	box(p, Vector3(0.55, 1.5, -9.7), Vector3(1.9, 3.0, 0.5), wood, { "collide": true })
	var book_colors := [Color(0.55, 0.2, 0.18), Color(0.2, 0.35, 0.5), Color(0.25, 0.45, 0.25), Color(0.6, 0.5, 0.25)]
	for row in 3:
		var y := 0.65 + row * 0.85
		for i in 4:
			var c: Color = book_colors[(row + i) % book_colors.size()]
			box(p, Vector3(-0.1 + i * 0.44, y, -9.6), Vector3(0.36, 0.5, 0.3), c)
	# Mountain painting on the back wall, left side
	box(p, Vector3(-2.4, 2.4, -9.86), Vector3(1.7, 1.2, 0.06), Color(0.78, 0.62, 0.25))
	box(p, Vector3(-2.4, 2.4, -9.82), Vector3(1.5, 1.0, 0.06), Color(0.35, 0.5, 0.62))
	box(p, Vector3(-2.4, 2.15, -9.78), Vector3(1.5, 0.45, 0.05), Color(0.3, 0.42, 0.3))  # foothills
	# Big window with the city skyline, back-right (the hoop target mounts
	# beside it at x≈3.3 — built by TrashToss).
	_window(p, Vector3(2.2, 2.35, -9.86), Vector2(1.2, 1.7))
	# Credenza along the right wall with framed photos and a small plant
	box(p, Vector3(3.5, 0.45, -4.2), Vector3(0.55, 0.9, 2.3), wood, { "collide": true })
	box(p, Vector3(3.45, 1.07, -3.6), Vector3(0.05, 0.3, 0.26), Color(0.7, 0.6, 0.35))
	box(p, Vector3(3.45, 1.05, -4.8), Vector3(0.05, 0.26, 0.22), Color(0.55, 0.55, 0.58))
	_plant(p, Vector3(3.5, 0.9, -4.2), 0.5)
	# Wooden filing cabinet on the left wall
	box(p, Vector3(-3.5, 0.75, -5.5), Vector3(0.5, 1.5, 0.6), wood.lightened(0.1), { "collide": true })
	for dy in [0.5, 0.95, 1.35]:
		box(p, Vector3(-3.24, dy, -5.5), Vector3(0.02, 0.03, 0.3), Color(0.75, 0.65, 0.4))
	# Side table with a warm lamp on the left
	box(p, Vector3(-3.3, 0.28, -2.6), Vector3(0.5, 0.56, 0.5), wood)
	cylinder(p, Vector3(-3.3, 0.66, -2.6), 0.04, 0.2, Color(0.6, 0.5, 0.3))
	cylinder(p, Vector3(-3.3, 0.88, -2.6), 0.16, 0.22, Color(1.0, 0.9, 0.65), { "emissive": 1.6 })
	_omni(p, Vector3(-3.3, 1.1, -2.6), Color(1.0, 0.85, 0.6), 0.8, 6.0)
	# Black leather guest chairs flanking the lane near the player
	for side in [-1.0, 1.0]:
		_armchair(p, Vector3(2.9 * side, 0, -0.8), -PI * 0.45 * side, leather)
	# Tall corner plants
	_plant(p, Vector3(-3.4, 0, -9.1), 1.6)
	_plant(p, Vector3(3.4, 0, -1.9), 1.4)
	# Warm picture lights
	_omni(p, Vector3(-2.0, 3.0, -7.0), Color(1.0, 0.85, 0.6), 0.9, 7.0)
	_omni(p, Vector3(2.0, 3.0, -2.0), Color(1.0, 0.85, 0.6), 0.7, 7.0)

static func _startup(p: Node3D) -> void:
	var green := Color(0.45, 0.72, 0.25)   # lime-green chair accent from the render
	var table_c := Color(0.62, 0.46, 0.30) # warm butcher-block desk tops
	# Exposed-concrete pillars down the room
	for pz in [-2.0, -7.0]:
		for side in [-1.0, 1.0]:
			box(p, Vector3(3.7 * side, 1.8, pz), Vector3(0.45, 3.6, 0.45), Color(0.58, 0.58, 0.60))
	# Long shared work benches down both sides, paired green chairs + monitors
	for side in [-1.0, 1.0]:
		box(p, Vector3(3.1 * side, 0.74, -2.2), Vector3(1.2, 0.06, 3.8), table_c, { "collide": true })
		box(p, Vector3(3.1 * side, 0.37, -2.2), Vector3(0.08, 0.74, 3.4), Color(0.15, 0.15, 0.17))  # bench leg beam
		for lz in [-3.6, -2.2, -0.8]:
			_monitor(p, Vector3(3.35 * side, 0.77, lz), PI * 0.5 * side)
			_office_chair(p, Vector3(2.55 * side, 0.0, lz), -PI * 0.5 * side, green)
	# A second cluster of pod desks down the middle-back (kept out of the lane)
	for side in [-1.0, 1.0]:
		box(p, Vector3(1.4 * side, 0.74, -8.2), Vector3(1.1, 0.06, 1.4), table_c, { "collide": true })
		_monitor(p, Vector3(1.4 * side, 0.77, -8.5), 0.0)
		_office_chair(p, Vector3(1.4 * side, 0.0, -7.5), PI, green)
	# Ping-pong table along the left wall, past the work bench
	box(p, Vector3(-3.25, 0.76, -7.6), Vector3(1.4, 0.06, 2.6), Color(0.12, 0.35, 0.6), { "collide": true })
	box(p, Vector3(-3.25, 0.795, -7.6), Vector3(0.04, 0.01, 2.6), Color(0.95, 0.95, 0.95))
	box(p, Vector3(-3.25, 0.86, -7.6), Vector3(1.4, 0.16, 0.03), Color(0.85, 0.88, 0.9))
	box(p, Vector3(-3.25, 0.38, -7.6), Vector3(0.9, 0.7, 0.7), Color(0.18, 0.2, 0.24))
	# Blue bean bag near the player, like the render's foreground
	sphere(p, Vector3(-3.0, 0.34, 1.0), 0.6, Color(0.16, 0.30, 0.62), { "squash": Vector3(1, 0.6, 1) })
	sphere(p, Vector3(-3.0, 0.62, 1.0), 0.42, Color(0.18, 0.34, 0.68), { "squash": Vector3(1, 0.55, 1) })
	# Exposed-brick left wall with a wooden shelf of supplies
	box(p, Vector3(-3.95, 1.8, -5.0), Vector3(0.06, 3.6, 6.0), Color(0.52, 0.34, 0.28))
	for sy in [1.2, 1.9]:
		box(p, Vector3(-3.78, sy, -5.0), Vector3(0.3, 0.05, 2.4), Color(0.6, 0.45, 0.3))
		for bx in [-1.0, -0.3, 0.4, 1.0]:
			box(p, Vector3(-3.78, sy + 0.22, -5.0 + bx), Vector3(0.22, 0.36, 0.3),
				Color(0.6, 0.3, 0.3).lerp(Color(0.3, 0.5, 0.6), absf(bx)))
	# THINK / CODE / BUILD / REPEAT poster, top-left on the brick
	box(p, Vector3(-3.9, 2.6, -8.5), Vector3(0.06, 1.1, 1.0), Color(0.95, 0.95, 0.92))
	for i in 4:
		box(p, Vector3(-3.86, 2.95 - i * 0.22, -8.5), Vector3(0.05, 0.12, 0.7), Color(0.15, 0.15, 0.2))
	# Whiteboard with magnets/notes near the back-left
	box(p, Vector3(-3.9, 2.0, -2.4), Vector3(0.06, 1.2, 2.0), Color(0.97, 0.97, 0.97))
	for note in [[2.3, -1.8, Color(0.9, 0.3, 0.3)], [2.0, -2.6, Color(0.3, 0.5, 0.85)], [1.7, -2.0, Color(0.95, 0.85, 0.3)]]:
		box(p, Vector3(-3.86, note[0], note[1]), Vector3(0.05, 0.14, 0.18), note[2])
	# Hanging pendant lights over the benches
	for side in [-1.0, 1.0]:
		for lz in [-3.0, -1.0]:
			box(p, Vector3(3.1 * side, 3.0, lz), Vector3(0.025, 1.1, 0.025), Color(0.1, 0.1, 0.1))
			cylinder(p, Vector3(3.1 * side, 2.4, lz), 0.18, 0.22, Color(1.0, 0.95, 0.8), { "emissive": 2.0 })
	_plant(p, Vector3(-3.4, 0, -0.4), 1.3)
	_plant(p, Vector3(3.5, 0, -9.0), 1.4)

static func _archive(p: Node3D) -> void:
	var dark_steel := Color(0.30, 0.31, 0.34)
	# Dark steel shelving stacked with cardboard boxes down the left wall,
	# plus one unit at the front-right (the right side hosts the work area).
	for z in [-3.4, -6.0, -8.6]:
		_shelf_unit(p, Vector3(-3.4, 0, z), dark_steel)
	_shelf_unit(p, Vector3(3.4, 0, -1.4), dark_steel)
	# Big office copier, front-left like the render
	box(p, Vector3(-3.15, 0.3, -0.8), Vector3(1.0, 0.6, 0.75), Color(0.80, 0.80, 0.78), { "collide": true })
	box(p, Vector3(-3.15, 0.78, -0.8), Vector3(0.9, 0.36, 0.68), Color(0.86, 0.86, 0.84))
	box(p, Vector3(-3.15, 1.02, -0.8), Vector3(0.95, 0.12, 0.62), Color(0.70, 0.70, 0.68))
	box(p, Vector3(-3.0, 1.12, -0.5), Vector3(0.3, 0.05, 0.16), Color(0.3, 0.65, 0.4), { "emissive": 1.2 })  # control panel
	box(p, Vector3(-2.85, 0.62, -0.45), Vector3(0.35, 0.04, 0.28), Color(0.92, 0.92, 0.9))  # output tray
	# KEEP IT ORGANIZED framed sign above the copier
	box(p, Vector3(-3.92, 2.35, -0.9), Vector3(0.06, 0.95, 0.75), Color(0.2, 0.2, 0.22))
	box(p, Vector3(-3.89, 2.35, -0.9), Vector3(0.05, 0.8, 0.6), Color(0.94, 0.93, 0.9))
	for i in 3:
		box(p, Vector3(-3.86, 2.6 - i * 0.22, -0.9), Vector3(0.05, 0.1, 0.42), Color(0.25, 0.25, 0.28))
	# Step ladder, center-back behind the bin area
	for lx in [-0.22, 0.22]:
		box(p, Vector3(-1.85 + lx, 0.8, -8.7), Vector3(0.06, 1.6, 0.06), Color(0.62, 0.62, 0.65), { "collide": true })
	for step in 4:
		box(p, Vector3(-1.85, 0.3 + step * 0.36, -8.7), Vector3(0.5, 0.05, 0.16), Color(0.62, 0.62, 0.65))
	# Dark door with EXIT sign, back-right
	box(p, Vector3(2.6, 1.1, -9.88), Vector3(0.95, 2.2, 0.08), Color(0.24, 0.25, 0.27))
	box(p, Vector3(2.27, 1.05, -9.82), Vector3(0.06, 0.16, 0.05), Color(0.7, 0.7, 0.72))
	box(p, Vector3(2.6, 2.45, -9.85), Vector3(0.55, 0.26, 0.08), Color(0.2, 0.85, 0.35), { "emissive": 2.2 })
	# Coat rack with a yellow coat by the door
	cylinder(p, Vector3(3.65, 0.85, -8.8), 0.035, 1.7, Color(0.35, 0.26, 0.18))
	for a in [0.0, PI * 0.5, PI, PI * 1.5]:
		box(p, Vector3(3.65 + cos(a) * 0.14, 1.62, -8.8 + sin(a) * 0.14), Vector3(0.2, 0.03, 0.03), Color(0.35, 0.26, 0.18), { "rot_y": a })
	box(p, Vector3(3.52, 1.25, -8.7), Vector3(0.32, 0.62, 0.1), Color(0.85, 0.72, 0.2))
	# Wooden work table, right-center, with boxes and gear on top
	box(p, Vector3(3.1, 0.74, -3.7), Vector3(1.3, 0.07, 1.1), Color(0.6, 0.44, 0.28), { "collide": true })
	for leg in [[-0.55, -4.15], [0.55, -4.15], [-0.55, -3.25], [0.55, -3.25]]:
		box(p, Vector3(3.1 + leg[0], 0.37, leg[1]), Vector3(0.08, 0.74, 0.08), Color(0.5, 0.36, 0.22))
	box(p, Vector3(2.85, 0.95, -3.9), Vector3(0.36, 0.34, 0.36), Color(0.68, 0.54, 0.38))
	box(p, Vector3(3.4, 0.88, -3.5), Vector3(0.28, 0.2, 0.28), Color(0.62, 0.48, 0.33))
	box(p, Vector3(3.1, 0.83, -3.3), Vector3(0.2, 0.12, 0.16), Color(0.2, 0.2, 0.24))
	# Loose box stacks at the back-left
	box(p, Vector3(-2.6, 0.25, -9.3), Vector3(0.5, 0.5, 0.5), Color(0.66, 0.52, 0.36), { "collide": true })
	box(p, Vector3(-2.58, 0.68, -9.32), Vector3(0.38, 0.38, 0.38), Color(0.72, 0.58, 0.40))
	box(p, Vector3(-2.7, 0.22, -6.9), Vector3(0.45, 0.44, 0.45), Color(0.6, 0.47, 0.33), { "collide": true })
	# One warm hanging bulb — the room itself is kept dim
	box(p, Vector3(0, 3.3, -5.0), Vector3(0.025, 0.5, 0.025), Color(0.1, 0.1, 0.1))
	cylinder(p, Vector3(0, 3.0, -5.0), 0.12, 0.18, Color(1.0, 0.9, 0.7), { "emissive": 2.5 })
	_omni(p, Vector3(0, 3.0, -5.0), Color(1.0, 0.88, 0.65), 1.1, 9.0)
	_omni(p, Vector3(-3.0, 2.2, -0.8), Color(0.9, 0.92, 1.0), 0.5, 5.0)

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

static func _armchair(p: Node3D, pos: Vector3, rot_y: float, c := Color(0.3, 0.2, 0.14)) -> void:
	box(p, pos + Vector3(0, 0.3, 0), Vector3(0.7, 0.55, 0.7), c, { "rot_y": rot_y, "collide": true })
	var back := Vector3(-sin(rot_y), 0, -cos(rot_y)) * 0.28
	box(p, pos + back + Vector3(0, 0.75, 0), Vector3(0.7, 0.65, 0.16), c.darkened(0.1), { "rot_y": rot_y })

static func _plant(p: Node3D, pos: Vector3, scale: float) -> void:
	cylinder(p, pos + Vector3(0, 0.18 * scale, 0), 0.18 * scale, 0.36 * scale, Color(0.6, 0.36, 0.24))
	sphere(p, pos + Vector3(0, 0.62 * scale, 0), 0.3 * scale, Color(0.22, 0.45, 0.22))
	sphere(p, pos + Vector3(0.12 * scale, 0.85 * scale, 0.05 * scale), 0.22 * scale, Color(0.26, 0.52, 0.26))

static func _shelf_unit(p: Node3D, pos: Vector3, steel := Color(0.5, 0.51, 0.54)) -> void:
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
