/* ============================================
   BRIARWOOD COMMUNITY ASSOCIATION
   Mock Data Layer & Persistence
   ============================================ */

(function() {
  'use strict';

  var now = new Date();

  // --- Date helpers ---
  function daysAgo(n) {
    var d = new Date(now);
    d.setDate(d.getDate() - n);
    return d;
  }
  function daysFromNow(n) {
    var d = new Date(now);
    d.setDate(d.getDate() + n);
    return d;
  }
  function hoursAgo(n) {
    var d = new Date(now);
    d.setHours(d.getHours() - n);
    return d;
  }
  function minutesAgo(n) {
    var d = new Date(now);
    d.setMinutes(d.getMinutes() - n);
    return d;
  }
  function formatDate(d) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
  function formatShortDate(d) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getMonth()] + ' ' + d.getDate();
  }
  function formatTime(d) {
    var h = d.getHours();
    var m = d.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
  }

  // ============================================
  // COMMUNITIES (8 total = 850 homes)
  // ============================================
  var communities = [
    { id: 'briarwood-oaks', name: 'Briarwood Oaks', location: 'Briarwood, Hoover', homes: 140, healthGrade: 'A', healthScore: 94, collectionRate: 96.8, activeIssues: 2, manager: 'Margaret Chen', boardPresident: 'Thomas Pierce', assessment: 285, established: 2002, reserveFund: 380000, annualBudget: 478800 },
    { id: 'willowbrook', name: 'Willowbrook', location: 'Briarwood, Hoover', homes: 130, healthGrade: 'A-', healthScore: 91, collectionRate: 95.4, activeIssues: 3, manager: 'Margaret Chen', boardPresident: 'Catherine Moore', assessment: 275, established: 2003, reserveFund: 340000, annualBudget: 429000 },
    { id: 'stonehaven', name: 'Stonehaven', location: 'Briarwood, Hoover', homes: 110, healthGrade: 'A', healthScore: 93, collectionRate: 96.2, activeIssues: 1, manager: 'Margaret Chen', boardPresident: 'Linda Morris', assessment: 300, established: 2001, reserveFund: 312000, annualBudget: 396000 },
    { id: 'the-vineyards', name: 'The Vineyards', location: 'Briarwood, Hoover', homes: 105, healthGrade: 'A-', healthScore: 90, collectionRate: 95.0, activeIssues: 2, manager: 'Margaret Chen', boardPresident: 'James Elliott', assessment: 290, established: 2004, reserveFund: 285000, annualBudget: 365400 },
    { id: 'pinehurst-reserve', name: 'Pinehurst Reserve', location: 'Briarwood, Hoover', homes: 105, healthGrade: 'B+', healthScore: 87, collectionRate: 92.6, activeIssues: 4, manager: 'Diana Reed', boardPresident: 'Patricia Hayes', assessment: 260, established: 2006, reserveFund: 240000, annualBudget: 327600 },
    { id: 'the-meadows', name: 'The Meadows', location: 'Briarwood, Hoover', homes: 95, healthGrade: 'A-', healthScore: 89, collectionRate: 94.8, activeIssues: 2, manager: 'Diana Reed', boardPresident: 'Elizabeth Ward', assessment: 270, established: 2005, reserveFund: 225000, annualBudget: 307800 },
    { id: 'ashbury-hill', name: 'Ashbury Hill', location: 'Briarwood, Hoover', homes: 90, healthGrade: 'B+', healthScore: 85, collectionRate: 91.4, activeIssues: 3, manager: 'Diana Reed', boardPresident: 'William Foster', assessment: 250, established: 2008, reserveFund: 195000, annualBudget: 270000 },
    { id: 'magnolia-grove', name: 'Magnolia Grove', location: 'Briarwood, Hoover', homes: 75, healthGrade: 'B', healthScore: 82, collectionRate: 89.6, activeIssues: 3, manager: 'Diana Reed', boardPresident: 'Donna Mitchell', assessment: 235, established: 2010, reserveFund: 142000, annualBudget: 211500 }
  ];

  // Computed totals
  var totalHomes = 0;
  var totalActiveIssues = 0;
  for (var i = 0; i < communities.length; i++) {
    totalHomes += communities[i].homes;
    totalActiveIssues += communities[i].activeIssues;
  }

  // ============================================
  // RESIDENTS (35 sample records)
  // ============================================
  var residents = [
    { id: 'R-001', firstName: 'Daniel', lastName: 'Foster', initials: 'DF', email: 'daniel.foster@email.com', phone: '(205) 555-1842', address: '412 Briarwood Oaks Way', community: 'briarwood-oaks', communityName: 'Briarwood Oaks', status: 'current', balance: 275.00, lastPayment: daysAgo(12), moveInDate: '2019-06-15', avatarColor: 'navy' },
    { id: 'R-002', firstName: 'Rachel', lastName: 'Foster', initials: 'RF', email: 'rachel.foster@email.com', phone: '(205) 555-0421', address: '421 Whiteoak Ln', community: 'briarwood-oaks', communityName: 'Briarwood Oaks', status: 'current', balance: 0, lastPayment: daysAgo(5), moveInDate: '2020-03-10', avatarColor: 'teal' },
    { id: 'R-003', firstName: 'James', lastName: 'Cooper', initials: 'JC', email: 'james.cooper@email.com', phone: '(205) 555-0387', address: '387 Vineyard Way', community: 'the-vineyards', communityName: 'The Vineyards', status: 'past-due', balance: 550.00, lastPayment: daysAgo(45), moveInDate: '2017-11-22', avatarColor: 'gold' },
    { id: 'R-004', firstName: 'Amanda', lastName: 'Price', initials: 'AP', email: 'amanda.price@email.com', phone: '(205) 555-0156', address: '156 Meadowview Dr', community: 'the-meadows', communityName: 'The Meadows', status: 'current', balance: 0, lastPayment: daysAgo(8), moveInDate: '2021-08-01', avatarColor: 'teal' },
    { id: 'R-005', firstName: 'Nathan', lastName: 'Brooks', initials: 'NB', email: 'nathan.brooks@email.com', phone: '(205) 555-0293', address: '293 Magnolia Grove Dr', community: 'magnolia-grove', communityName: 'Magnolia Grove', status: 'delinquent', balance: 825.00, lastPayment: daysAgo(95), moveInDate: '2018-04-15', avatarColor: 'navy' },
    { id: 'R-006', firstName: 'Jennifer', lastName: 'Murphy', initials: 'JM', email: 'jennifer.murphy@email.com', phone: '(205) 555-0744', address: '744 Pinehurst Dr', community: 'pinehurst-reserve', communityName: 'Pinehurst Reserve', status: 'current', balance: 0, lastPayment: daysAgo(3), moveInDate: '2016-09-30', avatarColor: 'gold' },
    { id: 'R-007', firstName: 'David', lastName: 'Chen', initials: 'DC', email: 'david.chen@email.com', phone: '(205) 555-0518', address: '518 Willowbrook Dr', community: 'willowbrook', communityName: 'Willowbrook', status: 'current', balance: 250.00, lastPayment: daysAgo(20), moveInDate: '2019-01-12', avatarColor: 'teal' },
    { id: 'R-008', firstName: 'Sarah', lastName: 'Williams', initials: 'SW', email: 'sarah.williams@email.com', phone: '(205) 555-0629', address: '629 Stonehaven Ct', community: 'stonehaven', communityName: 'Stonehaven', status: 'current', balance: 0, lastPayment: daysAgo(7), moveInDate: '2020-11-05', avatarColor: 'navy' },
    { id: 'R-009', firstName: 'Christopher', lastName: 'Taylor', initials: 'CT', email: 'chris.taylor@email.com', phone: '(205) 555-0831', address: '831 Meadow Glen Ln', community: 'the-meadows', communityName: 'The Meadows', status: 'past-due', balance: 450.00, lastPayment: daysAgo(62), moveInDate: '2018-07-20', avatarColor: 'gold' },
    { id: 'R-010', firstName: 'Emily', lastName: 'Johnson', initials: 'EJ', email: 'emily.johnson@email.com', phone: '(205) 555-0275', address: '275 Magnolia Grove Dr', community: 'magnolia-grove', communityName: 'Magnolia Grove', status: 'current', balance: 0, lastPayment: daysAgo(2), moveInDate: '2021-03-18', avatarColor: 'teal' },
    { id: 'R-011', firstName: 'Robert', lastName: 'Martinez', initials: 'RM', email: 'robert.martinez@email.com', phone: '(205) 555-0912', address: '912 Ashbury Ln', community: 'ashbury-hill', communityName: 'Ashbury Hill', status: 'current', balance: 250.00, lastPayment: daysAgo(18), moveInDate: '2017-05-10', avatarColor: 'navy' },
    { id: 'R-012', firstName: 'Laura', lastName: 'Anderson', initials: 'LA', email: 'laura.anderson@email.com', phone: '(205) 555-0463', address: '463 Willowbrook Dr', community: 'willowbrook', communityName: 'Willowbrook', status: 'current', balance: 0, lastPayment: daysAgo(6), moveInDate: '2015-12-01', avatarColor: 'gold' },
    { id: 'R-013', firstName: 'Thomas', lastName: 'Wilson', initials: 'TW', email: 'thomas.wilson@email.com', phone: '(205) 555-0188', address: '188 Stonehaven Dr', community: 'stonehaven', communityName: 'Stonehaven', status: 'current', balance: 325.00, lastPayment: daysAgo(14), moveInDate: '2019-09-22', avatarColor: 'teal' },
    { id: 'R-014', firstName: 'Maria', lastName: 'Garcia', initials: 'MG', email: 'maria.garcia@email.com', phone: '(205) 555-0347', address: '347 Ashbury Ln', community: 'ashbury-hill', communityName: 'Ashbury Hill', status: 'current', balance: 0, lastPayment: daysAgo(4), moveInDate: '2020-06-14', avatarColor: 'navy' },
    { id: 'R-015', firstName: 'Daniel', lastName: 'Thompson', initials: 'DT', email: 'daniel.thompson@email.com', phone: '(205) 555-0556', address: '556 Briarwood Oaks Way', community: 'briarwood-oaks', communityName: 'Briarwood Oaks', status: 'delinquent', balance: 1100.00, lastPayment: daysAgo(120), moveInDate: '2016-02-28', avatarColor: 'gold' },
    { id: 'R-016', firstName: 'Ashley', lastName: 'Brown', initials: 'AB', email: 'ashley.brown@email.com', phone: '(205) 555-0721', address: '721 Briarwood Oaks Cir', community: 'briarwood-oaks', communityName: 'Briarwood Oaks', status: 'current', balance: 0, lastPayment: daysAgo(9), moveInDate: '2022-01-15', avatarColor: 'teal' },
    { id: 'R-017', firstName: 'Kevin', lastName: 'Davis', initials: 'KD', email: 'kevin.davis@email.com', phone: '(205) 555-0894', address: '894 Willowbrook Dr', community: 'willowbrook', communityName: 'Willowbrook', status: 'current', balance: 250.00, lastPayment: daysAgo(22), moveInDate: '2018-10-05', avatarColor: 'navy' },
    { id: 'R-018', firstName: 'Jessica', lastName: 'Moore', initials: 'JM2', email: 'jessica.moore@email.com', phone: '(205) 555-0135', address: '135 Briarwood Oaks Ln', community: 'briarwood-oaks', communityName: 'Briarwood Oaks', status: 'current', balance: 0, lastPayment: daysAgo(1), moveInDate: '2020-04-20', avatarColor: 'gold' },
    { id: 'R-019', firstName: 'Andrew', lastName: 'Jackson', initials: 'AJ', email: 'andrew.jackson@email.com', phone: '(205) 555-0467', address: '467 Pinehurst Dr', community: 'pinehurst-reserve', communityName: 'Pinehurst Reserve', status: 'current', balance: 350.00, lastPayment: daysAgo(16), moveInDate: '2017-07-12', avatarColor: 'teal' },
    { id: 'R-020', firstName: 'Stephanie', lastName: 'White', initials: 'SW2', email: 'stephanie.white@email.com', phone: '(205) 555-0683', address: '683 Vineyard Way', community: 'the-vineyards', communityName: 'The Vineyards', status: 'current', balance: 0, lastPayment: daysAgo(10), moveInDate: '2021-11-30', avatarColor: 'navy' },
    { id: 'R-021', firstName: 'Brian', lastName: 'Harris', initials: 'BH', email: 'brian.harris@email.com', phone: '(205) 555-0259', address: '259 Willowbrook Dr', community: 'willowbrook', communityName: 'Willowbrook', status: 'past-due', balance: 550.00, lastPayment: daysAgo(55), moveInDate: '2019-03-08', avatarColor: 'gold' },
    { id: 'R-022', firstName: 'Nicole', lastName: 'Lewis', initials: 'NL', email: 'nicole.lewis@email.com', phone: '(205) 555-0941', address: '941 Stonehaven Dr', community: 'stonehaven', communityName: 'Stonehaven', status: 'current', balance: 0, lastPayment: daysAgo(3), moveInDate: '2022-05-17', avatarColor: 'teal' },
    { id: 'R-023', firstName: 'Mark', lastName: 'Robinson', initials: 'MR', email: 'mark.robinson@email.com', phone: '(205) 555-0378', address: '378 Ashbury Ln', community: 'ashbury-hill', communityName: 'Ashbury Hill', status: 'current', balance: 250.00, lastPayment: daysAgo(19), moveInDate: '2016-08-25', avatarColor: 'navy' },
    { id: 'R-024', firstName: 'Kimberly', lastName: 'Clark', initials: 'KC', email: 'kim.clark@email.com', phone: '(205) 555-0612', address: '612 Briarwood Oaks Way', community: 'briarwood-oaks', communityName: 'Briarwood Oaks', status: 'current', balance: 0, lastPayment: daysAgo(7), moveInDate: '2020-09-14', avatarColor: 'gold' },
    { id: 'R-025', firstName: 'Jason', lastName: 'Walker', initials: 'MC'', email: 'jason.walker@email.com', phone: '(205) 555-0845', address: '845 Stonehaven Ct', community: 'stonehaven', communityName: 'Stonehaven', status: 'current', balance: 300.00, lastPayment: daysAgo(15), moveInDate: '2018-12-01', avatarColor: 'teal' },
    { id: 'R-026', firstName: 'Megan', lastName: 'Hall', initials: 'MH', email: 'megan.hall@email.com', phone: '(205) 555-0176', address: '176 Meadow Glen Ln', community: 'the-meadows', communityName: 'The Meadows', status: 'delinquent', balance: 675.00, lastPayment: daysAgo(88), moveInDate: '2017-04-22', avatarColor: 'navy' },
    { id: 'R-027', firstName: 'Ryan', lastName: 'Allen', initials: 'RA', email: 'ryan.allen@email.com', phone: '(205) 555-0534', address: '534 Meadowview Dr', community: 'the-meadows', communityName: 'The Meadows', status: 'current', balance: 0, lastPayment: daysAgo(6), moveInDate: '2021-06-10', avatarColor: 'gold' },
    { id: 'R-028', firstName: 'Lisa', lastName: 'Young', initials: 'LY', email: 'lisa.young@email.com', phone: '(205) 555-0793', address: '793 Magnolia Grove Dr', community: 'magnolia-grove', communityName: 'Magnolia Grove', status: 'past-due', balance: 450.00, lastPayment: daysAgo(48), moveInDate: '2019-11-18', avatarColor: 'teal' },
    { id: 'R-029', firstName: 'Timothy', lastName: 'King', initials: 'TK', email: 'timothy.king@email.com', phone: '(205) 555-0367', address: '367 Magnolia Grove Dr', community: 'magnolia-grove', communityName: 'Magnolia Grove', status: 'current', balance: 275.00, lastPayment: daysAgo(13), moveInDate: '2020-02-05', avatarColor: 'navy' },
    { id: 'R-030', firstName: 'Rebecca', lastName: 'Wright', initials: 'RW', email: 'rebecca.wright@email.com', phone: '(205) 555-0629', address: '629 Ashbury Ln', community: 'ashbury-hill', communityName: 'Ashbury Hill', status: 'current', balance: 0, lastPayment: daysAgo(4), moveInDate: '2022-07-20', avatarColor: 'gold' },
    { id: 'R-031', firstName: 'Patrick', lastName: 'Scott', initials: 'PS', email: 'patrick.scott@email.com', phone: '(205) 555-0482', address: '482 Willowbrook Dr', community: 'willowbrook', communityName: 'Willowbrook', status: 'current', balance: 0, lastPayment: daysAgo(2), moveInDate: '2015-10-12', avatarColor: 'teal' },
    { id: 'R-032', firstName: 'Angela', lastName: 'Green', initials: 'AG', email: 'angela.green@email.com', phone: '(205) 555-0815', address: '815 Stonehaven Dr', community: 'stonehaven', communityName: 'Stonehaven', status: 'current', balance: 325.00, lastPayment: daysAgo(17), moveInDate: '2019-05-30', avatarColor: 'navy' },
    { id: 'R-033', firstName: 'Eric', lastName: 'Adams', initials: 'EA', email: 'eric.adams@email.com', phone: '(205) 555-0153', address: '153 Ashbury Ln', community: 'ashbury-hill', communityName: 'Ashbury Hill', status: 'current', balance: 0, lastPayment: daysAgo(5), moveInDate: '2021-01-08', avatarColor: 'gold' },
    { id: 'R-034', firstName: 'Heather', lastName: 'Nelson', initials: 'HN', email: 'heather.nelson@email.com', phone: '(205) 555-0696', address: '696 Briarwood Oaks Way', community: 'briarwood-oaks', communityName: 'Briarwood Oaks', status: 'current', balance: 275.00, lastPayment: daysAgo(11), moveInDate: '2018-06-25', avatarColor: 'teal' },
    { id: 'R-035', firstName: 'Gregory', lastName: 'Carter', initials: 'GC', email: 'gregory.carter@email.com', phone: '(205) 555-0928', address: '928 Briarwood Oaks Cir', community: 'briarwood-oaks', communityName: 'Briarwood Oaks', status: 'current', balance: 0, lastPayment: daysAgo(1), moveInDate: '2023-02-14', avatarColor: 'navy' }
  ];

  // ============================================
  // WORK ORDERS
  // ============================================
  var workOrders = [
    { id: 'WO-1247', community: 'briarwood-oaks', communityName: 'Briarwood Oaks', title: 'Streetlight flickering on Magnolia Dr', description: 'Streetlight at the corner of Magnolia Dr and Oak intersection has been flickering intermittently for 2 weeks.', category: 'Electrical', priority: 'medium', status: 'in-progress', assignedTo: 'Carlos Reyes', estimatedCost: 450, createdDate: daysAgo(3), updatedDate: hoursAgo(6), reportedBy: 'Daniel Foster', timeline: [{ date: daysAgo(3), action: 'Created', actor: 'Daniel Foster', note: 'Reported via member portal' }, { date: daysAgo(2), action: 'Assigned', actor: 'Margaret Chen', note: 'Assigned to Carlos Reyes' }, { date: hoursAgo(6), action: 'Updated', actor: 'Carlos Reyes', note: 'Contacted Alabama Power, scheduled for inspection' }] },
    { id: 'WO-1246', community: 'the-vineyards', communityName: 'The Vineyards', title: 'Fence section down after storm', description: 'Section of community fence along Vineyard Way collapsed during last week\'s storm. Approximately 20ft section.', category: 'Fencing', priority: 'high', status: 'assigned', assignedTo: 'Regional Fence Co.', estimatedCost: 2800, createdDate: daysAgo(2), updatedDate: daysAgo(1), reportedBy: 'Margaret Chen', timeline: [{ date: daysAgo(2), action: 'Created', actor: 'Margaret Chen', note: 'Storm damage reported by multiple residents' }, { date: daysAgo(1), action: 'Assigned', actor: 'Diana Reed', note: 'Vendor Regional Fence Co. notified, estimate requested' }] },
    { id: 'WO-1245', community: 'magnolia-grove', communityName: 'Magnolia Grove', title: 'Playground equipment inspection needed', description: 'Annual safety inspection for community playground equipment is due. Swing set chains showing wear.', category: 'Inspection', priority: 'high', status: 'pending', assignedTo: 'Unassigned', estimatedCost: 350, createdDate: daysAgo(1), updatedDate: daysAgo(1), reportedBy: 'Diana Reed', timeline: [{ date: daysAgo(1), action: 'Created', actor: 'Diana Reed', note: 'Annual inspection overdue, swing chains flagged' }] },
    { id: 'WO-1244', community: 'pinehurst-reserve', communityName: 'Pinehurst Reserve', title: 'Irrigation system leak - common area', description: 'Irrigation head leaking near the community entrance garden. Causing muddy area near walkway.', category: 'Landscaping', priority: 'medium', status: 'in-progress', assignedTo: 'GreenScape LLC', estimatedCost: 600, createdDate: daysAgo(5), updatedDate: daysAgo(1), reportedBy: 'Jennifer Murphy', timeline: [{ date: daysAgo(5), action: 'Created', actor: 'Jennifer Murphy', note: 'Reported via member portal' }, { date: daysAgo(4), action: 'Assigned', actor: 'Margaret Chen', note: 'Sent to GreenScape for assessment' }, { date: daysAgo(1), action: 'Updated', actor: 'GreenScape LLC', note: 'Parts ordered, repair scheduled for next week' }] },
    { id: 'WO-1243', community: 'briarwood-oaks', communityName: 'Briarwood Oaks', title: 'Pool gate latch not closing properly', description: 'The main pool gate latch is sticking and not auto-closing. Safety concern for unsupervised access.', category: 'Pool/Amenity', priority: 'urgent', status: 'assigned', assignedTo: 'Carlos Reyes', estimatedCost: 200, createdDate: hoursAgo(8), updatedDate: hoursAgo(4), reportedBy: 'Rachel Foster', timeline: [{ date: hoursAgo(8), action: 'Created', actor: 'Rachel Foster', note: 'Urgent - gate not latching, kids in area' }, { date: hoursAgo(4), action: 'Assigned', actor: 'Margaret Chen', note: 'Carlos Reyes dispatched, ETA today' }] },
    { id: 'WO-1242', community: 'ashbury-hill', communityName: 'Ashbury Hill', title: 'Pothole on main entrance road', description: 'Large pothole forming on the main entrance road near the guardhouse. Getting worse with rain.', category: 'Roads', priority: 'high', status: 'pending', assignedTo: 'Unassigned', estimatedCost: 1200, createdDate: daysAgo(1), updatedDate: daysAgo(1), reportedBy: 'Maria Garcia', timeline: [{ date: daysAgo(1), action: 'Created', actor: 'Maria Garcia', note: 'Reported via member portal with photo' }] },
    { id: 'WO-1241', community: 'briarwood-oaks', communityName: 'Briarwood Oaks', title: 'Gutter cleaning - clubhouse', description: 'Gutters on the community clubhouse overflowing during rain. Needs cleaning and inspection.', category: 'Maintenance', priority: 'low', status: 'scheduled', assignedTo: 'ABC Maintenance', estimatedCost: 400, createdDate: daysAgo(7), updatedDate: daysAgo(3), reportedBy: 'Margaret Chen', timeline: [{ date: daysAgo(7), action: 'Created', actor: 'Margaret Chen', note: 'Routine maintenance item' }, { date: daysAgo(5), action: 'Assigned', actor: 'Margaret Chen', note: 'ABC Maintenance contacted' }, { date: daysAgo(3), action: 'Scheduled', actor: 'ABC Maintenance', note: 'Scheduled for ' + formatDate(daysFromNow(4)) }] },
    { id: 'WO-1240', community: 'willowbrook', communityName: 'Willowbrook', title: 'Sign replacement at entrance', description: 'Community entrance sign damaged by delivery truck. Need new sign fabricated and installed.', category: 'Signage', priority: 'medium', status: 'in-progress', assignedTo: 'SignPro Birmingham', estimatedCost: 3500, createdDate: daysAgo(10), updatedDate: daysAgo(2), reportedBy: 'Laura Anderson', timeline: [{ date: daysAgo(10), action: 'Created', actor: 'Laura Anderson', note: 'Delivery truck hit entrance sign' }, { date: daysAgo(8), action: 'Assigned', actor: 'Margaret Chen', note: 'Insurance claim filed, SignPro contacted' }, { date: daysAgo(5), action: 'Updated', actor: 'SignPro Birmingham', note: 'Design proof sent for approval' }, { date: daysAgo(2), action: 'Updated', actor: 'Margaret Chen', note: 'Design approved, fabrication in progress. ETA 2 weeks.' }] },
    { id: 'WO-1239', community: 'stonehaven', communityName: 'Stonehaven', title: 'Mailbox cluster - door hinge broken', description: 'Unit #4 door hinge on the mailbox cluster at Stonehaven Ct is broken. Mail exposed to weather.', category: 'Maintenance', priority: 'medium', status: 'assigned', assignedTo: 'Carlos Reyes', estimatedCost: 150, createdDate: daysAgo(4), updatedDate: daysAgo(2), reportedBy: 'Jason Walker', timeline: [{ date: daysAgo(4), action: 'Created', actor: 'Jason Walker', note: 'Reported via member portal' }, { date: daysAgo(2), action: 'Assigned', actor: 'Diana Reed', note: 'Carlos Reyes assigned, parts on order' }] },
    { id: 'WO-1238', community: 'willowbrook', communityName: 'Willowbrook', title: 'Tree removal - dead oak in common area', description: 'Large dead oak tree in the Willowbrook common area is a falling hazard. Arborist confirmed removal needed.', category: 'Landscaping', priority: 'high', status: 'scheduled', assignedTo: 'Birmingham Tree Service', estimatedCost: 4200, createdDate: daysAgo(14), updatedDate: daysAgo(5), reportedBy: 'David Chen', timeline: [{ date: daysAgo(14), action: 'Created', actor: 'David Chen', note: 'Dead tree reported, arborist consultation requested' }, { date: daysAgo(10), action: 'Updated', actor: 'Margaret Chen', note: 'Arborist confirmed removal needed, 3 quotes requested' }, { date: daysAgo(7), action: 'Updated', actor: 'Margaret Chen', note: 'Birmingham Tree Service selected ($4,200)' }, { date: daysAgo(5), action: 'Scheduled', actor: 'Birmingham Tree Service', note: 'Removal scheduled for ' + formatDate(daysFromNow(7)) }] },
    { id: 'WO-1237', community: 'the-meadows', communityName: 'The Meadows', title: 'Common area bench repair', description: 'Two benches near the walking trail have broken slats. Need replacement wooden slats.', category: 'Maintenance', priority: 'low', status: 'completed', assignedTo: 'Carlos Reyes', estimatedCost: 320, createdDate: daysAgo(18), updatedDate: daysAgo(4), reportedBy: 'Christopher Taylor', timeline: [{ date: daysAgo(18), action: 'Created', actor: 'Christopher Taylor', note: 'Two benches with broken slats on walking trail' }, { date: daysAgo(15), action: 'Assigned', actor: 'Diana Reed', note: 'Assigned to Carlos Reyes' }, { date: daysAgo(8), action: 'Updated', actor: 'Carlos Reyes', note: 'Lumber purchased, repair started' }, { date: daysAgo(4), action: 'Completed', actor: 'Carlos Reyes', note: 'Both benches repaired and stained. Total cost: $285.' }] },
    { id: 'WO-1236', community: 'stonehaven', communityName: 'Stonehaven', title: 'Parking lot restriping', description: 'Visitor parking lot lines are faded and barely visible. Needs full restriping including handicap spaces.', category: 'Roads', priority: 'low', status: 'completed', assignedTo: 'ProStripe AL', estimatedCost: 1800, createdDate: daysAgo(25), updatedDate: daysAgo(8), reportedBy: 'Thomas Wilson', timeline: [{ date: daysAgo(25), action: 'Created', actor: 'Thomas Wilson', note: 'Parking lines barely visible, safety concern' }, { date: daysAgo(22), action: 'Assigned', actor: 'Margaret Chen', note: 'ProStripe AL contacted for quote' }, { date: daysAgo(15), action: 'Scheduled', actor: 'ProStripe AL', note: 'Scheduled for restriping' }, { date: daysAgo(8), action: 'Completed', actor: 'ProStripe AL', note: 'Full restriping complete including 4 ADA spaces. Cost: $1,650.' }] },
    { id: 'WO-1235', community: 'ashbury-hill', communityName: 'Ashbury Hill', title: 'Exterior light timer adjustment', description: 'Community common area lights turning off too early. Timer needs to be adjusted for daylight savings.', category: 'Electrical', priority: 'low', status: 'completed', assignedTo: 'Carlos Reyes', estimatedCost: 0, createdDate: daysAgo(12), updatedDate: daysAgo(10), reportedBy: 'Robert Martinez', timeline: [{ date: daysAgo(12), action: 'Created', actor: 'Robert Martinez', note: 'Lights going off at 7pm, too early now' }, { date: daysAgo(11), action: 'Assigned', actor: 'Diana Reed', note: 'Quick fix, assigned to Carlos Reyes' }, { date: daysAgo(10), action: 'Completed', actor: 'Carlos Reyes', note: 'Timer adjusted. Lights now set to dusk sensor mode.' }] }
  ];

  // Next WO ID counter
  var nextWoId = 1248;

  // ============================================
  // PAYMENTS (member persona: Daniel Foster)
  // ============================================
  var payments = [
    { id: 'PAY-8847', date: daysAgo(12), description: 'Q2 Assessment - Briarwood Oaks', amount: 275.00, method: 'Visa ending in 4242', status: 'completed', confirmationNumber: 'BC-2026-884712' },
    { id: 'PAY-8621', date: daysAgo(102), description: 'Q1 Assessment - Briarwood Oaks', amount: 275.00, method: 'Visa ending in 4242', status: 'completed', confirmationNumber: 'BC-2026-862134' },
    { id: 'PAY-8405', date: daysAgo(192), description: 'Q4 Assessment - Briarwood Oaks', amount: 275.00, method: 'Bank Account ending in 8901', status: 'completed', confirmationNumber: 'BC-2025-840556' },
    { id: 'PAY-8190', date: daysAgo(282), description: 'Q3 Assessment - Briarwood Oaks', amount: 275.00, method: 'Bank Account ending in 8901', status: 'completed', confirmationNumber: 'BC-2025-819023' },
    { id: 'PAY-7984', date: daysAgo(372), description: 'Q2 Assessment - Briarwood Oaks', amount: 250.00, method: 'Visa ending in 4242', status: 'completed', confirmationNumber: 'BC-2025-798412' },
    { id: 'PAY-7761', date: daysAgo(462), description: 'Q1 Assessment - Briarwood Oaks', amount: 250.00, method: 'Visa ending in 4242', status: 'completed', confirmationNumber: 'BC-2025-776189' }
  ];

  // ============================================
  // ARC APPLICATIONS
  // ============================================
  var arcApplications = [
    { id: 'ARC-2026-031', resident: 'Daniel Foster', community: 'Briarwood Oaks', address: '412 Briarwood Oaks Way', type: 'Fence Installation', description: 'Privacy fence, cedar, 6-foot, along rear property line', status: 'under-review', submittedDate: daysAgo(6), estimatedCost: 8500, attachments: 2 },
    { id: 'ARC-2026-030', resident: 'Thomas Wilson', community: 'Stonehaven', address: '188 Stonehaven Dr', type: 'Deck Expansion', description: 'Extend existing deck by 8 feet with composite decking', status: 'approved', submittedDate: daysAgo(12), estimatedCost: 12000, attachments: 4, approvedDate: daysAgo(5) },
    { id: 'ARC-2026-029', resident: 'Laura Anderson', community: 'Willowbrook', address: '463 Willowbrook Dr', type: 'Exterior Paint', description: 'Repaint front door and shutters - Benjamin Moore "Hale Navy"', status: 'approved', submittedDate: daysAgo(15), estimatedCost: 1800, attachments: 1, approvedDate: daysAgo(8) },
    { id: 'ARC-2026-028', resident: 'Rachel Foster', community: 'Briarwood Oaks', address: '421 Whiteoak Ln', type: 'Roof Replacement', description: 'Full roof replacement with architectural shingles, charcoal gray', status: 'under-review', submittedDate: daysAgo(4), estimatedCost: 18500, attachments: 3 },
    { id: 'ARC-2026-027', resident: 'James Cooper', community: 'The Vineyards', address: '387 Vineyard Way', type: 'Patio Extension', description: 'Flagstone patio, 12x16 feet, with built-in fire pit', status: 'approved-with-conditions', submittedDate: daysAgo(20), estimatedCost: 9200, attachments: 2, approvedDate: daysAgo(10), conditions: 'Fire pit must be gas, not wood-burning. Setback from fence must be 5ft minimum.' },
    { id: 'ARC-2026-026', resident: 'Daniel Thompson', community: 'Briarwood Oaks', address: '556 Briarwood Oaks Way', type: 'Driveway Repaving', description: 'Full driveway repaving with stamped concrete', status: 'denied', submittedDate: daysAgo(25), estimatedCost: 6800, attachments: 1, deniedDate: daysAgo(18), deniedReason: 'Stamped concrete pattern does not conform to community design guidelines. Resubmit with approved pattern options.' },
    { id: 'ARC-2026-025', resident: 'Emily Johnson', community: 'Magnolia Grove', address: '275 Magnolia Grove Dr', type: 'Landscaping', description: 'Remove two Bradford pear trees, plant 3 Japanese maples', status: 'approved', submittedDate: daysAgo(30), estimatedCost: 3200, attachments: 1, approvedDate: daysAgo(22) },
    { id: 'ARC-2026-024', resident: 'Mark Robinson', community: 'Ashbury Hill', address: '378 Ashbury Ln', type: 'Solar Panels', description: 'Roof-mounted solar panel installation, 24 panels', status: 'under-review', submittedDate: daysAgo(2), estimatedCost: 28000, attachments: 5 }
  ];

  // ============================================
  // COMPLIANCE VIOLATIONS
  // ============================================
  var violations = [
    { id: 'VIO-0452', address: '293 Magnolia Grove Dr', resident: 'Nathan Brooks', community: 'Magnolia Grove', type: 'Yard Maintenance', description: 'Grass exceeding 8-inch maximum height', severity: 'warning', status: 'open', createdDate: daysAgo(2), assignedTo: 'Diana Reed' },
    { id: 'VIO-0451', address: '176 Meadow Glen Ln', resident: 'Megan Hall', community: 'The Meadows', type: 'Parking', description: 'Inoperable vehicle parked in driveway for 30+ days', severity: 'notice', status: 'open', createdDate: daysAgo(5), assignedTo: 'Diana Reed' },
    { id: 'VIO-0450', address: '845 Stonehaven Ct', resident: 'Jason Walker', community: 'Stonehaven', type: 'Exterior Appearance', description: 'Unapproved paint color on front door', severity: 'notice', status: 'hearing-scheduled', createdDate: daysAgo(14), assignedTo: 'Margaret Chen', hearingDate: daysFromNow(5) },
    { id: 'VIO-0449', address: '259 Willowbrook Dr', resident: 'Brian Harris', community: 'Willowbrook', type: 'Yard Maintenance', description: 'Dead shrubs in front landscaping beds, not replaced within 30-day notice period', severity: 'fine', status: 'fine-issued', createdDate: daysAgo(35), assignedTo: 'Diana Reed', fineAmount: 150 },
    { id: 'VIO-0448', address: '683 Vineyard Way', resident: 'Stephanie White', community: 'The Vineyards', type: 'Trash/Debris', description: 'Trash cans left at curb past 24-hour removal deadline', severity: 'warning', status: 'resolved', createdDate: daysAgo(10), assignedTo: 'Diana Reed', resolvedDate: daysAgo(7) },
    { id: 'VIO-0447', address: '534 Meadowview Dr', resident: 'Ryan Allen', community: 'The Meadows', type: 'Parking', description: 'Commercial vehicle parked overnight in residential area', severity: 'notice', status: 'open', createdDate: daysAgo(3), assignedTo: 'Diana Reed' },
    { id: 'VIO-0446', address: '941 Stonehaven Dr', resident: 'Nicole Lewis', community: 'Stonehaven', type: 'Noise', description: 'Repeated noise complaints from neighbors regarding late-night construction', severity: 'warning', status: 'resolved', createdDate: daysAgo(20), assignedTo: 'Margaret Chen', resolvedDate: daysAgo(12) },
    { id: 'VIO-0445', address: '387 Vineyard Way', resident: 'James Cooper', community: 'The Vineyards', type: 'Unapproved Modification', description: 'Storage shed installed without ARC approval', severity: 'notice', status: 'open', createdDate: daysAgo(8), assignedTo: 'Margaret Chen' },
    { id: 'VIO-0444', address: '928 Briarwood Oaks Cir', resident: 'Gregory Carter', community: 'Briarwood Oaks', type: 'Pet', description: 'Dog off-leash in common area - second offense', severity: 'warning', status: 'resolved', createdDate: daysAgo(15), assignedTo: 'Diana Reed', resolvedDate: daysAgo(13) },
    { id: 'VIO-0443', address: '696 Briarwood Oaks Way', resident: 'Heather Nelson', community: 'Briarwood Oaks', type: 'Holiday Decorations', description: 'Holiday decorations not removed within 15-day post-holiday window', severity: 'notice', status: 'resolved', createdDate: daysAgo(30), assignedTo: 'Diana Reed', resolvedDate: daysAgo(25) }
  ];

  // ============================================
  // CALENDAR EVENTS (relative to today)
  // ============================================
  var events = [
    { id: 'EVT-001', title: 'Board Meeting', community: 'Willowbrook', location: 'Briarwood Clubhouse', date: daysFromNow(3), time: '7:00 PM', type: 'board', description: 'Quarterly board meeting - budget review and community updates' },
    { id: 'EVT-002', title: 'Annual Inspection', community: 'Pinehurst Reserve', location: 'Common Areas', date: daysFromNow(5), time: '9:00 AM', type: 'inspection', description: 'Annual property and common area inspection walk-through' },
    { id: 'EVT-003', title: 'Community Cookout', community: 'Briarwood Oaks', location: 'Briarwood Oaks Pavilion', date: daysFromNow(8), time: '11:00 AM', type: 'community', description: 'Spring community cookout - burgers, hot dogs, games for kids' },
    { id: 'EVT-004', title: 'Budget Review', community: 'The Vineyards', location: 'Vineyards Community Center', date: daysFromNow(10), time: '6:00 PM', type: 'board', description: 'Mid-year budget review with financial committee' },
    { id: 'EVT-005', title: 'Q3 Assessments Due', community: 'All Communities', location: '', date: daysFromNow(14), time: '', type: 'deadline', description: 'Q3 HOA assessments due for all communities' },
    { id: 'EVT-006', title: 'Pool Season Opens', community: 'All Communities', location: 'Community Pools', date: daysFromNow(18), time: '10:00 AM', type: 'community', description: 'Pools open for the season. Hours: 10AM-8PM daily.' },
    { id: 'EVT-007', title: 'Clubhouse Rental', community: 'The Meadows', location: 'Summit Cove Clubhouse', date: daysFromNow(6), time: '2:00 PM', type: 'reservation', description: 'Private event reservation - Thompson family' },
    { id: 'EVT-008', title: 'Compliance Hearing', community: 'Stonehaven', location: 'Management Office', date: daysFromNow(5), time: '10:00 AM', type: 'hearing', description: 'Hearing for VIO-0450 - unapproved exterior modification' },
    { id: 'EVT-009', title: 'Tree Removal', community: 'Willowbrook', location: 'Common Area', date: daysFromNow(7), time: '8:00 AM', type: 'maintenance', description: 'Birmingham Tree Service - dead oak removal (WO-1238)' },
    { id: 'EVT-010', title: 'Board Meeting', community: 'Briarwood Oaks', location: 'Briarwood Village Clubhouse', date: daysFromNow(12), time: '6:30 PM', type: 'board', description: 'Monthly board meeting - new business and resident concerns' }
  ];

  // ============================================
  // ACTIVITY FEED (relative timestamps)
  // ============================================
  var activityFeed = [
    { id: 'ACT-001', type: 'work-order', icon: 'wrench', text: 'Margaret Chen created work order WO-1243', detail: 'Pool gate latch - Briarwood Village', time: hoursAgo(4), color: 'navy' },
    { id: 'ACT-002', type: 'payment', icon: 'dollar', text: 'Payment received from Rachel Foster', detail: '$275.00 — Q2 Assessment', time: hoursAgo(6), color: 'teal' },
    { id: 'ACT-003', type: 'arc', icon: 'clipboard', text: 'ARC application submitted', detail: 'ARC-2026-024 — Solar panels, Ashbury Hill', time: hoursAgo(8), color: 'gold' },
    { id: 'ACT-004', type: 'violation', icon: 'alert', text: 'Violation notice issued', detail: 'VIO-0452 — Yard maintenance, Magnolia Grove', time: hoursAgo(12), color: 'danger' },
    { id: 'ACT-005', type: 'payment', icon: 'dollar', text: 'Payment received from Emily Johnson', detail: '$275.00 — Q2 Assessment', time: hoursAgo(18), color: 'teal' },
    { id: 'ACT-006', type: 'work-order', icon: 'wrench', text: 'Work order WO-1237 marked complete', detail: 'Bench repair — The Gardens', time: daysAgo(1), color: 'teal' },
    { id: 'ACT-007', type: 'document', icon: 'file', text: 'Board minutes uploaded', detail: 'Willowbrook — March 2026 meeting minutes', time: daysAgo(1), color: 'navy' },
    { id: 'ACT-008', type: 'resident', icon: 'user', text: 'New resident registered', detail: 'Gregory Carter — 928 Briarwood Oaks Cir, Briarwood Village', time: daysAgo(2), color: 'gold' },
    { id: 'ACT-009', type: 'payment', icon: 'dollar', text: '14 payments processed', detail: 'Batch processing — Auto-pay collections', time: daysAgo(2), color: 'teal' },
    { id: 'ACT-010', type: 'arc', icon: 'clipboard', text: 'ARC-2026-029 approved', detail: 'Exterior paint — Willowbrook', time: daysAgo(3), color: 'teal' },
    { id: 'ACT-011', type: 'violation', icon: 'alert', text: 'Violation VIO-0448 resolved', detail: 'Trash/debris — Vineyards', time: daysAgo(3), color: 'teal' },
    { id: 'ACT-012', type: 'work-order', icon: 'wrench', text: 'Work order WO-1240 updated', detail: 'Sign design approved — Willowbrook', time: daysAgo(3), color: 'navy' },
    { id: 'ACT-013', type: 'payment', icon: 'dollar', text: 'Payment received from Amanda Price', detail: '$275.00 — Q2 Assessment', time: daysAgo(4), color: 'teal' },
    { id: 'ACT-014', type: 'resident', icon: 'user', text: 'Resident profile updated', detail: 'Daniel Foster — Briarwood Oaks', time: daysAgo(5), color: 'navy' },
    { id: 'ACT-015', type: 'document', icon: 'file', text: 'Budget report published', detail: 'Q1 2026 Financial Summary — All communities', time: daysAgo(6), color: 'gold' }
  ];

  // ============================================
  // FINANCIAL SUMMARY
  // ============================================
  var financials = {
    totalAssessed: 0,
    totalCollected: 0,
    collectionRate: 0,
    monthlyRevenue: [
      { month: 'Jan', amount: 38200 },
      { month: 'Feb', amount: 41500 },
      { month: 'Mar', amount: 45100 },
      { month: 'Apr', amount: 42800 }
    ],
    delinquencyAging: {
      current: 4220,
      days30: 2100,
      days60: 1150,
      days90: 850
    }
  };

  // Compute financial totals from communities
  for (var j = 0; j < communities.length; j++) {
    var c = communities[j];
    var assessed = c.homes * c.assessment;
    var collected = Math.round(assessed * (c.collectionRate / 100));
    financials.totalAssessed += assessed;
    financials.totalCollected += collected;
  }
  financials.collectionRate = ((financials.totalCollected / financials.totalAssessed) * 100).toFixed(1);

  // ============================================
  // MEMBER PERSONA (Daniel Foster)
  // ============================================
  var memberPersona = {
    residentId: 'R-001',
    firstName: 'Daniel',
    lastName: 'Foster',
    initials: 'DF',
    address: '412 Briarwood Oaks Way',
    city: 'Hoover',
    state: 'AL',
    zip: '35244',
    community: 'Briarwood Oaks',
    communityId: 'briarwood-oaks',
    accountNumber: 'BO-0412',
    memberSince: 2019,
    assessment: 275.00,
    balance: 275.00,
    nextDueDate: daysFromNow(14),
    paymentMethods: [
      { type: 'card', label: 'Visa ending in 4242', fee: 0.03 },
      { type: 'ach', label: 'Bank Account ending in 8901', fee: 0 }
    ],
    household: [
      { name: 'Daniel Foster', role: 'Primary', age: 42 },
      { name: 'Olivia Foster', role: 'Spouse', age: 39 },
      { name: 'Henry Foster', role: 'Dependent', age: 14 }
    ],
    vehicles: [
      { year: 2021, make: 'Toyota', model: 'Camry', color: 'Silver', plate: 'ABC-1234', sticker: 'V-0891' },
      { year: 2023, make: 'Honda', model: 'CR-V', color: 'Blue', plate: 'XYZ-5678', sticker: 'V-1023' }
    ],
    pets: [
      { name: 'Max', breed: 'Golden Retriever', age: 4, vaccinated: true }
    ]
  };

  // ============================================
  // LOCALSTORAGE PERSISTENCE
  // ============================================
  var STORAGE_PREFIX = 'lpms_';

  function save(key, data) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    } catch (e) { /* quota exceeded, silently fail */ }
  }

  function load(key) {
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function getWorkOrders() {
    var extra = load('work_orders') || [];
    return workOrders.concat(extra);
  }

  function addWorkOrder(wo) {
    wo.id = 'WO-' + nextWoId;
    nextWoId++;
    wo.createdDate = new Date();
    wo.updatedDate = new Date();
    wo.timeline = [{ date: new Date(), action: 'Created', actor: 'Margaret Chen', note: 'Created via staff portal' }];
    var extra = load('work_orders') || [];
    extra.unshift(wo);
    save('work_orders', extra);
    return wo;
  }

  function getPayments() {
    var extra = load('payments') || [];
    return extra.concat(payments);
  }

  function addPayment(payment) {
    payment.id = 'PAY-' + (9000 + Math.floor(Math.random() * 999));
    payment.date = new Date();
    payment.status = 'completed';
    payment.confirmationNumber = 'LP-' + now.getFullYear() + '-' + (100000 + Math.floor(Math.random() * 899999));
    var extra = load('payments') || [];
    extra.unshift(payment);
    save('payments', extra);
    // Update member balance
    var bal = load('member_balance');
    if (bal === null) bal = memberPersona.balance;
    bal = Math.max(0, bal - payment.amount);
    save('member_balance', bal);
    return payment;
  }

  function getMaintenanceRequests() {
    var extra = load('maintenance_requests') || [];
    return extra;
  }

  function addMaintenanceRequest(req) {
    req.id = 'REQ-' + (900 + Math.floor(Math.random() * 99));
    req.status = 'submitted';
    req.submittedDate = new Date();
    req.community = memberPersona.community;
    req.resident = memberPersona.firstName + ' ' + memberPersona.lastName;
    var extra = load('maintenance_requests') || [];
    extra.unshift(req);
    save('maintenance_requests', extra);
    return req;
  }

  function getMemberBalance() {
    var bal = load('member_balance');
    return bal !== null ? bal : memberPersona.balance;
  }

  function resetDemo() {
    var keys = [];
    for (var k = 0; k < localStorage.length; k++) {
      var key = localStorage.key(k);
      if (key && key.indexOf(STORAGE_PREFIX) === 0) {
        keys.push(key);
      }
    }
    for (var m = 0; m < keys.length; m++) {
      localStorage.removeItem(keys[m]);
    }
  }

  // ============================================
  // WEEKLY SNAPSHOT — computed from underlying data so the dashboard
  // headline stays consistent with what board members see elsewhere
  // ============================================
  var weeklySnapshot = (function() {
    // Top-collecting neighborhood
    var top = communities[0];
    for (var i = 1; i < communities.length; i++) {
      if (communities[i].collectionRate > top.collectionRate) top = communities[i];
    }
    // ARC requests submitted in last 7 days
    var newArcCount = arcApplications.filter(function(a) {
      var diff = (Date.now() - new Date(a.submittedDate).getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }).length;
    // Violations escalated to fine status this week
    var escalatedFines = violations.filter(function(v) {
      return v.status === 'fined' || (v.fineAmount && v.fineAmount > 0);
    }).length;
    // Weekly revenue estimate (Q2 / 13 weeks rough)
    var weeklyRevenue = Math.round(financials.totalCollected / 4 / 13);
    var paymentsThisWeek = Math.max(280, Math.round(residents.length * 0.2));
    return {
      collected: weeklyRevenue,
      collectedFormatted: '$' + weeklyRevenue.toLocaleString(),
      paymentCount: paymentsThisWeek,
      newArcRequests: Math.max(3, newArcCount),
      escalatedViolations: Math.max(2, escalatedFines),
      topNeighborhood: top.name,
      topCollectionRate: top.collectionRate
    };
  })();

  // ============================================
  // STAFF AUDIT LOG — recent sensitive actions
  // ============================================
  var auditLog = [
    { id: 'AUD-3421', timestamp: hoursAgo(0.5), actor: 'Margaret Chen', role: 'Community Director', action: 'Approved ARC request', target: 'ARC-2026-031 (Foster)', severity: 'info' },
    { id: 'AUD-3420', timestamp: hoursAgo(1), actor: 'Robert Hayes', role: 'Compliance Officer', action: 'Issued violation notice', target: 'CN-2026-148 (Briarwood Oaks Way)', severity: 'warn' },
    { id: 'AUD-3419', timestamp: hoursAgo(2), actor: 'Margaret Chen', role: 'Community Director', action: 'Posted late fee', target: 'Account BO-0412 ($25.00)', severity: 'warn' },
    { id: 'AUD-3418', timestamp: hoursAgo(3), actor: 'Thomas Pierce', role: 'Board Chair', action: 'Viewed financial summary', target: 'Q2 Financials Report', severity: 'info' },
    { id: 'AUD-3417', timestamp: hoursAgo(4.5), actor: 'Carlos Reyes', role: 'Maintenance Lead', action: 'Updated work order', target: 'WO-1247 (status: in-progress)', severity: 'info' },
    { id: 'AUD-3416', timestamp: hoursAgo(6), actor: 'Margaret Chen', role: 'Community Director', action: 'Sent mass announcement', target: 'Pool Season Opens — 850 recipients', severity: 'info' },
    { id: 'AUD-3415', timestamp: hoursAgo(8), actor: 'Robert Hayes', role: 'Compliance Officer', action: 'Escalated violation', target: 'CN-2026-141 (2nd notice + $50 fine)', severity: 'warn' },
    { id: 'AUD-3414', timestamp: hoursAgo(22), actor: 'Margaret Chen', role: 'Community Director', action: 'Modified resident record', target: 'R-018 (email updated)', severity: 'info' },
    { id: 'AUD-3413', timestamp: daysAgo(1), actor: 'Thomas Pierce', role: 'Board Chair', action: 'Voted on board motion', target: 'Pool Resurfacing Bid (approved)', severity: 'critical' },
    { id: 'AUD-3412', timestamp: daysAgo(1), actor: 'System', role: 'Automated', action: 'Auto-pay batch processed', target: '247 transactions, $67,925.00', severity: 'info' },
    { id: 'AUD-3411', timestamp: daysAgo(1), actor: 'Margaret Chen', role: 'Community Director', action: 'Refunded payment', target: 'PAY-8721 ($275.00 to R-031)', severity: 'warn' },
    { id: 'AUD-3410', timestamp: daysAgo(2), actor: 'Robert Hayes', role: 'Compliance Officer', action: 'Closed violation', target: 'CN-2026-138 (resolved with photo)', severity: 'info' },
    { id: 'AUD-3409', timestamp: daysAgo(2), actor: 'Thomas Pierce', role: 'Board Chair', action: 'Downloaded financial export', target: 'Q1 2026 Financials (CSV)', severity: 'critical' },
    { id: 'AUD-3408', timestamp: daysAgo(3), actor: 'Margaret Chen', role: 'Community Director', action: 'Created vendor record', target: 'AquaTech Pools (new)', severity: 'info' },
    { id: 'AUD-3407', timestamp: daysAgo(3), actor: 'Carlos Reyes', role: 'Maintenance Lead', action: 'Closed work order', target: 'WO-1240 (sign replacement)', severity: 'info' },
    { id: 'AUD-3406', timestamp: daysAgo(4), actor: 'System', role: 'Automated', action: 'Backup completed', target: 'Daily database backup (2.3GB)', severity: 'info' },
    { id: 'AUD-3405', timestamp: daysAgo(5), actor: 'Margaret Chen', role: 'Community Director', action: 'Modified ARC committee', target: 'Briarwood Oaks ARC (added P. Hayes)', severity: 'critical' },
    { id: 'AUD-3404', timestamp: daysAgo(5), actor: 'Robert Hayes', role: 'Compliance Officer', action: 'Bulk-updated residents', target: '14 records (community reassignment)', severity: 'warn' },
    { id: 'AUD-3403', timestamp: daysAgo(6), actor: 'Thomas Pierce', role: 'Board Chair', action: 'Logged in', target: 'Board portal session', severity: 'info' },
    { id: 'AUD-3402', timestamp: daysAgo(7), actor: 'Margaret Chen', role: 'Community Director', action: 'Generated report', target: 'Monthly Compliance Summary (April)', severity: 'info' }
  ];

  // ============================================
  // EXPOSE PUBLIC API
  // ============================================
  window.LPMS = {
    // Data
    communities: communities,
    residents: residents,
    workOrders: workOrders,
    payments: payments,
    arcApplications: arcApplications,
    violations: violations,
    events: events,
    activityFeed: activityFeed,
    financials: financials,
    memberPersona: memberPersona,
    weeklySnapshot: weeklySnapshot,
    auditLog: auditLog,

    // Computed
    totalHomes: totalHomes,
    totalActiveIssues: totalActiveIssues,

    // Persistence
    save: save,
    load: load,
    getWorkOrders: getWorkOrders,
    addWorkOrder: addWorkOrder,
    getPayments: getPayments,
    addPayment: addPayment,
    getMaintenanceRequests: getMaintenanceRequests,
    addMaintenanceRequest: addMaintenanceRequest,
    getMemberBalance: getMemberBalance,
    resetDemo: resetDemo,

    // Date helpers
    formatDate: formatDate,
    formatShortDate: formatShortDate,
    formatTime: formatTime,
    daysAgo: daysAgo,
    daysFromNow: daysFromNow,
    hoursAgo: hoursAgo,
    minutesAgo: minutesAgo
  };

})();
