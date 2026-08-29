/* ============================================================
   Southern Roots — content data
   ------------------------------------------------------------
   Every athlete stat, honor and social handle below was migrated
   from soroots.biz and the agency's own published signing
   graphics. Nothing here is invented.

   In the production build this file is replaced by the Supabase
   query layer — the shape of each record stays identical, so the
   roster, profile pages and staff dashboard keep working as-is.
   ============================================================ */

const SR_ATHLETES = [
  {
    slug: 'betty-nelson',
    name: 'Betty Nelson',
    first: 'Betty', last: 'Nelson',
    sport: "Women's Lacrosse",
    sportKey: 'lacrosse',
    school: 'University of North Carolina',
    schoolShort: 'UNC',
    position: 'Goalie',
    year: 'Sophomore',
    level: 'college',
    hometown: null,
    photo: 'betty-nelson.jpg',
    card: 'card-betty.jpg',
    signed: 'April 2026',
    blurb: 'A national-champion goalie anchoring one of the most decorated defenses in college lacrosse.',
    stats: [
      { value: '7.37', label: 'Goals against avg (T-10)' },
      { value: '4th', label: 'Scoring defense' },
      { value: '128', label: 'Saves' }
    ],
    honors: [
      '2025 National Champion',
      '2025 ACC Champion',
      '2025 Second Team All-ACC',
      '2025 USA Lacrosse Third Team All-America',
      '2025 Nike Lacrosse Media Honorable Mention All-America',
      '2025 NCAA All-Tournament Team',
      '2025 IWLCA All-South Region Second Team',
      '2025 ACC All-Tournament Team'
    ],
    socials: [
      { net: 'instagram', handle: '@netty.belson', url: 'https://www.instagram.com/netty.belson/', followers: '8,000' },
      { net: 'tiktok', handle: '@laxit1ves', url: 'https://www.tiktok.com/@laxit1ves', followers: '3,044' }
    ],
    visible: true
  },
  {
    slug: 'claire-jones',
    name: 'Claire Jones',
    first: 'Claire', last: 'Jones',
    sport: "Women's Soccer",
    sportKey: 'soccer',
    school: 'University of Pittsburgh',
    schoolShort: 'Pitt',
    position: 'Defender',
    year: 'Senior',
    level: 'college',
    hometown: 'Ridgefield, WA',
    height: '5\'6"',
    photo: 'claire-jones.jpg',
    card: 'card-claire.jpg',
    signed: null,
    blurb: 'A three-program veteran defender with more than 3,300 career minutes and an academic record to match.',
    stats: [
      { value: '40', label: 'Career starts' },
      { value: '1,967', label: 'Minutes at Oregon State' },
      { value: '1,340', label: 'Minutes at SMU' }
    ],
    honors: [
      'All-WCC Academic Team (sophomore season, Oregon State)',
      '3,307 career minutes played',
      '40 career starts'
    ],
    socials: [
      { net: 'instagram', handle: '@clairejones.25', url: 'https://www.instagram.com/clairejones.25/', followers: '2.2K' },
      { net: 'tiktok', handle: '@clairejones.25', url: 'https://www.tiktok.com/@clairejones.25', followers: '838' }
    ],
    visible: true
  },
  {
    slug: 'ginni-van-katwijk',
    name: 'Ginni Van Katwijk',
    first: 'Ginni', last: 'Van Katwijk',
    sport: 'High Diving',
    sportKey: 'diving',
    school: 'TeamNL',
    schoolShort: 'TeamNL',
    position: 'Professional Cliff Diver',
    year: 'Professional',
    level: 'pro',
    hometown: 'Fort Lauderdale, FL',
    photo: 'ginni-van-katwijk.jpg',
    card: 'card-ginni.jpg',
    signed: 'June 2026',
    blurb: 'Red Bull Cliff Diving World Series athlete and TeamNL high diver with a 142K-strong following.',
    stats: [
      { value: '142K', label: 'Instagram following' },
      { value: '2nd', label: 'Red Bull World Series, N. Ireland' },
      { value: '6th', label: 'World Cup, Fort Lauderdale 2026' }
    ],
    honors: [
      '2024 Red Bull Cliff Diving World Series — 2nd Place, Northern Ireland',
      'Red Bull Cliff Diving athlete',
      'TeamNL high diver',
      'World Aquatics High Diving World Cup competitor since 2023'
    ],
    results: [
      { year: '2026', event: 'Fort Lauderdale, USA (Stop 1)', place: '6th' },
      { year: '2025', event: 'Porto Flavia, Italy', place: '6th' },
      { year: '2024', event: 'Manama, Bahrain', place: '10th' },
      { year: '2023', event: 'Fort Lauderdale, USA', place: '15th' }
    ],
    socials: [
      { net: 'instagram', handle: '@adventures_with_ginni', url: 'https://www.instagram.com/adventures_with_ginni/', followers: '142K' }
    ],
    visible: true
  },
  {
    slug: 'brielle-burns',
    name: 'Brielle Burns',
    first: 'Brielle', last: 'Burns',
    sport: "Women's Golf",
    sportKey: 'golf',
    school: "St. Mary's University",
    schoolShort: "St. Mary's",
    position: 'Golfer',
    year: 'Junior',
    level: 'college',
    hometown: null,
    photo: 'brielle-burns.jpg',
    card: 'card-brielle.jpg',
    signed: null,
    blurb: 'Lone Star Conference Newcomer of the Year and a five-time honoree in a single season.',
    stats: [
      { value: '5', label: '2026 honors' },
      { value: '1st', label: 'Team All-Lone Star Conference' },
      { value: '2.8K', label: 'Instagram following' }
    ],
    honors: [
      '2026 Lone Star Conference Newcomer of the Year',
      '2026 First Team All-Lone Star Conference',
      '2026 CSC Academic All-District',
      '2026 WGCA All-American Scholar',
      '2026 Lone Star All-Academic'
    ],
    socials: [
      { net: 'instagram', handle: '@brielleburns84', url: 'https://www.instagram.com/brielleburns84/', followers: '2.8K' }
    ],
    visible: true
  }
];

