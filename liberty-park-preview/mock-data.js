/* ============================================
   LIBERTY PARK MANAGEMENT SERVICES
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
  // COMMUNITIES (15 total = ~1,547 homes)
  // ============================================
  var communities = [
    { id: 'the-bray', name: 'The Bray', location: 'Vestavia Hills', homes: 62, healthGrade: 'A', healthScore: 94, collectionRate: 97.2, activeIssues: 2, manager: 'Jennifer Walsh', boardPresident: 'Robert Caldwell', assessment: 275, established: 2004, reserveFund: 185000, annualBudget: 204600 },
    { id: 'oakridge', name: 'Oakridge', location: 'Hoover', homes: 48, healthGrade: 'A-', healthScore: 91, collectionRate: 95.8, activeIssues: 1, manager: 'Jennifer Walsh', boardPresident: 'Linda Morris', assessment: 250, established: 2006, reserveFund: 142000, annualBudget: 144000 },
    { id: 'the-highlands', name: 'The Highlands', location: 'Vestavia Hills', homes: 38, healthGrade: 'B+', healthScore: 86, collectionRate: 92.1, activeIssues: 3, manager: 'Sarah Chen', boardPresident: 'Mark Thornton', assessment: 300, established: 2001, reserveFund: 168000, annualBudget: 136800 },
    { id: 'brookstone', name: 'Brookstone', location: 'Hoover', homes: 55, healthGrade: 'B+', healthScore: 87, collectionRate: 93.6, activeIssues: 2, manager: 'Sarah Chen', boardPresident: 'Patricia Hayes', assessment: 250, established: 2008, reserveFund: 128000, annualBudget: 165000 },
    { id: 'willow-creek', name: 'Willow Creek', location: 'Mountain Brook', homes: 44, healthGrade: 'A', healthScore: 95, collectionRate: 98.1, activeIssues: 0, manager: 'Jennifer Walsh', boardPresident: 'James Elliott', assessment: 350, established: 2003, reserveFund: 224000, annualBudget: 184800 },
    { id: 'the-gardens', name: 'The Gardens', location: 'Vestavia Hills', homes: 52, healthGrade: 'B', healthScore: 82, collectionRate: 89.4, activeIssues: 4, manager: 'Sarah Chen', boardPresident: 'Donna Mitchell', assessment: 225, established: 2010, reserveFund: 98000, annualBudget: 140400 },
    { id: 'magnolia-place', name: 'Magnolia Place', location: 'Homewood', homes: 35, healthGrade: 'A-', healthScore: 92, collectionRate: 96.5, activeIssues: 1, manager: 'Jennifer Walsh', boardPresident: 'William Foster', assessment: 275, established: 2005, reserveFund: 145000, annualBudget: 115500 },
    { id: 'cypress-point', name: 'Cypress Point', location: 'Hoover', homes: 41, healthGrade: 'B+', healthScore: 85, collectionRate: 91.7, activeIssues: 2, manager: 'Sarah Chen', boardPresident: 'Angela Brooks', assessment: 250, established: 2009, reserveFund: 112000, annualBudget: 123000 },
    { id: 'heritage-hills', name: 'Heritage Hills', location: 'Vestavia Hills', homes: 58, healthGrade: 'A', healthScore: 93, collectionRate: 96.8, activeIssues: 1, manager: 'Jennifer Walsh', boardPresident: 'Thomas Graham', assessment: 300, established: 2002, reserveFund: 210000, annualBudget: 208800 },
    { id: 'summit-view', name: 'Summit View', location: 'Mountain Brook', homes: 30, healthGrade: 'B', healthScore: 81, collectionRate: 88.3, activeIssues: 3, manager: 'Sarah Chen', boardPresident: 'Karen Price', assessment: 275, established: 2011, reserveFund: 78000, annualBudget: 99000 },
    { id: 'eagle-point', name: 'Eagle Point', location: 'Hoover', homes: 24, healthGrade: 'C+', healthScore: 76, collectionRate: 84.2, activeIssues: 5, manager: 'Sarah Chen', boardPresident: 'Steven Clark', assessment: 225, established: 2013, reserveFund: 52000, annualBudget: 64800 },
    { id: 'liberty-ridge', name: 'Liberty Ridge', location: 'Vestavia Hills', homes: 210, healthGrade: 'A-', healthScore: 90, collectionRate: 95.1, activeIssues: 4, manager: 'Jennifer Walsh', boardPresident: 'David Lawson', assessment: 275, established: 2000, reserveFund: 520000, annualBudget: 693000 },
    { id: 'windsor-court', name: 'Windsor Court', location: 'Mountain Brook', homes: 180, healthGrade: 'A', healthScore: 93, collectionRate: 97.4, activeIssues: 2, manager: 'Jennifer Walsh', boardPresident: 'Catherine Moore', assessment: 325, established: 1998, reserveFund: 480000, annualBudget: 702000 },
    { id: 'preserve-at-cahaba', name: 'Preserve at Cahaba', location: 'Hoover', homes: 350, healthGrade: 'B+', healthScore: 88, collectionRate: 94.3, activeIssues: 6, manager: 'Sarah Chen', boardPresident: 'Richard Barnes', assessment: 250, established: 1999, reserveFund: 680000, annualBudget: 1050000 },
    { id: 'stonebridge', name: 'Stonebridge', location: 'Homewood', homes: 320, healthGrade: 'A-', healthScore: 91, collectionRate: 96.0, activeIssues: 3, manager: 'Jennifer Walsh', boardPresident: 'Elizabeth Ward', assessment: 275, established: 2001, reserveFund: 620000, annualBudget: 1056000 }
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
    { id: 'R-001', firstName: 'Michael', lastName: 'Bennett', initials: 'MB', email: 'michael.bennett@email.com', phone: '(205) 555-1842', address: '1842 Liberty Ridge Dr', community: 'heritage-hills', communityName: 'Heritage Hills', status: 'current', balance: 275.00, lastPayment: daysAgo(12), moveInDate: '2019-06-15', avatarColor: 'navy' },
    { id: 'R-002', firstName: 'Rachel', lastName: 'Foster', initials: 'RF', email: 'rachel.foster@email.com', phone: '(205) 555-0421', address: '421 Overton Way', community: 'the-bray', communityName: 'The Bray', status: 'current', balance: 0, lastPayment: daysAgo(5), moveInDate: '2020-03-10', avatarColor: 'teal' },
    { id: 'R-003', firstName: 'James', lastName: 'Cooper', initials: 'JC', email: 'james.cooper@email.com', phone: '(205) 555-0387', address: '387 Brookstone Cir', community: 'brookstone', communityName: 'Brookstone', status: 'past-due', balance: 550.00, lastPayment: daysAgo(45), moveInDate: '2017-11-22', avatarColor: 'gold' },
    { id: 'R-004', firstName: 'Amanda', lastName: 'Price', initials: 'AP', email: 'amanda.price@email.com', phone: '(205) 555-0156', address: '156 Summit View Ln', community: 'summit-view', communityName: 'Summit View', status: 'current', balance: 0, lastPayment: daysAgo(8), moveInDate: '2021-08-01', avatarColor: 'teal' },
    { id: 'R-005', firstName: 'Nathan', lastName: 'Brooks', initials: 'NB', email: 'nathan.brooks@email.com', phone: '(205) 555-0293', address: '293 Eagle Point Dr', community: 'eagle-point', communityName: 'Eagle Point', status: 'delinquent', balance: 825.00, lastPayment: daysAgo(95), moveInDate: '2018-04-15', avatarColor: 'navy' },
    { id: 'R-006', firstName: 'Jennifer', lastName: 'Murphy', initials: 'JM', email: 'jennifer.murphy@email.com', phone: '(205) 555-0744', address: '744 Willow Creek Ct', community: 'willow-creek', communityName: 'Willow Creek', status: 'current', balance: 0, lastPayment: daysAgo(3), moveInDate: '2016-09-30', avatarColor: 'gold' },
    { id: 'R-007', firstName: 'David', lastName: 'Chen', initials: 'DC', email: 'david.chen@email.com', phone: '(205) 555-0518', address: '518 Oakridge Blvd', community: 'oakridge', communityName: 'Oakridge', status: 'current', balance: 250.00, lastPayment: daysAgo(20), moveInDate: '2019-01-12', avatarColor: 'teal' },
    { id: 'R-008', firstName: 'Sarah', lastName: 'Williams', initials: 'SW', email: 'sarah.williams@email.com', phone: '(205) 555-0629', address: '629 Highlands Dr', community: 'the-highlands', communityName: 'The Highlands', status: 'current', balance: 0, lastPayment: daysAgo(7), moveInDate: '2020-11-05', avatarColor: 'navy' },
    { id: 'R-009', firstName: 'Christopher', lastName: 'Taylor', initials: 'CT', email: 'chris.taylor@email.com', phone: '(205) 555-0831', address: '831 Gardens Way', community: 'the-gardens', communityName: 'The Gardens', status: 'past-due', balance: 450.00, lastPayment: daysAgo(62), moveInDate: '2018-07-20', avatarColor: 'gold' },
    { id: 'R-010', firstName: 'Emily', lastName: 'Johnson', initials: 'EJ', email: 'emily.johnson@email.com', phone: '(205) 555-0275', address: '275 Magnolia Pl', community: 'magnolia-place', communityName: 'Magnolia Place', status: 'current', balance: 0, lastPayment: daysAgo(2), moveInDate: '2021-03-18', avatarColor: 'teal' },
    { id: 'R-011', firstName: 'Robert', lastName: 'Martinez', initials: 'RM', email: 'robert.martinez@email.com', phone: '(205) 555-0912', address: '912 Cypress Point Rd', community: 'cypress-point', communityName: 'Cypress Point', status: 'current', balance: 250.00, lastPayment: daysAgo(18), moveInDate: '2017-05-10', avatarColor: 'navy' },
    { id: 'R-012', firstName: 'Laura', lastName: 'Anderson', initials: 'LA', email: 'laura.anderson@email.com', phone: '(205) 555-0463', address: '463 Liberty Ridge Dr', community: 'liberty-ridge', communityName: 'Liberty Ridge', status: 'current', balance: 0, lastPayment: daysAgo(6), moveInDate: '2015-12-01', avatarColor: 'gold' },
    { id: 'R-013', firstName: 'Thomas', lastName: 'Wilson', initials: 'TW', email: 'thomas.wilson@email.com', phone: '(205) 555-0188', address: '188 Windsor Ct', community: 'windsor-court', communityName: 'Windsor Court', status: 'current', balance: 325.00, lastPayment: daysAgo(14), moveInDate: '2019-09-22', avatarColor: 'teal' },
    { id: 'R-014', firstName: 'Maria', lastName: 'Garcia', initials: 'MG', email: 'maria.garcia@email.com', phone: '(205) 555-0347', address: '347 Cahaba Preserve Way', community: 'preserve-at-cahaba', communityName: 'Preserve at Cahaba', status: 'current', balance: 0, lastPayment: daysAgo(4), moveInDate: '2020-06-14', avatarColor: 'navy' },
    { id: 'R-015', firstName: 'Daniel', lastName: 'Thompson', initials: 'DT', email: 'daniel.thompson@email.com', phone: '(205) 555-0556', address: '556 Stonebridge Pkwy', community: 'stonebridge', communityName: 'Stonebridge', status: 'delinquent', balance: 1100.00, lastPayment: daysAgo(120), moveInDate: '2016-02-28', avatarColor: 'gold' },
    { id: 'R-016', firstName: 'Ashley', lastName: 'Brown', initials: 'AB', email: 'ashley.brown@email.com', phone: '(205) 555-0721', address: '721 Bray Ct', community: 'the-bray', communityName: 'The Bray', status: 'current', balance: 0, lastPayment: daysAgo(9), moveInDate: '2022-01-15', avatarColor: 'teal' },
    { id: 'R-017', firstName: 'Kevin', lastName: 'Davis', initials: 'KD', email: 'kevin.davis@email.com', phone: '(205) 555-0894', address: '894 Oakridge Blvd', community: 'oakridge', communityName: 'Oakridge', status: 'current', balance: 250.00, lastPayment: daysAgo(22), moveInDate: '2018-10-05', avatarColor: 'navy' },
    { id: 'R-018', firstName: 'Jessica', lastName: 'Moore', initials: 'JM2', email: 'jessica.moore@email.com', phone: '(205) 555-0135', address: '135 Heritage Hills Ln', community: 'heritage-hills', communityName: 'Heritage Hills', status: 'current', balance: 0, lastPayment: daysAgo(1), moveInDate: '2020-04-20', avatarColor: 'gold' },
    { id: 'R-019', firstName: 'Andrew', lastName: 'Jackson', initials: 'AJ', email: 'andrew.jackson@email.com', phone: '(205) 555-0467', address: '467 Willow Creek Ct', community: 'willow-creek', communityName: 'Willow Creek', status: 'current', balance: 350.00, lastPayment: daysAgo(16), moveInDate: '2017-07-12', avatarColor: 'teal' },
    { id: 'R-020', firstName: 'Stephanie', lastName: 'White', initials: 'SW2', email: 'stephanie.white@email.com', phone: '(205) 555-0683', address: '683 Brookstone Cir', community: 'brookstone', communityName: 'Brookstone', status: 'current', balance: 0, lastPayment: daysAgo(10), moveInDate: '2021-11-30', avatarColor: 'navy' },
    { id: 'R-021', firstName: 'Brian', lastName: 'Harris', initials: 'BH', email: 'brian.harris@email.com', phone: '(205) 555-0259', address: '259 Liberty Ridge Dr', community: 'liberty-ridge', communityName: 'Liberty Ridge', status: 'past-due', balance: 550.00, lastPayment: daysAgo(55), moveInDate: '2019-03-08', avatarColor: 'gold' },
    { id: 'R-022', firstName: 'Nicole', lastName: 'Lewis', initials: 'NL', email: 'nicole.lewis@email.com', phone: '(205) 555-0941', address: '941 Windsor Ct', community: 'windsor-court', communityName: 'Windsor Court', status: 'current', balance: 0, lastPayment: daysAgo(3), moveInDate: '2022-05-17', avatarColor: 'teal' },
    { id: 'R-023', firstName: 'Mark', lastName: 'Robinson', initials: 'MR', email: 'mark.robinson@email.com', phone: '(205) 555-0378', address: '378 Cahaba Preserve Way', community: 'preserve-at-cahaba', communityName: 'Preserve at Cahaba', status: 'current', balance: 250.00, lastPayment: daysAgo(19), moveInDate: '2016-08-25', avatarColor: 'navy' },
    { id: 'R-024', firstName: 'Kimberly', lastName: 'Clark', initials: 'KC', email: 'kim.clark@email.com', phone: '(205) 555-0612', address: '612 Stonebridge Pkwy', community: 'stonebridge', communityName: 'Stonebridge', status: 'current', balance: 0, lastPayment: daysAgo(7), moveInDate: '2020-09-14', avatarColor: 'gold' },
    { id: 'R-025', firstName: 'Jason', lastName: 'Walker', initials: 'JW2', email: 'jason.walker@email.com', phone: '(205) 555-0845', address: '845 Highlands Dr', community: 'the-highlands', communityName: 'The Highlands', status: 'current', balance: 300.00, lastPayment: daysAgo(15), moveInDate: '2018-12-01', avatarColor: 'teal' },
    { id: 'R-026', firstName: 'Megan', lastName: 'Hall', initials: 'MH', email: 'megan.hall@email.com', phone: '(205) 555-0176', address: '176 Gardens Way', community: 'the-gardens', communityName: 'The Gardens', status: 'delinquent', balance: 675.00, lastPayment: daysAgo(88), moveInDate: '2017-04-22', avatarColor: 'navy' },
    { id: 'R-027', firstName: 'Ryan', lastName: 'Allen', initials: 'RA', email: 'ryan.allen@email.com', phone: '(205) 555-0534', address: '534 Summit View Ln', community: 'summit-view', communityName: 'Summit View', status: 'current', balance: 0, lastPayment: daysAgo(6), moveInDate: '2021-06-10', avatarColor: 'gold' },
    { id: 'R-028', firstName: 'Lisa', lastName: 'Young', initials: 'LY', email: 'lisa.young@email.com', phone: '(205) 555-0793', address: '793 Eagle Point Dr', community: 'eagle-point', communityName: 'Eagle Point', status: 'past-due', balance: 450.00, lastPayment: daysAgo(48), moveInDate: '2019-11-18', avatarColor: 'teal' },
    { id: 'R-029', firstName: 'Timothy', lastName: 'King', initials: 'TK', email: 'timothy.king@email.com', phone: '(205) 555-0367', address: '367 Magnolia Pl', community: 'magnolia-place', communityName: 'Magnolia Place', status: 'current', balance: 275.00, lastPayment: daysAgo(13), moveInDate: '2020-02-05', avatarColor: 'navy' },
    { id: 'R-030', firstName: 'Rebecca', lastName: 'Wright', initials: 'RW', email: 'rebecca.wright@email.com', phone: '(205) 555-0629', address: '629 Cypress Point Rd', community: 'cypress-point', communityName: 'Cypress Point', status: 'current', balance: 0, lastPayment: daysAgo(4), moveInDate: '2022-07-20', avatarColor: 'gold' },
    { id: 'R-031', firstName: 'Patrick', lastName: 'Scott', initials: 'PS', email: 'patrick.scott@email.com', phone: '(205) 555-0482', address: '482 Liberty Ridge Dr', community: 'liberty-ridge', communityName: 'Liberty Ridge', status: 'current', balance: 0, lastPayment: daysAgo(2), moveInDate: '2015-10-12', avatarColor: 'teal' },
    { id: 'R-032', firstName: 'Angela', lastName: 'Green', initials: 'AG', email: 'angela.green@email.com', phone: '(205) 555-0815', address: '815 Windsor Ct', community: 'windsor-court', communityName: 'Windsor Court', status: 'current', balance: 325.00, lastPayment: daysAgo(17), moveInDate: '2019-05-30', avatarColor: 'navy' },
    { id: 'R-033', firstName: 'Eric', lastName: 'Adams', initials: 'EA', email: 'eric.adams@email.com', phone: '(205) 555-0153', address: '153 Cahaba Preserve Way', community: 'preserve-at-cahaba', communityName: 'Preserve at Cahaba', status: 'current', balance: 0, lastPayment: daysAgo(5), moveInDate: '2021-01-08', avatarColor: 'gold' },
    { id: 'R-034', firstName: 'Heather', lastName: 'Nelson', initials: 'HN', email: 'heather.nelson@email.com', phone: '(205) 555-0696', address: '696 Stonebridge Pkwy', community: 'stonebridge', communityName: 'Stonebridge', status: 'current', balance: 275.00, lastPayment: daysAgo(11), moveInDate: '2018-06-25', avatarColor: 'teal' },
    { id: 'R-035', firstName: 'Gregory', lastName: 'Carter', initials: 'GC', email: 'gregory.carter@email.com', phone: '(205) 555-0928', address: '928 Bray Ct', community: 'the-bray', communityName: 'The Bray', status: 'current', balance: 0, lastPayment: daysAgo(1), moveInDate: '2023-02-14', avatarColor: 'navy' }
  ];

  // ============================================
  // WORK ORDERS
  // ============================================
  var workOrders = [
    { id: 'WO-1247', community: 'heritage-hills', communityName: 'Heritage Hills', title: 'Streetlight flickering on Magnolia Dr', description: 'Streetlight at the corner of Magnolia Dr and Oak intersection has been flickering intermittently for 2 weeks.', category: 'Electrical', priority: 'medium', status: 'in-progress', assignedTo: 'Mike Torres', estimatedCost: 450, createdDate: daysAgo(3), updatedDate: hoursAgo(6), reportedBy: 'Michael Bennett', timeline: [{ date: daysAgo(3), action: 'Created', actor: 'Michael Bennett', note: 'Reported via member portal' }, { date: daysAgo(2), action: 'Assigned', actor: 'Jennifer Walsh', note: 'Assigned to Mike Torres' }, { date: hoursAgo(6), action: 'Updated', actor: 'Mike Torres', note: 'Contacted Alabama Power, scheduled for inspection' }] },
    { id: 'WO-1246', community: 'brookstone', communityName: 'Brookstone', title: 'Fence section down after storm', description: 'Section of community fence along Brookstone Cir collapsed during last week\'s storm. Approximately 20ft section.', category: 'Fencing', priority: 'high', status: 'assigned', assignedTo: 'Regional Fence Co.', estimatedCost: 2800, createdDate: daysAgo(2), updatedDate: daysAgo(1), reportedBy: 'Jennifer Walsh', timeline: [{ date: daysAgo(2), action: 'Created', actor: 'Jennifer Walsh', note: 'Storm damage reported by multiple residents' }, { date: daysAgo(1), action: 'Assigned', actor: 'Sarah Chen', note: 'Vendor Regional Fence Co. notified, estimate requested' }] },
    { id: 'WO-1245', community: 'eagle-point', communityName: 'Eagle Point', title: 'Playground equipment inspection needed', description: 'Annual safety inspection for community playground equipment is due. Swing set chains showing wear.', category: 'Inspection', priority: 'high', status: 'pending', assignedTo: 'Unassigned', estimatedCost: 350, createdDate: daysAgo(1), updatedDate: daysAgo(1), reportedBy: 'Sarah Chen', timeline: [{ date: daysAgo(1), action: 'Created', actor: 'Sarah Chen', note: 'Annual inspection overdue, swing chains flagged' }] },
    { id: 'WO-1244', community: 'willow-creek', communityName: 'Willow Creek', title: 'Irrigation system leak - common area', description: 'Irrigation head leaking near the community entrance garden. Causing muddy area near walkway.', category: 'Landscaping', priority: 'medium', status: 'in-progress', assignedTo: 'GreenScape LLC', estimatedCost: 600, createdDate: daysAgo(5), updatedDate: daysAgo(1), reportedBy: 'Jennifer Murphy', timeline: [{ date: daysAgo(5), action: 'Created', actor: 'Jennifer Murphy', note: 'Reported via member portal' }, { date: daysAgo(4), action: 'Assigned', actor: 'Jennifer Walsh', note: 'Sent to GreenScape for assessment' }, { date: daysAgo(1), action: 'Updated', actor: 'GreenScape LLC', note: 'Parts ordered, repair scheduled for next week' }] },
    { id: 'WO-1243', community: 'the-bray', communityName: 'The Bray', title: 'Pool gate latch not closing properly', description: 'The main pool gate latch is sticking and not auto-closing. Safety concern for unsupervised access.', category: 'Pool/Amenity', priority: 'urgent', status: 'assigned', assignedTo: 'Mike Torres', estimatedCost: 200, createdDate: hoursAgo(8), updatedDate: hoursAgo(4), reportedBy: 'Rachel Foster', timeline: [{ date: hoursAgo(8), action: 'Created', actor: 'Rachel Foster', note: 'Urgent - gate not latching, kids in area' }, { date: hoursAgo(4), action: 'Assigned', actor: 'Jennifer Walsh', note: 'Mike Torres dispatched, ETA today' }] },
    { id: 'WO-1242', community: 'preserve-at-cahaba', communityName: 'Preserve at Cahaba', title: 'Pothole on main entrance road', description: 'Large pothole forming on the main entrance road near the guardhouse. Getting worse with rain.', category: 'Roads', priority: 'high', status: 'pending', assignedTo: 'Unassigned', estimatedCost: 1200, createdDate: daysAgo(1), updatedDate: daysAgo(1), reportedBy: 'Maria Garcia', timeline: [{ date: daysAgo(1), action: 'Created', actor: 'Maria Garcia', note: 'Reported via member portal with photo' }] },
    { id: 'WO-1241', community: 'stonebridge', communityName: 'Stonebridge', title: 'Gutter cleaning - clubhouse', description: 'Gutters on the community clubhouse overflowing during rain. Needs cleaning and inspection.', category: 'Maintenance', priority: 'low', status: 'scheduled', assignedTo: 'ABC Maintenance', estimatedCost: 400, createdDate: daysAgo(7), updatedDate: daysAgo(3), reportedBy: 'Jennifer Walsh', timeline: [{ date: daysAgo(7), action: 'Created', actor: 'Jennifer Walsh', note: 'Routine maintenance item' }, { date: daysAgo(5), action: 'Assigned', actor: 'Jennifer Walsh', note: 'ABC Maintenance contacted' }, { date: daysAgo(3), action: 'Scheduled', actor: 'ABC Maintenance', note: 'Scheduled for ' + formatDate(daysFromNow(4)) }] },
    { id: 'WO-1240', community: 'liberty-ridge', communityName: 'Liberty Ridge', title: 'Sign replacement at entrance', description: 'Community entrance sign damaged by delivery truck. Need new sign fabricated and installed.', category: 'Signage', priority: 'medium', status: 'in-progress', assignedTo: 'SignPro Birmingham', estimatedCost: 3500, createdDate: daysAgo(10), updatedDate: daysAgo(2), reportedBy: 'Laura Anderson', timeline: [{ date: daysAgo(10), action: 'Created', actor: 'Laura Anderson', note: 'Delivery truck hit entrance sign' }, { date: daysAgo(8), action: 'Assigned', actor: 'Jennifer Walsh', note: 'Insurance claim filed, SignPro contacted' }, { date: daysAgo(5), action: 'Updated', actor: 'SignPro Birmingham', note: 'Design proof sent for approval' }, { date: daysAgo(2), action: 'Updated', actor: 'Jennifer Walsh', note: 'Design approved, fabrication in progress. ETA 2 weeks.' }] },
    { id: 'WO-1239', community: 'the-highlands', communityName: 'The Highlands', title: 'Mailbox cluster - door hinge broken', description: 'Unit #4 door hinge on the mailbox cluster at Highlands Dr is broken. Mail exposed to weather.', category: 'Maintenance', priority: 'medium', status: 'assigned', assignedTo: 'Mike Torres', estimatedCost: 150, createdDate: daysAgo(4), updatedDate: daysAgo(2), reportedBy: 'Jason Walker', timeline: [{ date: daysAgo(4), action: 'Created', actor: 'Jason Walker', note: 'Reported via member portal' }, { date: daysAgo(2), action: 'Assigned', actor: 'Sarah Chen', note: 'Mike Torres assigned, parts on order' }] },
    { id: 'WO-1238', community: 'oakridge', communityName: 'Oakridge', title: 'Tree removal - dead oak in common area', description: 'Large dead oak tree in the Oakridge common area is a falling hazard. Arborist confirmed removal needed.', category: 'Landscaping', priority: 'high', status: 'scheduled', assignedTo: 'Birmingham Tree Service', estimatedCost: 4200, createdDate: daysAgo(14), updatedDate: daysAgo(5), reportedBy: 'David Chen', timeline: [{ date: daysAgo(14), action: 'Created', actor: 'David Chen', note: 'Dead tree reported, arborist consultation requested' }, { date: daysAgo(10), action: 'Updated', actor: 'Jennifer Walsh', note: 'Arborist confirmed removal needed, 3 quotes requested' }, { date: daysAgo(7), action: 'Updated', actor: 'Jennifer Walsh', note: 'Birmingham Tree Service selected ($4,200)' }, { date: daysAgo(5), action: 'Scheduled', actor: 'Birmingham Tree Service', note: 'Removal scheduled for ' + formatDate(daysFromNow(7)) }] },
    { id: 'WO-1237', community: 'the-gardens', communityName: 'The Gardens', title: 'Common area bench repair', description: 'Two benches near the walking trail have broken slats. Need replacement wooden slats.', category: 'Maintenance', priority: 'low', status: 'completed', assignedTo: 'Mike Torres', estimatedCost: 320, createdDate: daysAgo(18), updatedDate: daysAgo(4), reportedBy: 'Christopher Taylor', timeline: [{ date: daysAgo(18), action: 'Created', actor: 'Christopher Taylor', note: 'Two benches with broken slats on walking trail' }, { date: daysAgo(15), action: 'Assigned', actor: 'Sarah Chen', note: 'Assigned to Mike Torres' }, { date: daysAgo(8), action: 'Updated', actor: 'Mike Torres', note: 'Lumber purchased, repair started' }, { date: daysAgo(4), action: 'Completed', actor: 'Mike Torres', note: 'Both benches repaired and stained. Total cost: $285.' }] },
    { id: 'WO-1236', community: 'windsor-court', communityName: 'Windsor Court', title: 'Parking lot restriping', description: 'Visitor parking lot lines are faded and barely visible. Needs full restriping including handicap spaces.', category: 'Roads', priority: 'low', status: 'completed', assignedTo: 'ProStripe AL', estimatedCost: 1800, createdDate: daysAgo(25), updatedDate: daysAgo(8), reportedBy: 'Thomas Wilson', timeline: [{ date: daysAgo(25), action: 'Created', actor: 'Thomas Wilson', note: 'Parking lines barely visible, safety concern' }, { date: daysAgo(22), action: 'Assigned', actor: 'Jennifer Walsh', note: 'ProStripe AL contacted for quote' }, { date: daysAgo(15), action: 'Scheduled', actor: 'ProStripe AL', note: 'Scheduled for restriping' }, { date: daysAgo(8), action: 'Completed', actor: 'ProStripe AL', note: 'Full restriping complete including 4 ADA spaces. Cost: $1,650.' }] },
    { id: 'WO-1235', community: 'cypress-point', communityName: 'Cypress Point', title: 'Exterior light timer adjustment', description: 'Community common area lights turning off too early. Timer needs to be adjusted for daylight savings.', category: 'Electrical', priority: 'low', status: 'completed', assignedTo: 'Mike Torres', estimatedCost: 0, createdDate: daysAgo(12), updatedDate: daysAgo(10), reportedBy: 'Robert Martinez', timeline: [{ date: daysAgo(12), action: 'Created', actor: 'Robert Martinez', note: 'Lights going off at 7pm, too early now' }, { date: daysAgo(11), action: 'Assigned', actor: 'Sarah Chen', note: 'Quick fix, assigned to Mike Torres' }, { date: daysAgo(10), action: 'Completed', actor: 'Mike Torres', note: 'Timer adjusted. Lights now set to dusk sensor mode.' }] }
  ];

  // Next WO ID counter
  var nextWoId = 1248;

  // ============================================
  // PAYMENTS (member persona: Michael Bennett)
  // ============================================
  var payments = [
    { id: 'PAY-8847', date: daysAgo(12), description: 'Q2 Assessment - Heritage Hills', amount: 275.00, method: 'Visa ending in 4242', status: 'completed', confirmationNumber: 'LP-2026-884712' },
    { id: 'PAY-8621', date: daysAgo(102), description: 'Q1 Assessment - Heritage Hills', amount: 275.00, method: 'Visa ending in 4242', status: 'completed', confirmationNumber: 'LP-2026-862134' },
    { id: 'PAY-8405', date: daysAgo(192), description: 'Q4 Assessment - Heritage Hills', amount: 275.00, method: 'Bank Account ending in 8901', status: 'completed', confirmationNumber: 'LP-2025-840556' },
    { id: 'PAY-8190', date: daysAgo(282), description: 'Q3 Assessment - Heritage Hills', amount: 275.00, method: 'Bank Account ending in 8901', status: 'completed', confirmationNumber: 'LP-2025-819023' },
    { id: 'PAY-7984', date: daysAgo(372), description: 'Q2 Assessment - Heritage Hills', amount: 250.00, method: 'Visa ending in 4242', status: 'completed', confirmationNumber: 'LP-2025-798412' },
    { id: 'PAY-7761', date: daysAgo(462), description: 'Q1 Assessment - Heritage Hills', amount: 250.00, method: 'Visa ending in 4242', status: 'completed', confirmationNumber: 'LP-2025-776189' }
  ];

  // ============================================
  // ARC APPLICATIONS
  // ============================================
  var arcApplications = [
    { id: 'ARC-2026-031', resident: 'Michael Bennett', community: 'Heritage Hills', address: '1842 Liberty Ridge Dr', type: 'Fence Installation', description: 'Privacy fence, cedar, 6-foot, along rear property line', status: 'under-review', submittedDate: daysAgo(6), estimatedCost: 8500, attachments: 2 },
    { id: 'ARC-2026-030', resident: 'Thomas Wilson', community: 'Windsor Court', address: '188 Windsor Ct', type: 'Deck Expansion', description: 'Extend existing deck by 8 feet with composite decking', status: 'approved', submittedDate: daysAgo(12), estimatedCost: 12000, attachments: 4, approvedDate: daysAgo(5) },
    { id: 'ARC-2026-029', resident: 'Laura Anderson', community: 'Liberty Ridge', address: '463 Liberty Ridge Dr', type: 'Exterior Paint', description: 'Repaint front door and shutters - Benjamin Moore "Hale Navy"', status: 'approved', submittedDate: daysAgo(15), estimatedCost: 1800, attachments: 1, approvedDate: daysAgo(8) },
    { id: 'ARC-2026-028', resident: 'Rachel Foster', community: 'The Bray', address: '421 Overton Way', type: 'Roof Replacement', description: 'Full roof replacement with architectural shingles, charcoal gray', status: 'under-review', submittedDate: daysAgo(4), estimatedCost: 18500, attachments: 3 },
    { id: 'ARC-2026-027', resident: 'James Cooper', community: 'Brookstone', address: '387 Brookstone Cir', type: 'Patio Extension', description: 'Flagstone patio, 12x16 feet, with built-in fire pit', status: 'approved-with-conditions', submittedDate: daysAgo(20), estimatedCost: 9200, attachments: 2, approvedDate: daysAgo(10), conditions: 'Fire pit must be gas, not wood-burning. Setback from fence must be 5ft minimum.' },
    { id: 'ARC-2026-026', resident: 'Daniel Thompson', community: 'Stonebridge', address: '556 Stonebridge Pkwy', type: 'Driveway Repaving', description: 'Full driveway repaving with stamped concrete', status: 'denied', submittedDate: daysAgo(25), estimatedCost: 6800, attachments: 1, deniedDate: daysAgo(18), deniedReason: 'Stamped concrete pattern does not conform to community design guidelines. Resubmit with approved pattern options.' },
    { id: 'ARC-2026-025', resident: 'Emily Johnson', community: 'Magnolia Place', address: '275 Magnolia Pl', type: 'Landscaping', description: 'Remove two Bradford pear trees, plant 3 Japanese maples', status: 'approved', submittedDate: daysAgo(30), estimatedCost: 3200, attachments: 1, approvedDate: daysAgo(22) },
    { id: 'ARC-2026-024', resident: 'Mark Robinson', community: 'Preserve at Cahaba', address: '378 Cahaba Preserve Way', type: 'Solar Panels', description: 'Roof-mounted solar panel installation, 24 panels', status: 'under-review', submittedDate: daysAgo(2), estimatedCost: 28000, attachments: 5 }
  ];

  // ============================================
  // COMPLIANCE VIOLATIONS
  // ============================================
  var violations = [
    { id: 'VIO-0452', address: '293 Eagle Point Dr', resident: 'Nathan Brooks', community: 'Eagle Point', type: 'Yard Maintenance', description: 'Grass exceeding 8-inch maximum height', severity: 'warning', status: 'open', createdDate: daysAgo(2), assignedTo: 'Sarah Chen' },
    { id: 'VIO-0451', address: '176 Gardens Way', resident: 'Megan Hall', community: 'The Gardens', type: 'Parking', description: 'Inoperable vehicle parked in driveway for 30+ days', severity: 'notice', status: 'open', createdDate: daysAgo(5), assignedTo: 'Sarah Chen' },
    { id: 'VIO-0450', address: '845 Highlands Dr', resident: 'Jason Walker', community: 'The Highlands', type: 'Exterior Appearance', description: 'Unapproved paint color on front door', severity: 'notice', status: 'hearing-scheduled', createdDate: daysAgo(14), assignedTo: 'Jennifer Walsh', hearingDate: daysFromNow(5) },
    { id: 'VIO-0449', address: '259 Liberty Ridge Dr', resident: 'Brian Harris', community: 'Liberty Ridge', type: 'Yard Maintenance', description: 'Dead shrubs in front landscaping beds, not replaced within 30-day notice period', severity: 'fine', status: 'fine-issued', createdDate: daysAgo(35), assignedTo: 'Sarah Chen', fineAmount: 150 },
    { id: 'VIO-0448', address: '683 Brookstone Cir', resident: 'Stephanie White', community: 'Brookstone', type: 'Trash/Debris', description: 'Trash cans left at curb past 24-hour removal deadline', severity: 'warning', status: 'resolved', createdDate: daysAgo(10), assignedTo: 'Sarah Chen', resolvedDate: daysAgo(7) },
    { id: 'VIO-0447', address: '534 Summit View Ln', resident: 'Ryan Allen', community: 'Summit View', type: 'Parking', description: 'Commercial vehicle parked overnight in residential area', severity: 'notice', status: 'open', createdDate: daysAgo(3), assignedTo: 'Sarah Chen' },
    { id: 'VIO-0446', address: '941 Windsor Ct', resident: 'Nicole Lewis', community: 'Windsor Court', type: 'Noise', description: 'Repeated noise complaints from neighbors regarding late-night construction', severity: 'warning', status: 'resolved', createdDate: daysAgo(20), assignedTo: 'Jennifer Walsh', resolvedDate: daysAgo(12) },
    { id: 'VIO-0445', address: '387 Brookstone Cir', resident: 'James Cooper', community: 'Brookstone', type: 'Unapproved Modification', description: 'Storage shed installed without ARC approval', severity: 'notice', status: 'open', createdDate: daysAgo(8), assignedTo: 'Jennifer Walsh' },
    { id: 'VIO-0444', address: '928 Bray Ct', resident: 'Gregory Carter', community: 'The Bray', type: 'Pet', description: 'Dog off-leash in common area - second offense', severity: 'warning', status: 'resolved', createdDate: daysAgo(15), assignedTo: 'Sarah Chen', resolvedDate: daysAgo(13) },
    { id: 'VIO-0443', address: '696 Stonebridge Pkwy', resident: 'Heather Nelson', community: 'Stonebridge', type: 'Holiday Decorations', description: 'Holiday decorations not removed within 15-day post-holiday window', severity: 'notice', status: 'resolved', createdDate: daysAgo(30), assignedTo: 'Sarah Chen', resolvedDate: daysAgo(25) }
  ];

  // ============================================
  // CALENDAR EVENTS (relative to today)
  // ============================================
  var events = [
    { id: 'EVT-001', title: 'Board Meeting', community: 'Oakridge', location: 'Oakridge Clubhouse', date: daysFromNow(3), time: '7:00 PM', type: 'board', description: 'Quarterly board meeting - budget review and community updates' },
    { id: 'EVT-002', title: 'Annual Inspection', community: 'Willow Creek', location: 'Common Areas', date: daysFromNow(5), time: '9:00 AM', type: 'inspection', description: 'Annual property and common area inspection walk-through' },
    { id: 'EVT-003', title: 'Community Cookout', community: 'Heritage Hills', location: 'Heritage Hills Pavilion', date: daysFromNow(8), time: '11:00 AM', type: 'community', description: 'Spring community cookout - burgers, hot dogs, games for kids' },
    { id: 'EVT-004', title: 'Budget Review', community: 'Brookstone', location: 'Brookstone Community Center', date: daysFromNow(10), time: '6:00 PM', type: 'board', description: 'Mid-year budget review with financial committee' },
    { id: 'EVT-005', title: 'Q3 Assessments Due', community: 'All Communities', location: '', date: daysFromNow(14), time: '', type: 'deadline', description: 'Q3 HOA assessments due for all communities' },
    { id: 'EVT-006', title: 'Pool Season Opens', community: 'All Communities', location: 'Community Pools', date: daysFromNow(18), time: '10:00 AM', type: 'community', description: 'Pools open for the season. Hours: 10AM-8PM daily.' },
    { id: 'EVT-007', title: 'Clubhouse Rental', community: 'Summit View', location: 'Summit View Clubhouse', date: daysFromNow(6), time: '2:00 PM', type: 'reservation', description: 'Private event reservation - Thompson family' },
    { id: 'EVT-008', title: 'Compliance Hearing', community: 'The Highlands', location: 'Management Office', date: daysFromNow(5), time: '10:00 AM', type: 'hearing', description: 'Hearing for VIO-0450 - unapproved exterior modification' },
    { id: 'EVT-009', title: 'Tree Removal', community: 'Oakridge', location: 'Common Area', date: daysFromNow(7), time: '8:00 AM', type: 'maintenance', description: 'Birmingham Tree Service - dead oak removal (WO-1238)' },
    { id: 'EVT-010', title: 'Board Meeting', community: 'Stonebridge', location: 'Stonebridge Clubhouse', date: daysFromNow(12), time: '6:30 PM', type: 'board', description: 'Monthly board meeting - new business and resident concerns' }
  ];

  // ============================================
  // ACTIVITY FEED (relative timestamps)
  // ============================================
  var activityFeed = [
    { id: 'ACT-001', type: 'work-order', icon: 'wrench', text: 'Jennifer Walsh created work order WO-1243', detail: 'Pool gate latch - The Bray', time: hoursAgo(4), color: 'navy' },
    { id: 'ACT-002', type: 'payment', icon: 'dollar', text: 'Payment received from Rachel Foster', detail: '$275.00 — Q2 Assessment', time: hoursAgo(6), color: 'teal' },
    { id: 'ACT-003', type: 'arc', icon: 'clipboard', text: 'ARC application submitted', detail: 'ARC-2026-024 — Solar panels, Preserve at Cahaba', time: hoursAgo(8), color: 'gold' },
    { id: 'ACT-004', type: 'violation', icon: 'alert', text: 'Violation notice issued', detail: 'VIO-0452 — Yard maintenance, Eagle Point', time: hoursAgo(12), color: 'danger' },
    { id: 'ACT-005', type: 'payment', icon: 'dollar', text: 'Payment received from Emily Johnson', detail: '$275.00 — Q2 Assessment', time: hoursAgo(18), color: 'teal' },
    { id: 'ACT-006', type: 'work-order', icon: 'wrench', text: 'Work order WO-1237 marked complete', detail: 'Bench repair — The Gardens', time: daysAgo(1), color: 'teal' },
    { id: 'ACT-007', type: 'document', icon: 'file', text: 'Board minutes uploaded', detail: 'Oakridge — March 2026 meeting minutes', time: daysAgo(1), color: 'navy' },
    { id: 'ACT-008', type: 'resident', icon: 'user', text: 'New resident registered', detail: 'Gregory Carter — 928 Bray Ct, The Bray', time: daysAgo(2), color: 'gold' },
    { id: 'ACT-009', type: 'payment', icon: 'dollar', text: '14 payments processed', detail: 'Batch processing — Auto-pay collections', time: daysAgo(2), color: 'teal' },
    { id: 'ACT-010', type: 'arc', icon: 'clipboard', text: 'ARC-2026-029 approved', detail: 'Exterior paint — Liberty Ridge', time: daysAgo(3), color: 'teal' },
    { id: 'ACT-011', type: 'violation', icon: 'alert', text: 'Violation VIO-0448 resolved', detail: 'Trash/debris — Brookstone', time: daysAgo(3), color: 'teal' },
    { id: 'ACT-012', type: 'work-order', icon: 'wrench', text: 'Work order WO-1240 updated', detail: 'Sign design approved — Liberty Ridge', time: daysAgo(3), color: 'navy' },
    { id: 'ACT-013', type: 'payment', icon: 'dollar', text: 'Payment received from Amanda Price', detail: '$275.00 — Q2 Assessment', time: daysAgo(4), color: 'teal' },
    { id: 'ACT-014', type: 'resident', icon: 'user', text: 'Resident profile updated', detail: 'Michael Bennett — Heritage Hills', time: daysAgo(5), color: 'navy' },
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
  // MEMBER PERSONA (Michael Bennett)
  // ============================================
  var memberPersona = {
    residentId: 'R-001',
    firstName: 'Michael',
    lastName: 'Bennett',
    initials: 'MB',
    address: '1842 Liberty Ridge Dr',
    city: 'Birmingham',
    state: 'AL',
    zip: '35242',
    community: 'Heritage Hills',
    communityId: 'heritage-hills',
    accountNumber: 'HH-1842',
    memberSince: 2019,
    assessment: 275.00,
    balance: 275.00,
    nextDueDate: daysFromNow(14),
    paymentMethods: [
      { type: 'card', label: 'Visa ending in 4242', fee: 0.03 },
      { type: 'ach', label: 'Bank Account ending in 8901', fee: 0 }
    ],
    household: [
      { name: 'Michael Bennett', role: 'Primary', age: 42 },
      { name: 'Emily Bennett', role: 'Spouse', age: 39 },
      { name: 'Lucas Bennett', role: 'Dependent', age: 14 }
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
    wo.timeline = [{ date: new Date(), action: 'Created', actor: 'Jennifer Walsh', note: 'Created via staff portal' }];
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