const SR_TEAM = [
  {
    slug: 'don-wagner',
    name: 'Donald E. Wagner',
    role: 'Founder / Chief Executive Officer',
    photo: 'team-don-wagner.jpg',
    bio: "Don Wagner has spent his entire career and entire life in service to others — and that's exactly why he started this firm. He saw a gap in the industry: athletes who deserve better — more transparency, more inclusion in the process, and representation that actually puts them first. So he built the firm he wished had existed for them. With 20 years of Army service — advising generals, fighting for clients in high-stakes courts-martial, and overseeing the legal review of multimillion-dollar contracts — Don brings a rare combination of legal firepower and genuine human care to everything he does. He started as a sportswriter and storyteller, which means he knows how to listen, communicate clearly, and make sure your voice is always heard.",
    cred: "Penn State '97  |  J.D., University of Miami School of Law '12  |  U.S. Army (Ret.)",
    visible: true
  },
  {
    slug: 'sarah-nasif',
    name: 'Sarah Nasif',
    role: 'Chief Marketing Officer',
    photo: 'team-sarah-nasif.jpg',
    bio: 'Sarah Nasif is a dynamic sports media and communications professional with over seven years of experience spanning marketing, content creation, public relations, contract negotiation, and player operations. She has worked across both collegiate and professional sports, building a reputation for strategic storytelling and athlete-centered brand development. A strong advocate for authentic player representation, Sarah has collaborated with player personnel throughout the evolving Name, Image, and Likeness era — helping athletes amplify their voices, protect their interests, and connect meaningfully with fans and communities.',
    cred: null,
    visible: true
  },
  {
    slug: 'georgia-barr',
    name: 'Georgia Barr',
    role: 'Director of Player Portfolios — Golf',
    photo: 'team-georgia-barr.jpg',
    bio: "Georgia Barr comes to Southern Roots from Calgary, Alberta, Canada. She played Division I golf at Gardner-Webb University in North Carolina while studying Business Management and minoring in Marketing. She is extremely passionate about college sports and helping other collegiate athletes find opportunities that support their success. She works mainly as the Director of Southern Roots' golf portfolio, and also spends significant time as a golf agent helping grow the firm's client base.",
    cred: 'Gardner-Webb University  |  Division I Golf  |  Business Management, Marketing minor',
    visible: true
  },
  {
    slug: 'sydney-huff',
    name: 'Sydney Huff',
    role: 'Senior Marketing Representative',
    photo: 'team-sydney-huff.jpg',
    bio: 'Sydney Huff is an experienced marketing specialist with a background in brand development, social media strategy, event coordination, and client operations built through professional roles in hospitality and legal environments as well as academic work. Sydney is passionate about sports marketing, NIL opportunities, and athlete branding and representation.',
    cred: null,
    visible: true
  },
  {
    slug: 'nicole-pizzo',
    name: 'Nicole Pizzo',
    role: 'Marketing Representative',
    photo: 'team-nicole-pizzo.jpg',
    bio: 'Nicole Pizzo is a May 2026 Clemson graduate with a B.A. in Communication and a Spanish minor, as well as a former NCAA Division I student-athlete in cross country and track & field. A three-season competitor, All-ACC Academic Team member, and Tiger Leadership Academy participant, she brings firsthand insight into collegiate athletics. Nicole has experience in strategic communication, brand development, and operational planning through academic and professional roles, including producing a full operational and media plan for a national-level event concept. At Southern Roots she coordinates staff functions and supports strategic and organizational development.',
    cred: 'Clemson University  |  B.A. Communication  |  NCAA Division I Cross Country & Track',
    visible: true
  },
  {
    slug: 'cali-bishop',
    name: 'Cali Bishop',
    role: 'Legal Intern',
    photo: 'team-cali-bishop.jpg',
    bio: 'Cali Bishop joins the Southern Roots team after a long and distinguished lacrosse career at both Florida and Louisville. Now, as she prepares to attend Boston College School of Law, Cali joins the team as a Legal Intern. A native of New Hampshire, Cali relies on the expansive knowledge she gained as a Division I athlete to assist the firm with state-registration compliance and researching the laws and regulations governing athlete representation. Her work ensures the team has the most current understanding of an ever-changing legal landscape so it can advise clients accurately.',
    cred: 'Florida & Louisville Lacrosse  |  Boston College School of Law (incoming)',
    visible: true
  }
];

const SR_NEWS = [
  {
    id: 'georgia-barr',
    date: 'July 2026',
    title: 'Southern Roots welcomes Georgia Barr as Director of Player Portfolios — Golf',
    athlete: 'Georgia Barr',
    excerpt: 'A Division I golfer at Gardner-Webb, Georgia joins the firm to lead the golf portfolio and grow the client base.',
    image: 'team-georgia-barr.jpg',
    link: 'about.html#team',
    visible: true
  },
  {
    id: 'ginni-signing',
    date: 'June 2026',
    title: 'Southern Roots signs Red Bull cliff diver Ginni Van Katwijk',
    athlete: 'Ginni Van Katwijk',
    excerpt: 'The TeamNL high diver and Red Bull Cliff Diving World Series podium finisher joins the professional roster.',
    image: 'ginni-van-katwijk.jpg',
    link: 'athletes/ginni-van-katwijk.html',
    visible: true
  },
  {
    id: 'betty-signing',
    date: 'April 2026',
    title: "Southern Roots signs UNC women's lacrosse goalie Betty Nelson",
    athlete: 'Betty Nelson',
    excerpt: 'The 2025 national champion goalie brings a top-ten goals-against average and eight honors from a single season.',
    image: 'betty-nelson.jpg',
    link: 'athletes/betty-nelson.html',
    visible: true
  }
];

const SR_SERVICES = [
  {
    key: 'nil-representation',
    title: 'NIL Representation',
    copy: 'Expert representation for professional and college athletes, maximizing NIL value through strategic partnerships.',
    detail: 'We handle inbound and outbound deal flow, vet every partner, and make sure the athlete understands what they are signing before they sign it. You keep the relationship with your fans and your school; we handle the paperwork, the negotiation and the follow-through.'
  },
  {
    key: 'contract-negotiation',
    title: 'Contract Negotiation',
    copy: 'Line-by-line review and negotiation of every agreement, led by a licensed attorney and former Army JAG.',
    detail: 'Every deal gets read in full and explained in plain language before anyone signs. We negotiate term, exclusivity, usage rights, renewal and termination — and we tell you when a deal is not worth taking.'
  },
  {
    key: 'brand-strategy',
    title: 'Brand Strategy & Endorsements',
    copy: 'Securing high-impact brand partnerships and endorsements that align with your athlete-first career values.',
    detail: 'We build the story before we sell it: positioning, content direction, social growth and the kind of partner that still makes sense for you in five years.'
  },
  {
    key: 'post-career',
    title: 'Post-Career Advising',
    copy: 'End-to-end strategy for a successful transition from college NIL deals to long-term professional success.',
    detail: 'Careers in sport are short. We plan for what comes after — education, network, credentials and the financial habits that make the NIL years matter long after the last season.'
  },
  {
    key: 'nil-strategy',
    title: 'NIL Strategy',
    copy: 'Custom NIL roadmaps tailored to monetize your influence during and after your collegiate sports career.',
    detail: 'A written plan for the season and the offseason: which categories fit, what your audience is actually worth, and where to invest your limited time for the biggest return.'
  },
  {
    key: 'management',
    title: 'Athlete Management',
    copy: 'Day-to-day representation and coordination so athletes and families can focus on competing.',
    detail: 'Scheduling, appearances, brand communication, compliance paperwork and the constant small decisions that come with being a represented athlete — handled, tracked and reported back to you.'
  }
];

/* Partnership categories are deliberately left empty until each athlete
   confirms them. The profile template renders a labeled placeholder
   rather than guessing on an athlete's behalf. */
const SR_CATEGORY_PLACEHOLDER = true;

if (typeof module !== 'undefined') { module.exports = { SR_ATHLETES, SR_TEAM, SR_NEWS, SR_SERVICES }; }
