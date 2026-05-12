/* ================================================================
   LEGACY TRUST · AGENT OPERATIONS PORTAL
   Single-file logic — no framework, no build step.
   ================================================================ */

/* ===========================================================
   DATA
   =========================================================== */

const PLAYERS = [
  {id:'mosley',init:'M',name:'C.J. Mosley',pos:'LB',team:'NY Jets',contract:'$17.0M / 1yr',contractValue:17000000,expires:'Mar 2027',career:'$87.0M',careerValue:87000000,status:'active',sub:'11-yr veteran · 5× Pro Bowl',years:11,age:33,draftRound:1,draftYear:2014,
    history:[
      {date:'Apr 2014',title:'1st-round draft pick · Baltimore',text:'17th overall. 4-year rookie deal with 5th-year option. Immediate starter at MLB.',amt:'$8.9M',state:'completed'},
      {date:'Mar 2019',title:'Free agent signing · NY Jets',text:'5-year, $85M contract with $51M guaranteed. Largest ILB deal at time of signing.',amt:'$85.0M',state:'completed'},
      {date:'Mar 2023',title:'Re-signed · NY Jets',text:'1-year deal at $6.0M. Player option declined; structured for cap flexibility.',amt:'$6.0M',state:'completed'},
      {date:'Mar 2024',title:'Re-signed · NY Jets',text:'1-year deal at $7.5M with $4.0M guaranteed. Veteran minimum protections.',amt:'$7.5M',state:'completed'},
      {date:'May 2026',title:'Extension talks · NY Jets',text:'NYJ FO returned with $19.5M / 1yr. Counter at $24M / 2yr with 60% guarantees drafted.',amt:'$24M target',state:'current'}
    ],
    endorsements:[
      {brand:'Beats by Dre',value:'$140,000',term:'12-month',stage:'Negotiating'},
      {brand:'Topps',value:'Royalty deal',term:'Trading card series',stage:'Legal review'},
      {brand:'Under Armour',value:'$210,000',term:'Active · renews Jun 2026',stage:'Active'},
      {brand:'Mosley Family Foundation',value:'Non-revenue',term:'Personal',stage:'Active'}
    ],
    comms:[
      {who:'Joe Douglas (NYJ GM)',when:'Today · 9:42 AM',channel:'call',text:'Initial counter discussion. Open to 2-year structure if guarantees come down to $13M. Following up Friday.',tag:'Contract'},
      {who:'Brandon Wassel',when:'Yesterday · 4:18 PM',channel:'email',text:'Forwarded latest cap projections. Recommended pushing for void years on year 2.',tag:'Internal'},
      {who:'Topps Legal',when:'2 days ago',channel:'email',text:'Latest redline returned. Royalty floor moved to 6%. Two open items on IP territory.',tag:'Endorsement'},
      {who:'C.J. (player)',when:'3 days ago',channel:'text',text:'"Whatever gets it done before camp. Don\'t want this hanging over June."',tag:'Player'}
    ],
    schedule:[
      {date:'14 May',title:'Extension talks open · NYJ',sub:'Meeting w/ Joe Douglas · NYJ facility',tag:'Contract'},
      {date:'16 May',title:'Beats campaign call',sub:'Brand team · 30 min',tag:'Endorsement'},
      {date:'22 May',title:'Mosley Family Foundation board prep',sub:'Internal · 90 min',tag:'Philanthropy'},
      {date:'12 Jun',title:'Foundation quarterly board',sub:'Atlanta · in-person',tag:'Philanthropy'}
    ],
    notes:[
      {who:'B. Wassel',when:'Today',body:'CJ does not want this to drag past June. Push for the closing window before training camp. Counter ready.'},
      {who:'CJ Mosley',when:'2 weeks ago',body:'Re-signing in NY is priority 1. Open to a discount if structure has 2026 escalators tied to defensive snaps.'}
    ]},
  {id:'wallace',init:'W',name:'Levi Wallace',pos:'CB',team:'Atlanta',contract:'$6.5M / 2yr',contractValue:6500000,expires:'Mar 2027',career:'$22.4M',careerValue:22400000,status:'active',sub:'7-yr veteran · DB',years:7,age:30,draftRound:'UDFA',draftYear:2018,
    history:[
      {date:'May 2018',title:'UDFA signing · Buffalo',text:'3-year UDFA contract. Worked up from PS to starter in 18 months.',amt:'$1.7M',state:'completed'},
      {date:'Mar 2022',title:'Signed · Pittsburgh',text:'2-year $8M with $4M guaranteed. Starting boundary corner.',amt:'$8.0M',state:'completed'},
      {date:'Mar 2024',title:'Signed · Atlanta (1yr)',text:'Prove-it deal at $2.5M with $1.5M guaranteed.',amt:'$2.5M',state:'completed'},
      {date:'Mar 2025',title:'Re-signed · Atlanta',text:'2-year $6.5M with $3.5M guaranteed. Slot-corner role with veteran leadership designation.',amt:'$6.5M',state:'current'}
    ],
    endorsements:[
      {brand:'Athletic Brewing',value:'$85,000',term:'12-month',stage:'Contract sent'},
      {brand:'Atlanta Toyota (regional)',value:'$45,000',term:'12-month',stage:'Prospecting'},
      {brand:'Wilson Footwear',value:'$28,000',term:'Active',stage:'Active'}
    ],
    comms:[
      {who:'Athletic Brewing — Mara Lin',when:'Today · 11:15 AM',channel:'email',text:'Contract executed. Production schedule confirmed for 22-23 May in Atlanta.',tag:'Endorsement'},
      {who:'Levi (player)',when:'Yesterday',channel:'text',text:'"Need to push the Wilson appearance back two weeks — body needs the rest."',tag:'Player'},
      {who:'Trevin Jaggars',when:'4 days ago',channel:'note',text:'Toyota regional buy is moving. Sent media kit and rate card.',tag:'Internal'}
    ],
    schedule:[
      {date:'16 May',title:'Media-training session',sub:'Pre-camp prep · 90 min'},
      {date:'22 May',title:'Athletic Brewing shoot',sub:'Atlanta · 2-day production'}
    ],
    notes:[{who:'T. Jaggars',when:'1 week ago',body:'Strong fit for QSR / regional brands in ATL. Falcons connection plays well. Build local-first endorsement strategy.'}]},
  {id:'avery',init:'A',name:'Marcus Avery',pos:'WR',team:'Carolina',contract:'$985K / 3yr',contractValue:985000,expires:'Mar 2027',career:'$1.2M',careerValue:1200000,status:'pending',sub:'2024 UDFA · rising',years:2,age:24,draftRound:'UDFA',draftYear:2024,
    history:[
      {date:'May 2024',title:'UDFA signing · Carolina',text:'3-year UDFA contract. Outperformed rookie expectations — 32 catches, 4 TDs in 2024 season.',amt:'$985K',state:'completed'},
      {date:'May 2026',title:'Extension talks · Carolina',text:'Carolina open to 2-year extension. Verbal yes at $4.6M / 2yr with $2.2M guaranteed.',amt:'$4.6M',state:'current'}
    ],
    endorsements:[{brand:'Tommy John',value:'$28,000',term:'Social activation',stage:'Verbal yes'}],
    comms:[
      {who:'Carolina FO — Dan Morgan',when:'Today',channel:'email',text:'Final terms approved by ownership. Paperwork to legal Monday.',tag:'Contract'},
      {who:'Marcus (player)',when:'2 days ago',channel:'call',text:'Wants to make sure incentive structure rewards production over snaps. Drafted revised proposal.',tag:'Player'}
    ],
    schedule:[{date:'19 May',title:'Carolina sign-paper meeting',sub:'Charlotte · w/ Travis Martz'}],
    notes:[{who:'CJ Mosley',when:'3 days ago',body:'Watch the third-receiver depth chart. If they draft a WR top-3 rounds, extension math gets squeezed.'}]},
  {id:'james',init:'D',name:'Derrick James',pos:'S',team:'Chicago',contract:'$2.3M / 1yr',contractValue:2300000,expires:'Mar 2026',career:'$7.8M',careerValue:7800000,status:'fa',sub:'3rd-rd · 2nd contract',years:5,age:27,draftRound:3,draftYear:2021,
    history:[
      {date:'May 2021',title:'3rd-round pick · Chicago',text:'85th overall. Standard 4-year rookie deal.',amt:'$4.6M',state:'completed'},
      {date:'Mar 2024',title:'2nd contract · Chicago',text:'2-year $5.5M with $2.0M guaranteed.',amt:'$5.5M',state:'completed'},
      {date:'Mar 2025',title:'Re-signed · Chicago',text:'1-year prove-it deal at $2.3M after disappointing 2024 season. Heavy snap-count incentives.',amt:'$2.3M',state:'current'}
    ],
    endorsements:[],
    comms:[
      {who:'Derrick (player)',when:'Yesterday',channel:'call',text:'Discussed FA targets. Open to Dallas, Atlanta, Tennessee. Wants $5M+ AAV on a 2-year.',tag:'Player'},
      {who:'AK Mogulla',when:'3 days ago',channel:'note',text:'Pulled tape. PFF top-25 at safety over last 8 games. Marketing him as a late-bloomer in the FA tier.',tag:'Internal'}
    ],
    schedule:[{date:'28 May',title:'FA \'26 strategy session',sub:'Internal · w/ AK + CJ'}],
    notes:[{who:'AK Mogulla',when:'1 week ago',body:'Best leverage point: ATL desperate for safety help, Dallas open to 2-year vet. Build interest tour after combine.'}]},
  {id:'holloway',init:'T',name:'Trey Holloway',pos:'TE',team:'Denver',contract:'$210K / 1yr',contractValue:210000,expires:'Jan 2026',career:'$385K',careerValue:385000,status:'risk',sub:'Practice squad',years:1,age:24,draftRound:'UDFA',draftYear:2025,
    history:[{date:'Aug 2025',title:'PS signing · Denver',text:'Practice squad activation. Standard PS salary.',amt:'$210K',state:'current'}],
    endorsements:[{brand:'Crocs',value:'$12,000',term:'NIL crossover',stage:'Prospecting'}],
    comms:[
      {who:'AK Mogulla',when:'Today',channel:'note',text:'Denver waived 2 TEs in \'25 camp. Need a real conversation w/ Trey about expectations.',tag:'Internal'},
      {who:'Trey (player)',when:'4 days ago',channel:'text',text:'"Coaches said reps are coming. Trusting it."',tag:'Player'}
    ],
    schedule:[{date:'20 May',title:'Career planning · Trey',sub:'Call · 45 min'}],
    notes:[{who:'CJ Mosley',when:'Yesterday',body:'Prepare him for the alternative — PS for another team, XFL, or front-office path. Have the honest conversation.'}]},
  {id:'cole',init:'B',name:'Brennan Cole',pos:'DT',team:'Houston',contract:'$3.1M / 4yr',contractValue:3100000,expires:'Mar 2027',career:'$12.8M',careerValue:12800000,status:'active',sub:'2nd-rd · \'23',years:3,age:25,draftRound:2,draftYear:2023,
    history:[
      {date:'May 2023',title:'2nd-round pick · Houston',text:'4-year rookie deal with 5th-year option. 38th overall.',amt:'$12.8M',state:'completed'},
      {date:'May 2026',title:'Restructure · Houston',text:'Cap-relief restructure. Convert $4.2M base to signing bonus. Closing this week.',amt:'+$2.1M space',state:'current'}
    ],
    endorsements:[],
    comms:[{who:'Houston Cap — Nick Caserio',when:'2 days ago',channel:'call',text:'Restructure terms agreed. Convert $4.2M base to signing bonus.',tag:'Contract'}],
    schedule:[{date:'17 May',title:'Restructure paperwork',sub:'NDA · Houston'}],
    notes:[]},
  {id:'patterson',init:'K',name:'Kris Patterson',pos:'OL',team:'Kansas City',contract:'$795K / 3yr',contractValue:795000,expires:'Mar 2028',career:'$795K',careerValue:795000,status:'active',sub:'UDFA · \'25',years:1,age:23,draftRound:'UDFA',draftYear:2025,
    history:[{date:'May 2025',title:'UDFA signing · KC',text:'3-year UDFA. Strong camp showing as backup tackle.',amt:'$795K',state:'completed'}],
    endorsements:[],comms:[],schedule:[],notes:[]},
  {id:'ortiz',init:'R',name:'Raymond Ortiz',pos:'RB',team:'Las Vegas',contract:'$1.1M / 1yr',contractValue:1100000,expires:'Mar 2026',career:'$3.4M',careerValue:3400000,status:'fa',sub:'5th-rd · \'22',years:4,age:26,draftRound:5,draftYear:2022,
    history:[
      {date:'May 2022',title:'5th-round pick · Las Vegas',text:'4-year rookie deal at minimum tender.',amt:'$3.4M',state:'completed'},
      {date:'Mar 2025',title:'1-year · Las Vegas',text:'Vet minimum + workout bonus.',amt:'$1.1M',state:'current'}
    ],
    endorsements:[],
    comms:[{who:'Raymond (player)',when:'Yesterday',channel:'text',text:'"Three FA visits lined up. Vegas wants me back if number works."',tag:'Player'}],
    schedule:[{date:'28 May',title:'FA \'26 strategy session',sub:'Internal'}],
    notes:[]}
];

/* ===========================================================
   NEGOTIATION WORKSPACE — Mosley extension (showcase)
   =========================================================== */
const NEG_WORKSPACE = {
  playerId:'mosley',
  player:'C.J. Mosley',
  type:'Contract Extension',
  team:'New York Jets',
  stages:['Discovery','Initial Offer','Counter','Final Terms','Legal','Signed'],
  currentStage:2,
  offers:[
    {label:'Team — Opening',aav:'19.5',years:1,total:'19.5',guaranteed:'10.0',gtdPct:'51%',bonus:'5.0',cap2027:'19.5'},
    {label:'Our Counter',aav:'24.0',years:2,total:'48.0',guaranteed:'29.0',gtdPct:'60%',bonus:'12.0',cap2027:'22.0',best:true},
    {label:'Comp · Walker (DET)',aav:'21.5',years:3,total:'64.5',guaranteed:'31.0',gtdPct:'48%',bonus:'14.0',cap2027:''}
  ],
  terms:{
    base:'$10.5M/yr',
    bonus:'$12M signing',
    incentives:'$2M annual (snaps + Pro Bowl)',
    voidYears:'2 (cap mgmt)'
  },
  leverage:{
    ours:[
      'Position scarcity at MLB — top-5 PFF grade past 2 seasons',
      'NYJ defensive scheme built around his communication',
      'Player has stated desire to stay — won\'t hold out',
      'Pro Bowl in 2024 reset market value'
    ],
    theirs:[
      'NYJ has cap flexibility but FA priorities elsewhere',
      'Two younger LBs on rookie deals',
      'Age 33 — limits long-term guarantees',
      'No competing offers documented'
    ]
  }
};

/* ===========================================================
   INBOX — chat threads
   =========================================================== */
const THREADS = [
  {id:'t1',name:'Joe Douglas (NYJ GM)',avatar:'JD',unread:2,subject:'Mosley extension — counter terms',preview:'Got the package. Need a few days with ownership.',time:'9:42 AM',badges:['Contract'],playerId:'mosley',
    messages:[
      {dir:'in',who:'Joe Douglas',ts:'Yesterday · 4:18 PM',text:'Quick note before the formal counter — we\'re willing to move on year-2 structure but the guarantee number is going to be tough above $11M. Walk me through your floor.'},
      {dir:'out',who:'C.J. Mosley',ts:'Yesterday · 5:02 PM',text:'Appreciate the heads up Joe. Realistic floor for us is $13M guaranteed in year 1 with a $14M roster bonus trigger in year 2. We can talk void years to soften the cap hit on your end.'},
      {dir:'in',who:'Joe Douglas',ts:'Today · 9:42 AM',text:'Got the package. Need a few days with ownership. The void-year mechanic is interesting — let me run it past the cap team. Can we put a call together Friday morning to walk through the structure together?',attach:'Mosley-counter-v2.pdf'},
      {dir:'in',who:'Joe Douglas',ts:'Today · 9:43 AM',text:'Also — please confirm CJ is not entertaining other conversations. Want to manage this internally if so.'}
    ]},
  {id:'t2',name:'Dan Morgan (CAR GM)',avatar:'DM',unread:0,subject:'Avery — final terms approved',preview:'Ownership signed off. Paperwork to legal Monday.',time:'2 hrs ago',badges:['Contract','Closing'],playerId:'avery',
    messages:[
      {dir:'in',who:'Dan Morgan',ts:'3 days ago',text:'We\'re aligned at $4.6M/2yr with $2.2M guaranteed. Final ownership sign-off pending.'},
      {dir:'out',who:'B. Wassel',ts:'2 days ago',text:'Confirming the production-based incentive language — we want $250K per 50-catch season as a true escalator, not a void-year trick.'},
      {dir:'in',who:'Dan Morgan',ts:'Yesterday',text:'Agreed. Standard escalator language. Sending paperwork Monday.'},
      {dir:'in',who:'Dan Morgan',ts:'Today',text:'Ownership signed off. Paperwork to legal Monday. Going to need Marcus in Charlotte 19 May for the signing ceremony — small press moment.'}
    ]},
  {id:'t3',name:'Mara Lin · Athletic Brewing',avatar:'ML',unread:1,subject:'Wallace deal — execution confirmed',preview:'Production locked for 22-23 May. Need shot list.',time:'11:15 AM',badges:['Endorsement'],playerId:'wallace',
    messages:[
      {dir:'in',who:'Mara Lin',ts:'1 week ago',text:'Excited to finalize. Sending the executed agreement EOD.'},
      {dir:'out',who:'Trevin Jaggars',ts:'1 week ago',text:'Confirmed receipt. Wallace is locked for the 22-23 production window. Let\'s sync on shot list this Thursday.'},
      {dir:'in',who:'Mara Lin',ts:'Today',text:'Contract executed. Production schedule confirmed for 22-23 May in Atlanta. Need final shot list by Friday — attaching our creative deck for reference.',attach:'AB-LeviCampaign-creative.pdf'}
    ]},
  {id:'t4',name:'Nick Caserio (HOU)',avatar:'NC',unread:0,subject:'Cole restructure — converted base',preview:'Mechanics confirmed. Paper Friday.',time:'2 days ago',badges:['Contract'],playerId:'cole',
    messages:[
      {dir:'in',who:'Nick Caserio',ts:'4 days ago',text:'Need to move on Brennan\'s structure for cap purposes. Looking at converting $4.2M base to signing bonus.'},
      {dir:'out',who:'C.J. Mosley',ts:'3 days ago',text:'Open to the mechanic. We want a no-trade rider attached as the trade-off — same convention as last time.'},
      {dir:'in',who:'Nick Caserio',ts:'2 days ago',text:'Mechanics confirmed. No-trade attached. Paper Friday.'}
    ]},
  {id:'t5',name:'Topps Legal · Eric Wen',avatar:'EW',unread:1,subject:'Mosley card series — royalty redline',preview:'IP territory clause needs tightening.',time:'Yesterday',badges:['Endorsement','Legal'],playerId:'mosley',
    messages:[
      {dir:'in',who:'Eric Wen',ts:'1 week ago',text:'Latest redline attached. Royalty floor moved to 6%. Two open items on IP territory.'},
      {dir:'out',who:'Travis Martz',ts:'5 days ago',text:'6% floor accepted. On IP territory — we need carveouts for any future Mosley Foundation use. Forwarding suggested language.'},
      {dir:'in',who:'Eric Wen',ts:'Yesterday',text:'Reviewing your carveout language with our IP team. Should have a response by Wednesday.'}
    ]},
  {id:'t6',name:'C.J. Mosley',avatar:'CM',unread:0,subject:'Re: closing window',preview:'Whatever gets it done before camp.',time:'3 days ago',badges:['Player'],playerId:'mosley',
    messages:[
      {dir:'out',who:'B. Wassel',ts:'3 days ago',text:'Counter package is out. We\'re asking for $24M / 2yr with $13M guaranteed. If they push back hard on guarantees we\'ll need to discuss whether we hold or take what\'s on the table.'},
      {dir:'in',who:'C.J. Mosley',ts:'3 days ago',text:'Whatever gets it done before camp. Don\'t want this hanging over June.'}
    ]},
  {id:'t7',name:'Derrick James',avatar:'DJ',unread:0,subject:'FA \'26 — visit list',preview:'Three visits lined up.',time:'1 day ago',badges:['Player','FA'],playerId:'james',
    messages:[
      {dir:'out',who:'AK Mogulla',ts:'2 days ago',text:'FA market on safety is opening up. Three teams have asked about your availability. Want to put together a visit tour?'},
      {dir:'in',who:'Derrick James',ts:'1 day ago',text:'Yes. Open to Dallas, Atlanta, Tennessee. Want $5M+ AAV on a 2-year. Set it up.'}
    ]},
  {id:'t8',name:'Foundation · Halle Brown',avatar:'HB',unread:0,subject:'Q2 board prep — final agenda',preview:'12 Jun agenda + financials attached.',time:'4 days ago',badges:['Philanthropy'],playerId:'mosley',
    messages:[
      {dir:'in',who:'Halle Brown',ts:'4 days ago',text:'Final Q2 board agenda + financials attached. Form 990 stays on track for 15 May filing.',attach:'MFF-Q2-2026-board-pack.pdf'}
    ]}
];

/* ===========================================================
   DOCUMENTS VAULT
   =========================================================== */
const DOCS = [
  {name:'Mosley · Extension counter v2',type:'Contract',tag:'draft',size:'2.4 MB',date:'Today',ic:'C',playerId:'mosley'},
  {name:'Avery · Carolina 2-yr extension',type:'Contract',tag:'review',size:'1.8 MB',date:'Yesterday',ic:'C',playerId:'avery'},
  {name:'Wallace · Athletic Brewing master agreement',type:'Endorsement',tag:'signed',size:'612 KB',date:'2 days ago',ic:'E',playerId:'wallace'},
  {name:'Cole · Houston restructure addendum',type:'Contract',tag:'review',size:'440 KB',date:'2 days ago',ic:'C',playerId:'cole'},
  {name:'Topps · Mosley royalty agreement (redline v3)',type:'Endorsement',tag:'review',size:'1.1 MB',date:'4 days ago',ic:'E',playerId:'mosley'},
  {name:'Mosley Family Foundation · 2025 Form 990',type:'Tax',tag:'draft',size:'3.2 MB',date:'1 week ago',ic:'F',playerId:'mosley'},
  {name:'Wallace · Wilson Footwear agreement',type:'Endorsement',tag:'signed',size:'380 KB',date:'2 weeks ago',ic:'E',playerId:'wallace'},
  {name:'NFLPA · Annual agent certification',type:'Compliance',tag:'signed',size:'215 KB',date:'1 month ago',ic:'L'},
  {name:'James · FA \'26 marketing one-pager',type:'Marketing',tag:'draft',size:'1.6 MB',date:'3 days ago',ic:'M',playerId:'james'},
  {name:'Holloway · Career-transition plan',type:'Strategy',tag:'draft',size:'320 KB',date:'Today',ic:'S',playerId:'holloway'},
  {name:'Mosley · 2024 W-2 (employer copy)',type:'Tax',tag:'signed',size:'88 KB',date:'2 months ago',ic:'F',playerId:'mosley'},
  {name:'Avery · NIL portfolio (rollover)',type:'Marketing',tag:'signed',size:'2.8 MB',date:'1 year ago',ic:'M',playerId:'avery'}
];

/* ===========================================================
   FOUNDATION
   =========================================================== */
const FOUNDATIONS = [
  {name:'Mosley Family Foundation',player:'C.J. Mosley',est:2017,raised:'$2.4M',served:'14,200',programs:6,
    programList:[
      {name:'Mosley Mentorship Initiative',sub:'East NY · year-round',raised:847000,goal:1000000},
      {name:'Back-to-School Drive',sub:'2026 cycle · Aug launch',raised:248000,goal:500000},
      {name:'College Access Scholarships',sub:'12 awards / year',raised:560000,goal:600000},
      {name:'Mosley Family Field Day',sub:'Annual · Sept',raised:165000,goal:200000}
    ],
    docs:['2025 Form 990','Q2 2026 board pack','5-year impact report']
  },
  {name:'Levi Wallace Charitable Trust',player:'Levi Wallace',est:2022,raised:'$385K',served:'1,840',programs:2,
    programList:[
      {name:'CB Camp · ATL youth football',sub:'Annual · June',raised:142000,goal:200000},
      {name:'Wallace Mentorship Stipend',sub:'8 scholarships / year',raised:88000,goal:120000}
    ],
    docs:['2025 Form 990','Annual report']
  }
];

/* ===========================================================
   MEDIA TRAINING
   =========================================================== */
const TRAINING = [
  {playerId:'mosley',name:'C.J. Mosley',pos:'LB · NY Jets',init:'M',status:'ready',progress:100,modules:[
    {label:'Press conference framework',done:true},
    {label:'Crisis comms protocol',done:true},
    {label:'Podcast long-form prep',done:true},
    {label:'Social platform strategy',done:true}
  ]},
  {playerId:'wallace',name:'Levi Wallace',pos:'CB · Atlanta',init:'W',status:'progress',progress:72,modules:[
    {label:'Locker room interview basics',done:true},
    {label:'Crisis comms protocol',done:true},
    {label:'Podcast long-form prep',done:true},
    {label:'Pre-camp brand alignment',done:false},
    {label:'2026 NFL Network feature prep',done:false}
  ]},
  {playerId:'avery',name:'Marcus Avery',pos:'WR · Carolina',init:'A',status:'progress',progress:45,modules:[
    {label:'Locker room interview basics',done:true},
    {label:'Social platform strategy',done:true},
    {label:'Press conference framework',done:false},
    {label:'Crisis comms protocol',done:false}
  ]},
  {playerId:'patterson',name:'Kris Patterson',pos:'OL · Kansas City',init:'K',status:'scheduled',progress:0,modules:[
    {label:'Onboarding · agency expectations',done:false},
    {label:'Locker room interview basics',done:false},
    {label:'Social platform strategy',done:false}
  ]},
  {playerId:'james',name:'Derrick James',pos:'S · Chicago (FA)',init:'D',status:'progress',progress:60,modules:[
    {label:'FA visit talking points',done:true},
    {label:'Combine media prep',done:true},
    {label:'Press conference framework',done:false},
    {label:'Crisis comms protocol',done:true},
    {label:'Social platform strategy',done:false}
  ]},
  {playerId:'holloway',name:'Trey Holloway',pos:'TE · Denver (PS)',init:'T',status:'scheduled',progress:10,modules:[
    {label:'Onboarding · agency expectations',done:true},
    {label:'Locker room interview basics',done:false},
    {label:'Career-transition coaching',done:false}
  ]}
];

/* ===========================================================
   FINANCIALS — deeper breakdown
   =========================================================== */
const FINANCIALS = {
  revenue:{
    sources:[
      {l:'Contract commissions (closed)',v:1420000},
      {l:'Endorsement commissions (active)',v:508000},
      {l:'Appearance fees & speaking',v:215000},
      {l:'Royalties (Topps, MFF licensing)',v:38000}
    ],
    total:2181000
  },
  expenses:[
    {l:'Compensation (12 staff)',v:1180000},
    {l:'Travel & client services',v:182000},
    {l:'Legal & compliance',v:64000},
    {l:'Marketing & brand',v:48000},
    {l:'Software & operations',v:42000},
    {l:'Office (ATL + NY)',v:128000}
  ],
  ar:[
    {team:'Carolina Panthers',sub:'Avery rookie commission',amt:48000,age:'0-30 days'},
    {team:'Athletic Brewing',sub:'Wallace endorsement booking',amt:8500,age:'0-30 days'},
    {team:'Topps',sub:'Mosley royalty Q1',amt:127500,age:'31-60 days'}
  ]
};

/* ===========================================================
   PIPELINES & LISTS
   =========================================================== */
const RECRUITS = {
  sourced:[
    {id:'r1',name:'D. Foster',sub:'DB · Florida · Sr.'},
    {id:'r2',name:'M. Trent',sub:'WR · Tennessee · Jr.'},
    {id:'r3',name:'K. Robinson',sub:'TE · Auburn · Sr.'},
    {id:'r4',name:'L. Webb',sub:'EDGE · Oklahoma · Sr.'},
    {id:'r5',name:'J. Marcus',sub:'QB · Miami · Sr.'}
  ],
  contacted:[
    {id:'r6',name:'J. Mills',sub:'EDGE · Georgia · Sr.'},
    {id:'r7',name:'A. Bryant',sub:'LB · LSU · Sr.'},
    {id:'r8',name:'S. Lopez',sub:'QB · Texas · Sr.'}
  ],
  visited:[
    {id:'r9',name:'C. Hayes',sub:'RB · USC · Sr.'},
    {id:'r10',name:'D. Kim',sub:'OL · Bama · Sr.'}
  ],
  verbal:[
    {id:'r11',name:'B. Carter',sub:'DB · Auburn · Sr.'},
    {id:'r12',name:'T. Ward',sub:'WR · Ohio State · Sr.'},
    {id:'r13',name:'R. Aoki',sub:'S · Stanford · Sr.'}
  ],
  signed:[
    {id:'r14',name:'M. Avery',sub:'WR · client since \'24'},
    {id:'r15',name:'K. Patterson',sub:'OL · client since \'25'},
    {id:'r16',name:'B. Cole',sub:'DT · client since \'23'},
    {id:'r17',name:'T. Holloway',sub:'TE · client since \'25'}
  ]
};

const ENDOS = [
  {brand:'Athletic Brewing',player:'Levi Wallace · 12-mo deal',value:'$85,000',stage:'sent',stageLabel:'Contract sent',progress:85},
  {brand:'Beats by Dre',player:'Mosley · campaign add-on',value:'$140,000',stage:'negotiating',stageLabel:'Negotiating',progress:60},
  {brand:'Tommy John',player:'Avery · social activation',value:'$28,000',stage:'sent',stageLabel:'Verbal yes',progress:75},
  {brand:'Atlanta Toyota',player:'Wallace · regional buy',value:'$45,000',stage:'prospecting',stageLabel:'Prospecting',progress:25},
  {brand:'Topps',player:'Mosley · trading card series',value:'Royalty',stage:'legal',stageLabel:'Legal review',progress:70},
  {brand:'Crocs',player:'Holloway · NIL crossover',value:'$12,000',stage:'prospecting',stageLabel:'Prospecting',progress:15}
];

const NEGOTIATIONS = [
  {nm:'C.J. Mosley · Extension',sub:'NY Jets · stage: opening offer exchanged',amt:'$24M / 2yr',stage:'negotiating',playerId:'mosley'},
  {nm:'Derrick James · UFA',sub:'Multi-team · 4 offers received, in vetting',amt:'$18M target',stage:'closing',playerId:'james'},
  {nm:'Marcus Avery · Extension',sub:'Carolina · counter prepared',amt:'$4.6M / 2yr',stage:'closing',playerId:'avery'},
  {nm:'Brennan Cole · Restructure',sub:'Houston · cap relief — closing this week',amt:'+$2.1M space',stage:'closing',playerId:'cole'},
  {nm:'Raymond Ortiz · UFA',sub:'3 visits scheduled',amt:'$3.5M target',stage:'negotiating',playerId:'ortiz'}
];

const CALENDAR = [
  {d:14,m:4,year:2026,ttl:'Mosley · extension talks open',sub:'NYJ · meeting w/ Joe Douglas',tag:'Contract',cat:'contract'},
  {d:16,m:4,year:2026,ttl:'Wallace · media-training session',sub:'Pre-camp prep · 90 min',tag:'Media',cat:'media'},
  {d:17,m:4,year:2026,ttl:'Cole restructure paperwork',sub:'Houston · w/ Travis Martz',tag:'Contract',cat:'contract'},
  {d:19,m:4,year:2026,ttl:'Avery sign-paper meeting',sub:'Charlotte · final extension',tag:'Contract',cat:'contract'},
  {d:20,m:4,year:2026,ttl:'Holloway career planning',sub:'Call · 45 min',tag:'Internal',cat:'internal'},
  {d:22,m:4,year:2026,ttl:'Athletic Brewing shoot',sub:'Atlanta · 2-day production',tag:'Endorsement',cat:'endorsement'},
  {d:23,m:4,year:2026,ttl:'Athletic Brewing shoot · day 2',sub:'Atlanta',tag:'Endorsement',cat:'endorsement'},
  {d:28,m:4,year:2026,ttl:'FA \'26 strategy session',sub:'James, Ortiz, +1 TBD',tag:'Internal',cat:'internal'},
  {d:3,m:5,year:2026,ttl:'Recruit visit — Tuscaloosa',sub:'3 prospects · DB / WR / TE',tag:'Recruiting',cat:'recruiting'},
  {d:5,m:5,year:2026,ttl:'NFLPA cert renewal deadline',sub:'Compliance · automatic if filed',tag:'Internal',cat:'internal'},
  {d:12,m:5,year:2026,ttl:'Mosley Foundation board',sub:'Quarterly · Atlanta',tag:'Philanthropy',cat:'philanthropy'},
  {d:18,m:5,year:2026,ttl:'Combine prep · James',sub:'Atlanta · w/ AK',tag:'Media',cat:'media'},
  {d:25,m:5,year:2026,ttl:'Wallace · Wilson appearance',sub:'Charlotte (rescheduled)',tag:'Endorsement',cat:'endorsement'}
];

const ALERTS = [
  {dot:'r',title:'Holloway · 53-man cut risk',text:'Denver waived 2 TEs in \'25 camp. Practice-squad alternative drafted, ready for player conversation.',meta:'Urgent · today',cat:'urgent',playerId:'holloway'},
  {dot:'',title:'Mosley extension · counter due',text:'NYJ FO returned with $19.5M / 1yr. Below target. Counter at $24M / 2yr w/ 60% guarantees drafted.',meta:'Action · 3 days',cat:'urgent',playerId:'mosley'},
  {dot:'g',title:'Avery extension · verbal yes',text:'Carolina FO accepted core terms. Final paper through legal Monday.',meta:'Good news · today',cat:'info',playerId:'avery'},
  {dot:'',title:'FA \'26 — start cap modeling',text:'James, Ortiz, +1 TBD. Need projections by 28 May.',meta:'Reminder · 14 days',cat:'info'},
  {dot:'',title:'Foundation 501(c)(3) annual filing',text:'Mosley Family Foundation · Form 990 due 15 May. Counsel coordinating.',meta:'Compliance · 4 days',cat:'info',playerId:'mosley'}
];

const CHART_DATA = {
  quarterly:[{l:'Q1 25',v:8.2},{l:'Q2 25',v:12.4},{l:'Q3 25',v:18.1},{l:'Q4 25',v:24.6},{l:'Q1 26',v:32.1}],
  annual:[{l:'2022',v:18.4},{l:'2023',v:24.6},{l:'2024',v:48.2},{l:'2025',v:63.3},{l:'YTD 26',v:32.1}],
  trailing:[{l:'Jun',v:14.2},{l:'Jul',v:16.8},{l:'Aug',v:18.4},{l:'Sep',v:21.0},{l:'Oct',v:24.1},{l:'Nov',v:27.6},{l:'Dec',v:32.4},{l:'Jan',v:35.8},{l:'Feb',v:42.1},{l:'Mar',v:55.4},{l:'Apr',v:71.2},{l:'May',v:87.4}]
};

const STATUS_BADGES = {
  active:{cls:'b-active',label:'Active'},
  pending:{cls:'b-ext',label:'Ext. open'},
  fa:{cls:'b-fa',label:'FA \'26'},
  risk:{cls:'b-risk',label:'53 watch'}
};

const TITLES = {
  overview:'Welcome back, <span class="it">C.J.</span>',
  roster:'Client <span class="it">roster</span>',
  contracts:'Contracts <span class="it">& negotiations</span>',
  endorsements:'Endorsements <span class="it">& brand</span>',
  recruiting:'Recruiting <span class="it">pipeline</span>',
  inbox:'Communications <span class="it">inbox</span>',
  calendar:'Operations <span class="it">calendar</span>',
  documents:'Document <span class="it">vault</span>',
  foundation:'Foundations <span class="it">& philanthropy</span>',
  training:'Media <span class="it">training</span>',
  financials:'Agency <span class="it">financials</span>',
  alerts:'Alerts <span class="it">& flags</span>'
};

/* ===========================================================
   AUTH
   =========================================================== */
document.getElementById('loginForm').onsubmit = e => {
  e.preventDefault();
  document.getElementById('login').style.display = 'none';
  document.getElementById('dash').classList.add('on');
  setTimeout(() => toast('Welcome back, C.J. — 5 alerts need your attention'), 400);
};

/* ===========================================================
   PANE ROUTING
   =========================================================== */
function showPane(p){
  document.querySelectorAll('.navlink').forEach(n => n.classList.toggle('active', n.dataset.p === p));
  document.querySelectorAll('.pane').forEach(pn => pn.classList.toggle('active', pn.dataset.p === p));
  document.getElementById('paneTitle').innerHTML = TITLES[p] || 'Dashboard';
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.navlink').forEach(n => n.addEventListener('click', () => showPane(n.dataset.p)));

/* ===========================================================
   ROSTER
   =========================================================== */
let rosterSort = {col:'name',dir:'asc'};
let rosterFilter = 'all';

function renderRoster(){
  const tbody = document.getElementById('rosterTable');
  if(!tbody) return;
  let rows = PLAYERS.filter(p => rosterFilter === 'all' || p.status === rosterFilter);
  rows.sort((a,b) => {
    let av = a[rosterSort.col], bv = b[rosterSort.col];
    if(rosterSort.col === 'contract'){av = a.contractValue; bv = b.contractValue}
    if(rosterSort.col === 'career'){av = a.careerValue; bv = b.careerValue}
    if(typeof av === 'string'){av = av.toLowerCase(); bv = bv.toLowerCase()}
    return (av < bv ? -1 : av > bv ? 1 : 0) * (rosterSort.dir === 'asc' ? 1 : -1);
  });
  tbody.innerHTML = rows.map(p => {
    const b = STATUS_BADGES[p.status];
    return `<tr onclick="openDrawer('${p.id}')">
      <td><div class="player-cell"><div class="p-av">${p.init}</div><div><div class="p-nm">${p.name}</div><div class="p-sub">${p.sub}</div></div></div></td>
      <td>${p.pos}</td><td>${p.team}</td><td>${p.contract}</td><td>${p.career}</td>
      <td><span class="badge ${b.cls}">${b.label}</span></td>
    </tr>`;
  }).join('') || '<tr><td colspan="6" class="empty-state">No players match this filter</td></tr>';

  document.querySelectorAll('[data-count]').forEach(el => {
    const f = el.dataset.count;
    el.textContent = f === 'all' ? PLAYERS.length : PLAYERS.filter(p => p.status === f).length;
  });
}

function renderOverviewRoster(){
  const tbody = document.getElementById('overviewRoster');
  if(!tbody) return;
  tbody.innerHTML = PLAYERS.slice(0,5).map(p => {
    const b = STATUS_BADGES[p.status];
    return `<tr onclick="openDrawer('${p.id}')">
      <td><div class="player-cell"><div class="p-av">${p.init}</div><div><div class="p-nm">${p.name}</div><div class="p-sub">${p.sub}</div></div></div></td>
      <td>${p.pos}</td><td>${p.team}</td><td>${p.contract}</td><td>${p.expires}</td>
      <td><span class="badge ${b.cls}">${b.label}</span></td>
    </tr>`;
  }).join('');
}

document.getElementById('rosterFilters')?.addEventListener('click', e => {
  if(!e.target.matches('.pill')) return;
  document.querySelectorAll('#rosterFilters .pill').forEach(p => p.classList.remove('on'));
  e.target.classList.add('on');
  rosterFilter = e.target.dataset.filter;
  renderRoster();
});

document.querySelectorAll('.tbl th[data-sort]').forEach(th => {
  th.addEventListener('click', () => {
    const col = th.dataset.sort;
    if(rosterSort.col === col) rosterSort.dir = rosterSort.dir === 'asc' ? 'desc' : 'asc';
    else{rosterSort.col = col; rosterSort.dir = 'asc'}
    th.parentElement.querySelectorAll('th').forEach(h => h.classList.remove('sorted','asc','desc'));
    th.classList.add('sorted', rosterSort.dir);
    renderRoster(); renderOverviewRoster();
  });
});

/* ===========================================================
   DRAWER
   =========================================================== */
let currentPlayer = null;
const drawerBg = document.getElementById('drawerBg');
const drawer = document.getElementById('drawer');

function openDrawer(id){
  const p = PLAYERS.find(x => x.id === id);
  if(!p) return;
  currentPlayer = p;
  document.getElementById('drAv').textContent = p.init;
  document.getElementById('drName').textContent = p.name;
  document.getElementById('drMeta').innerHTML = `
    <span>${p.pos} · ${p.team}</span>
    <span class="dotx"></span><span>Age ${p.age}</span>
    <span class="dotx"></span><span>${p.years}-yr veteran</span>
    <span class="dotx"></span><span>${p.draftRound === 'UDFA' ? 'UDFA ' + p.draftYear : 'Rd ' + p.draftRound + ' · ' + p.draftYear}</span>`;
  document.getElementById('drStats').innerHTML = `
    <div class="dr-stat"><div class="lab">Current</div><div class="vl">${p.contract}</div></div>
    <div class="dr-stat"><div class="lab">Career</div><div class="vl">${p.career}</div></div>
    <div class="dr-stat"><div class="lab">Status</div><div class="vl">${STATUS_BADGES[p.status].label}</div></div>`;

  // OVERVIEW
  const nextEvent = p.schedule[0];
  const openItems = [];
  const currentH = p.history.find(h => h.state === 'current');
  if(currentH) openItems.push({t:'Active negotiation',s:currentH.title,v:currentH.amt});
  p.endorsements.filter(e => e.stage !== 'Active').forEach(e => openItems.push({t:e.brand,s:e.stage,v:e.value}));
  document.getElementById('sOverview').innerHTML = `
    <h4>Open <span class="it">items</span></h4>
    <div class="dr-list">
      ${openItems.length ? openItems.map(o => `<div class="dr-list-item"><div class="dli-info"><div class="t">${o.t}</div><div class="s">${o.s}</div></div><div class="dli-right"><div class="v">${o.v}</div></div></div>`).join('') : '<div class="empty-state">No open items</div>'}
    </div>
    <h4 style="margin-top:28px">Next <span class="it">on calendar</span></h4>
    ${nextEvent ? `<div class="cal-item" style="cursor:default;padding:14px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)"><div class="cal-date"><div class="d">${nextEvent.date.split(' ')[0]}</div><div class="m">${nextEvent.date.split(' ')[1] || ''}</div></div><div class="cal-info"><div class="ttl">${nextEvent.title}</div><div class="sub">${nextEvent.sub}</div>${nextEvent.tag ? `<div class="tag">${nextEvent.tag}</div>` : ''}</div></div>` : '<div class="empty-state">Nothing scheduled</div>'}
    <h4 style="margin-top:28px">Recent <span class="it">activity</span></h4>
    ${p.comms.slice(0,2).map(c => renderComm(c)).join('') || '<div class="empty-state">No recent activity</div>'}`;

  document.getElementById('sContracts').innerHTML = `
    <h4>Contract <span class="it">history</span></h4>
    <div class="timeline">
      ${p.history.map(h => `<div class="tl-item ${h.state}">
        <div class="tl-date">${h.date}</div>
        <div class="tl-title">${h.title}</div>
        <div class="tl-text">${h.text}</div>
        <div class="tl-amt">${h.amt}</div>
      </div>`).join('')}
    </div>
    ${currentH ? `<button class="btn btn-line btn-full" style="margin-top:8px" onclick="closeDrawer();showPane('contracts')">Open negotiation workspace →</button>` : ''}`;

  document.getElementById('sEndorsements').innerHTML = `
    <h4>Brand <span class="it">deals</span></h4>
    <div class="dr-list">
      ${p.endorsements.length ? p.endorsements.map(e => `<div class="dr-list-item"><div class="dli-info"><div class="t">${e.brand}</div><div class="s">${e.term} · ${e.stage}</div></div><div class="dli-right"><div class="v">${e.value}</div></div></div>`).join('') : '<div class="empty-state">No endorsement deals yet — pipeline open</div>'}
    </div>`;

  // pull threads tied to this player
  const playerThreads = THREADS.filter(t => t.playerId === p.id);
  document.getElementById('sComms').innerHTML = `
    <h4>Communications <span class="it">log</span></h4>
    ${p.comms.length ? p.comms.map(c => renderComm(c)).join('') : '<div class="empty-state">No recent communications logged</div>'}
    ${playerThreads.length ? `
      <h4 style="margin-top:28px">Active <span class="it">threads</span></h4>
      ${playerThreads.map(t => `<div class="comm" style="cursor:pointer" onclick="closeDrawer();showPane('inbox');setTimeout(()=>openThread('${t.id}'),100)"><div class="comm-icon">${t.avatar}</div><div class="comm-body"><div class="comm-head"><div class="who">${t.name}</div><div class="when">${t.time}</div></div><div class="comm-text">${t.subject}</div><div class="comm-tag">${t.badges.join(' · ')}</div></div></div>`).join('')}` : ''}
    <button class="btn btn-line btn-full" style="margin-top:16px" onclick="openModal('call','${p.id}')">+ Log new communication</button>`;

  document.getElementById('sCalendar').innerHTML = `
    <h4>Upcoming <span class="it">schedule</span></h4>
    ${p.schedule.length ? p.schedule.map(s => `<div class="cal-item" style="cursor:default"><div class="cal-date"><div class="d">${s.date.split(' ')[0]}</div><div class="m">${s.date.split(' ')[1] || ''}</div></div><div class="cal-info"><div class="ttl">${s.title}</div><div class="sub">${s.sub}</div>${s.tag ? `<div class="tag">${s.tag}</div>` : ''}</div></div>`).join('') : '<div class="empty-state">Nothing scheduled</div>'}`;

  document.getElementById('sNotes').innerHTML = `
    <h4>Internal <span class="it">notes</span></h4>
    ${p.notes.length ? p.notes.map(n => `<div class="note"><div class="nh"><div class="who">${n.who}</div><div class="when">${n.when}</div></div><div class="nb">${n.body}</div></div>`).join('') : '<div class="empty-state">No internal notes yet</div>'}
    <button class="btn btn-line btn-full" style="margin-top:16px" onclick="openModal('note','${p.id}')">+ Add note</button>`;

  // documents tied to this player
  const playerDocs = DOCS.filter(d => d.playerId === p.id);
  document.getElementById('sDocs').innerHTML = `
    <h4>Documents <span class="it">vault</span></h4>
    ${playerDocs.length ? `<div class="docs-list" style="padding:0">${playerDocs.map(d => `<div class="doc-row" onclick="toast('Opening ${d.name}…')"><div class="di">${d.ic}</div><div class="dn"><div class="nm">${d.name}</div><div class="meta">${d.type} · ${d.size}</div></div><div class="dt">${d.date}</div></div>`).join('')}</div>` : '<div class="empty-state">No documents on file</div>'}
    <button class="btn btn-line btn-full" style="margin-top:16px" onclick="closeDrawer();showPane('documents')">View full vault →</button>`;

  document.querySelectorAll('.dr-tab').forEach(t => t.classList.toggle('on', t.dataset.t === 'overview'));
  document.querySelectorAll('.dr-section').forEach(s => s.classList.toggle('on', s.dataset.s === 'overview'));

  drawerBg.classList.add('on');
  drawer.classList.add('on');
}

function renderComm(c){
  const icons = {
    call:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    email:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    text:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    note:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
  };
  return `<div class="comm"><div class="comm-icon">${icons[c.channel] || icons.note}</div><div class="comm-body"><div class="comm-head"><div class="who">${c.who}</div><div class="when">${c.when}</div></div><div class="comm-text">${c.text}</div><div class="comm-tag">${c.tag}</div></div></div>`;
}

function closeDrawer(){drawerBg.classList.remove('on'); drawer.classList.remove('on'); currentPlayer = null}
document.getElementById('drClose').onclick = closeDrawer;
drawerBg.onclick = closeDrawer;
document.addEventListener('keydown', e => {if(e.key === 'Escape'){closeDrawer(); closeModal(); closeQuickMenu()}});

document.querySelectorAll('.dr-tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.dr-tab').forEach(x => x.classList.remove('on'));
    document.querySelectorAll('.dr-section').forEach(x => x.classList.remove('on'));
    t.classList.add('on');
    document.querySelector(`.dr-section[data-s="${t.dataset.t}"]`).classList.add('on');
  });
});

/* ===========================================================
   CHART
   =========================================================== */
let activeChart = 'quarterly';
function renderChart(){
  const data = CHART_DATA[activeChart];
  const svg = document.getElementById('lineChart');
  const w = 600, h = 240, pad = {t:30,r:30,b:36,l:50};
  const max = Math.max(...data.map(d => d.v)) * 1.1;
  const xStep = (w - pad.l - pad.r) / (data.length - 1);
  const points = data.map((d,i) => ({
    x: pad.l + i * xStep,
    y: h - pad.b - (d.v / max) * (h - pad.t - pad.b),
    v: d.v, l: d.l
  }));
  const linePath = 'M' + points.map(p => `${p.x},${p.y}`).join(' L');
  const areaPath = linePath + ` L${points[points.length-1].x},${h-pad.b} L${points[0].x},${h-pad.b} Z`;

  const yLabels = [0, max/2, max].map(v => {
    const y = h - pad.b - (v / max) * (h - pad.t - pad.b);
    return `<line x1="${pad.l}" y1="${y}" x2="${w-pad.r}" y2="${y}" class="grid-line"/><text x="${pad.l-8}" y="${y+4}" text-anchor="end" class="chart-y-label">$${v.toFixed(0)}M</text>`;
  }).join('');

  const xLabels = points.map(p => `<text x="${p.x}" y="${h-pad.b+18}" text-anchor="middle" class="chart-label">${p.l}</text>`).join('');
  const dots = points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="5" class="chart-dot" data-v="${p.v}" data-l="${p.l}"/>`).join('');

  svg.innerHTML = `
    <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b89968" stop-opacity=".25"/><stop offset="100%" stop-color="#b89968" stop-opacity="0"/></linearGradient></defs>
    ${yLabels}
    <line x1="${pad.l}" y1="${h-pad.b}" x2="${w-pad.r}" y2="${h-pad.b}" class="axis-line"/>
    <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${h-pad.b}" class="axis-line"/>
    <path d="${areaPath}" class="chart-area"/>
    <path d="${linePath}" class="chart-line"/>
    ${dots}${xLabels}`;

  const tip = document.getElementById('chartTip');
  svg.querySelectorAll('.chart-dot').forEach(c => {
    c.addEventListener('mouseenter', () => {
      const rect = document.getElementById('chartContainer').getBoundingClientRect();
      const cr = c.getBoundingClientRect();
      tip.innerHTML = `<div style="font-size:10px;color:var(--muted);letter-spacing:.18em;text-transform:uppercase">${c.dataset.l}</div><span class="tt-val">$${c.dataset.v}M</span>`;
      tip.style.display = 'block';
      tip.style.left = (cr.left - rect.left + 10) + 'px';
      tip.style.top = (cr.top - rect.top - 50) + 'px';
    });
    c.addEventListener('mouseleave', () => tip.style.display = 'none');
  });
}

document.querySelectorAll('[data-chart]').forEach(p => {
  p.addEventListener('click', () => {
    document.querySelectorAll('[data-chart]').forEach(x => x.classList.remove('on'));
    p.classList.add('on');
    activeChart = p.dataset.chart;
    renderChart();
  });
});

/* ===========================================================
   PIPELINES
   =========================================================== */
function renderNegotiations(){
  document.getElementById('negotiations').innerHTML = NEGOTIATIONS.map(n => {
    const click = n.playerId ? `onclick="openDrawer('${n.playerId}')"` : '';
    return `<div class="pipe-row" ${click}><div><div class="nm">${n.nm}<small>${n.sub}</small></div></div><div class="amt">${n.amt}<small>${n.stage}</small></div></div>`;
  }).join('');
}

function renderEndorsements(filter='all'){
  const filtered = filter === 'all' ? ENDOS : ENDOS.filter(e => e.stage === filter);
  document.getElementById('endoGrid').innerHTML = filtered.map(e => `
    <div class="endo">
      <div class="brand-nm">${e.brand}</div>
      <div class="player">${e.player}</div>
      <div class="value">${e.value}</div>
      <div class="stage"><span class="pip"></span>${e.stageLabel}</div>
      <div class="endo-progress"><div class="fill" style="width:${e.progress}%"></div></div>
    </div>`).join('') || '<div class="empty-state" style="grid-column:1/-1">No deals in this stage</div>';
}

document.getElementById('endoFilters')?.addEventListener('click', e => {
  if(!e.target.matches('.pill')) return;
  document.querySelectorAll('#endoFilters .pill').forEach(p => p.classList.remove('on'));
  e.target.classList.add('on');
  renderEndorsements(e.target.dataset.stage);
});

function renderCalList(target, limit){
  const items = limit ? CALENDAR.slice(0, limit) : CALENDAR;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById(target).innerHTML = items.map(c =>
    `<div class="cal-item"><div class="cal-date"><div class="d">${String(c.d).padStart(2,'0')}</div><div class="m">${months[c.m]}</div></div><div class="cal-info"><div class="ttl">${c.ttl}</div><div class="sub">${c.sub}</div><div class="tag">${c.tag}</div></div></div>`
  ).join('');
}

function renderAlerts(cat='all'){
  const items = cat === 'all' ? ALERTS : ALERTS.filter(a => a.cat === cat);
  document.getElementById('alertList').innerHTML = items.map(a => `
    <div class="alert" ${a.playerId ? `onclick="openDrawer('${a.playerId}')"` : ''}>
      <div class="a-dot ${a.dot}"></div>
      <div class="a-info"><div class="at">${a.title}</div><div class="as">${a.text}</div><div class="am">${a.meta}</div></div>
    </div>`).join('') || '<div class="empty-state">No alerts in this category</div>';
}

document.querySelectorAll('[data-alert]').forEach(p => {
  p.addEventListener('click', () => {
    document.querySelectorAll('[data-alert]').forEach(x => x.classList.remove('on'));
    p.classList.add('on');
    renderAlerts(p.dataset.alert);
  });
});

/* ===========================================================
   RECRUITING FUNNEL
   =========================================================== */
const STAGE_LABELS = {sourced:'Sourced',contacted:'Contacted',visited:'Visited',verbal:'Verbal',signed:'Signed'};
function renderFunnel(){
  const el = document.getElementById('funnel');
  el.innerHTML = Object.entries(RECRUITS).map(([stage, list]) => `
    <div class="stage-col" data-stage="${stage}">
      <h5>${STAGE_LABELS[stage]} <span class="ct">${list.length}</span></h5>
      ${list.map(r => `<div class="recruit" draggable="true" data-id="${r.id}" data-stage="${stage}"><div class="rn">${r.name}</div><div class="rsub">${r.sub}</div></div>`).join('')}
    </div>`).join('');

  let dragId = null, dragFrom = null;
  el.querySelectorAll('.recruit').forEach(card => {
    card.addEventListener('dragstart', e => {
      dragId = card.dataset.id; dragFrom = card.dataset.stage;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      el.querySelectorAll('.stage-col').forEach(c => c.classList.remove('drag-over'));
    });
  });
  el.querySelectorAll('.stage-col').forEach(col => {
    col.addEventListener('dragover', e => {e.preventDefault(); col.classList.add('drag-over')});
    col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
    col.addEventListener('drop', e => {
      e.preventDefault();
      const toStage = col.dataset.stage;
      if(toStage === dragFrom) return;
      const idx = RECRUITS[dragFrom].findIndex(r => r.id === dragId);
      if(idx < 0) return;
      const moved = RECRUITS[dragFrom].splice(idx, 1)[0];
      RECRUITS[toStage].push(moved);
      toast(`${moved.name} → ${STAGE_LABELS[toStage]}`);
      renderFunnel();
    });
  });
}

/* ===========================================================
   INBOX (CHAT)
   =========================================================== */
let activeThreadId = THREADS[0].id;
let threadSearchQ = '';

function renderInboxList(){
  const q = threadSearchQ.toLowerCase();
  const filtered = THREADS.filter(t =>
    !q || t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.preview.toLowerCase().includes(q)
  );
  const list = document.getElementById('threadList');
  if(!list) return;
  list.innerHTML = filtered.map(t => `
    <div class="thread ${t.id === activeThreadId ? 'active' : ''} ${t.unread > 0 ? 'unread' : ''}" data-id="${t.id}">
      <div class="th-av">${t.avatar}</div>
      <div class="th-content">
        <div class="th-head"><div class="th-name">${t.name}</div><div class="th-time">${t.time}</div></div>
        <div class="th-subj">${t.subject}</div>
        <div class="th-preview">${t.preview}</div>
        <div class="th-badges">${t.badges.map(b => `<span class="th-badge">${b}</span>`).join('')}</div>
      </div>
      ${t.unread > 0 ? '<div class="th-unread-dot"></div>' : ''}
    </div>`).join('') || '<div class="empty-state">No threads match</div>';

  list.querySelectorAll('.thread').forEach(el => {
    el.addEventListener('click', () => openThread(el.dataset.id));
  });

  // total unread count for sidebar
  const totalUnread = THREADS.reduce((s, t) => s + t.unread, 0);
  const inboxCt = document.getElementById('inboxCount');
  if(inboxCt){
    inboxCt.textContent = totalUnread;
    inboxCt.classList.toggle('urgent', totalUnread > 0);
    inboxCt.style.display = totalUnread > 0 ? '' : 'none';
  }
}

function openThread(id){
  const t = THREADS.find(x => x.id === id);
  if(!t) return;
  activeThreadId = id;
  t.unread = 0;
  renderInboxList();

  const view = document.getElementById('threadView');
  view.innerHTML = `
    <div class="inbox-thread-head">
      <div class="it-subj">${t.subject}</div>
      <div class="it-meta">
        <span><b style="color:#fff">${t.name}</b></span>
        <span class="dotx"></span>
        <span>${t.badges.join(' · ')}</span>
        ${t.playerId ? `<span class="dotx"></span><span class="link" onclick="openDrawer('${t.playerId}')">View player →</span>` : ''}
      </div>
    </div>
    <div class="inbox-msgs" id="msgList">
      ${t.messages.map(m => `<div class="msg ${m.dir === 'out' ? 'out' : ''}">
        <div class="m-av">${m.dir === 'out' ? 'CJ' : t.avatar}</div>
        <div class="m-body">
          <div class="m-head"><span class="who">${m.who}</span><span>${m.ts}</span></div>
          <div class="m-bubble">${m.text}</div>
          ${m.attach ? `<div class="m-attach" onclick="toast('Opening ${m.attach}…')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>${m.attach}</div>` : ''}
        </div>
      </div>`).join('')}
    </div>
    <div class="inbox-compose">
      <button class="ib-btn" onclick="toast('Attachment picker would open here')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></button>
      <input id="composeInput" placeholder="Reply to ${t.name.split(' ')[0]}…">
      <button class="ib-btn ib-send" id="sendBtn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
    </div>`;

  const input = document.getElementById('composeInput');
  const sendBtn = document.getElementById('sendBtn');
  const send = () => {
    const v = input.value.trim();
    if(!v) return;
    t.messages.push({dir:'out',who:'C.J. Mosley',ts:'Just now',text:v});
    t.preview = v.slice(0,80);
    t.time = 'Just now';
    input.value = '';
    openThread(id);
    setTimeout(() => {
      const ml = document.getElementById('msgList');
      if(ml) ml.scrollTop = ml.scrollHeight;
    }, 30);
    toast('Message sent');
  };
  sendBtn.onclick = send;
  input.addEventListener('keypress', e => {if(e.key === 'Enter') send()});

  setTimeout(() => {
    const ml = document.getElementById('msgList');
    if(ml) ml.scrollTop = ml.scrollHeight;
  }, 30);
}

document.getElementById('threadSearch')?.addEventListener('input', e => {
  threadSearchQ = e.target.value;
  renderInboxList();
});

/* ===========================================================
   CALENDAR GRID
   =========================================================== */
let calCursor = {month:4,year:2026}; // May 2026

function renderCalGrid(){
  const grid = document.getElementById('calGrid');
  if(!grid) return;
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('calMonthLabel').textContent = `${months[calCursor.month]} ${calCursor.year}`;

  const firstDay = new Date(calCursor.year, calCursor.month, 1).getDay();
  const daysInMonth = new Date(calCursor.year, calCursor.month + 1, 0).getDate();
  const prevMonthDays = new Date(calCursor.year, calCursor.month, 0).getDate();
  const dow = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  let html = dow.map(d => `<div class="cal-dow">${d}</div>`).join('');

  // leading days from prev month
  for(let i = firstDay - 1; i >= 0; i--){
    html += `<div class="cal-day other"><div class="day-num">${prevMonthDays - i}</div></div>`;
  }

  const today = {d:11,m:4,y:2026}; // simulated "today" — 11 May 2026

  for(let d = 1; d <= daysInMonth; d++){
    const isToday = (d === today.d && calCursor.month === today.m && calCursor.year === today.y);
    const events = CALENDAR.filter(e => e.d === d && e.m === calCursor.month && e.year === calCursor.year);
    const shown = events.slice(0,3);
    const more = events.length - shown.length;
    html += `<div class="cal-day ${isToday ? 'today' : ''}">
      <div class="day-num">${d}</div>
      ${shown.map(e => `<div class="day-event ${e.cat}" onclick="toast('${e.ttl.replace(/'/g,'\\\'')}')" title="${e.ttl} — ${e.sub}">${e.ttl}</div>`).join('')}
      ${more > 0 ? `<div class="day-more">+${more} more</div>` : ''}
    </div>`;
  }

  // trailing days
  const totalCells = firstDay + daysInMonth;
  const trailing = (7 - totalCells % 7) % 7;
  for(let i = 1; i <= trailing; i++){
    html += `<div class="cal-day other"><div class="day-num">${i}</div></div>`;
  }

  grid.innerHTML = html;
}

document.getElementById('calPrev')?.addEventListener('click', () => {
  calCursor.month--;
  if(calCursor.month < 0){calCursor.month = 11; calCursor.year--}
  renderCalGrid();
});
document.getElementById('calNext')?.addEventListener('click', () => {
  calCursor.month++;
  if(calCursor.month > 11){calCursor.month = 0; calCursor.year++}
  renderCalGrid();
});
document.getElementById('calToday')?.addEventListener('click', () => {
  calCursor = {month:4,year:2026};
  renderCalGrid();
});

/* ===========================================================
   DOCUMENTS VAULT
   =========================================================== */
let docFilter = 'all';
let docView = 'grid';

function renderDocs(){
  const items = docFilter === 'all' ? DOCS : DOCS.filter(d => d.tag === docFilter);
  const grid = document.getElementById('docsContainer');
  if(!grid) return;
  if(docView === 'grid'){
    grid.className = 'docs-grid';
    grid.innerHTML = items.map(d => `
      <div class="doc" onclick="toast('Opening ${d.name}…')">
        <div class="doc-tag ${d.tag}">${d.tag}</div>
        <div class="doc-icon ${d.tag}">${d.ic}</div>
        <div class="doc-name">${d.name}</div>
        <div class="doc-meta">${d.type} · ${d.size} · ${d.date}</div>
      </div>`).join('') || '<div class="empty-state" style="grid-column:1/-1">No documents in this view</div>';
  }else{
    grid.className = 'docs-list';
    grid.innerHTML = items.map(d => `
      <div class="doc-row" onclick="toast('Opening ${d.name}…')">
        <div class="di">${d.ic}</div>
        <div class="dn"><div class="nm">${d.name}</div><div class="meta">${d.type} · ${d.size} · ${d.tag}</div></div>
        <div class="dt">${d.date}</div>
      </div>`).join('') || '<div class="empty-state">No documents in this view</div>';
  }
}

document.getElementById('docFilters')?.addEventListener('click', e => {
  if(e.target.matches('[data-doc-filter]')){
    document.querySelectorAll('[data-doc-filter]').forEach(p => p.classList.remove('on'));
    e.target.classList.add('on');
    docFilter = e.target.dataset.docFilter;
    renderDocs();
  }
  if(e.target.matches('[data-doc-view]')){
    document.querySelectorAll('[data-doc-view]').forEach(p => p.classList.remove('on'));
    e.target.classList.add('on');
    docView = e.target.dataset.docView;
    renderDocs();
  }
});

/* ===========================================================
   FOUNDATIONS
   =========================================================== */
function renderFoundations(){
  const el = document.getElementById('foundationsGrid');
  if(!el) return;
  el.innerHTML = FOUNDATIONS.map(f => `
    <div class="foundation-grid">
      <div class="fnd-card">
        <div class="fnd-name">${f.name}</div>
        <div class="fnd-sub">Est. ${f.est} · ${f.player} · 501(c)(3)</div>
        <div class="fnd-impact">
          <div class="impact"><div class="v">${f.raised}</div><div class="l">Raised to date</div></div>
          <div class="impact"><div class="v">${f.served}</div><div class="l">Youth served</div></div>
          <div class="impact"><div class="v">${f.programs}</div><div class="l">Active programs</div></div>
        </div>
        <div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--line)">
          <h5 style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);margin-bottom:14px">Programs & campaigns</h5>
          ${f.programList.map(p => `
            <div class="program-row">
              <div class="pn">${p.name}<small>${p.sub}</small></div>
              <div class="pa">
                <div class="raised">$${(p.raised/1000).toFixed(0)}K</div>
                <div class="goal">of $${(p.goal/1000).toFixed(0)}K goal</div>
                <div class="progress-bar"><div class="fill" style="width:${Math.min(100,p.raised/p.goal*100)}%"></div></div>
              </div>
            </div>`).join('')}
        </div>
      </div>
      <div class="fnd-card">
        <h5 style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);margin-bottom:14px">Compliance & docs</h5>
        ${f.docs.map(d => `<div class="doc-row" style="cursor:pointer;padding:12px 0;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:12px" onclick="toast('Opening ${d}…')"><div class="di" style="width:32px;height:32px;border:1px solid var(--gold);border-radius:5px;display:flex;align-items:center;justify-content:center;color:var(--gold);font-family:Cormorant Garamond,serif;font-style:italic">F</div><div style="flex:1;font-size:13px;color:#fff">${d}</div></div>`).join('')}
        <button class="btn btn-line btn-full" style="margin-top:18px" onclick="toast('Foundation editor would open here')">+ Log new contribution</button>
      </div>
    </div>`).join('');
}

/* ===========================================================
   MEDIA TRAINING
   =========================================================== */
function renderTraining(){
  const el = document.getElementById('trainingGrid');
  if(!el) return;
  el.innerHTML = TRAINING.map(t => `
    <div class="training-card" onclick="openDrawer('${t.playerId}')">
      <div class="tc-head">
        <div class="tc-player">
          <div class="tc-av">${t.init}</div>
          <div><div class="nm">${t.name}</div><div class="pos">${t.pos}</div></div>
        </div>
        <div class="tc-status ${t.status}">${t.status === 'ready' ? 'Ready' : t.status === 'progress' ? 'In progress' : 'Scheduled'}</div>
      </div>
      <div class="tc-progress">${t.progress}% complete · ${t.modules.filter(m => m.done).length} / ${t.modules.length} modules</div>
      <div class="tc-bar"><div class="fl" style="width:${t.progress}%"></div></div>
      <div class="tc-modules">
        ${t.modules.map(m => `<div class="tc-mod ${m.done ? 'done' : ''}"><div class="ck"></div><div class="lb">${m.label}</div></div>`).join('')}
      </div>
    </div>`).join('');
}

/* ===========================================================
   NEGOTIATION WORKSPACE
   =========================================================== */
function renderNegWorkspace(){
  const el = document.getElementById('negWorkspace');
  if(!el) return;
  const w = NEG_WORKSPACE;
  const stages = w.stages.map((s,i) => {
    const cls = i < w.currentStage ? 'done' : i === w.currentStage ? 'active' : '';
    const lblCls = i < w.currentStage ? 'done' : i === w.currentStage ? 'active' : '';
    return `<div class="neg-stage-dot ${cls}"></div><span class="lbl ${lblCls}">${s}</span>${i < w.stages.length - 1 ? `<div class="neg-stage-line ${i < w.currentStage ? 'done' : ''}"></div>` : ''}`;
  }).join('');

  el.innerHTML = `
    <div class="neg-head">
      <div class="neg-title">
        <h3>${w.player} <span class="it">·</span> ${w.type}</h3>
        <div class="sub"><span>${w.team}</span><span style="opacity:.5">·</span><span>Stage: ${w.stages[w.currentStage]}</span><span style="opacity:.5">·</span><span class="link" onclick="openDrawer('${w.playerId}')">View player →</span></div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-line btn-sm" onclick="toast('Generating offer comparison memo…')">Export memo</button>
        <button class="btn btn-gold btn-sm" onclick="toast('Counter sent to NYJ FO')">Send counter</button>
      </div>
    </div>
    <div class="neg-stages">${stages}</div>
    <div class="neg-body">
      <div class="neg-section">
        <h5>Offer comparison</h5>
        <div class="offers">
          ${w.offers.map(o => `
            <div class="offer ${o.best ? 'best' : ''}">
              <div class="ti">${o.label}</div>
              <div class="v">$${o.aav}M<small>/yr</small></div>
              <div class="meta-list">
                <div class="mi"><span>Term</span><span>${o.years} yr</span></div>
                <div class="mi"><span>Total</span><span>$${o.total}M</span></div>
                <div class="mi"><span>Guaranteed</span><span>$${o.guaranteed}M (${o.gtdPct})</span></div>
                <div class="mi"><span>Signing bonus</span><span>$${o.bonus}M</span></div>
                ${o.cap2027 ? `<div class="mi"><span>Cap '27</span><span>$${o.cap2027}M</span></div>` : ''}
              </div>
            </div>`).join('')}
        </div>
      </div>
      <div class="neg-section">
        <h5>Proposed term structure</h5>
        <div class="term-grid">
          <div class="term"><div class="lbl">Base</div><div class="vl">${w.terms.base}</div><div class="vs">salary structure</div></div>
          <div class="term"><div class="lbl">Bonus</div><div class="vl">${w.terms.bonus}</div><div class="vs">paid at execution</div></div>
          <div class="term"><div class="lbl">Incentives</div><div class="vl">${w.terms.incentives}</div><div class="vs">NLTBE escalators</div></div>
          <div class="term"><div class="lbl">Void Years</div><div class="vl">${w.terms.voidYears}</div><div class="vs">cap management</div></div>
        </div>
      </div>
      <div class="neg-section">
        <h5>Leverage analysis</h5>
        <div class="leverage">
          <div class="lev-col"><h6 class="ours">Our leverage</h6><ul class="lev-list">${w.leverage.ours.map(l => `<li>${l}</li>`).join('')}</ul></div>
          <div class="lev-col"><h6 class="theirs">Their leverage</h6><ul class="lev-list">${w.leverage.theirs.map(l => `<li>${l}</li>`).join('')}</ul></div>
        </div>
      </div>
    </div>`;
}

/* ===========================================================
   FINANCIALS
   =========================================================== */
function fmt(v){return '$' + v.toLocaleString()}

function renderFinancials(){
  const el = document.getElementById('finTable');
  if(!el) return;
  const totalRev = FINANCIALS.revenue.total;
  const totalExp = FINANCIALS.expenses.reduce((s,e) => s + e.v, 0);
  el.innerHTML = `
    <div class="fin-section">
      <div class="fin-section-title">Revenue · YTD</div>
      ${FINANCIALS.revenue.sources.map(s => `<div class="fin-row"><div class="lb">${s.l}</div><div class="vl">${fmt(s.v)}</div></div>`).join('')}
      <div class="fin-row total"><div class="lb">Total revenue</div><div class="vl">${fmt(totalRev)}</div></div>
    </div>
    <div class="fin-section">
      <div class="fin-section-title">Operating expenses · YTD</div>
      ${FINANCIALS.expenses.map(s => `<div class="fin-row"><div class="lb">${s.l}</div><div class="vl">${fmt(s.v)}</div></div>`).join('')}
      <div class="fin-row total"><div class="lb">Total expenses</div><div class="vl">${fmt(totalExp)}</div></div>
    </div>
    <div class="fin-section">
      <div class="fin-section-title">Operating result</div>
      <div class="fin-row total"><div class="lb">Net contribution (42% margin)</div><div class="vl">${fmt(totalRev - totalExp)}</div></div>
    </div>`;

  const ar = document.getElementById('finAR');
  if(ar){
    ar.innerHTML = FINANCIALS.ar.map(r => `<div class="pipe-row"><div><div class="nm">${r.team}<small>${r.sub}</small></div></div><div class="amt">${fmt(r.amt)}<small>${r.age}</small></div></div>`).join('');
  }
}

/* ===========================================================
   QUICK ACTIONS + MODAL + TOAST
   =========================================================== */
const quickToggle = document.getElementById('quickToggle');
const quickMenu = document.getElementById('quickMenu');
quickToggle.onclick = e => {e.stopPropagation(); quickMenu.classList.toggle('on')};
function closeQuickMenu(){quickMenu.classList.remove('on')}
document.addEventListener('click', e => {if(!quickMenu.contains(e.target) && e.target !== quickToggle) closeQuickMenu()});

const modalBg = document.getElementById('modalBg');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

const MODAL_FORMS = {
  contract:{title:'New <span class="it">contract</span>',body:`
    <div class="field"><label>Player</label><select>${PLAYERS.map(p => `<option>${p.name} — ${p.pos} · ${p.team}</option>`).join('')}</select></div>
    <div class="field"><label>Contract type</label><select><option>Extension</option><option>Rookie deal</option><option>Free agent signing</option><option>Restructure</option></select></div>
    <div class="field"><label>Target value</label><input placeholder="e.g. $24M / 2yr"></div>
    <div class="field"><label>Notes</label><textarea placeholder="Opening offer, structure preferences, guarantees…"></textarea></div>`},
  endorsement:{title:'New <span class="it">endorsement</span>',body:`
    <div class="field"><label>Brand</label><input placeholder="Athletic Brewing, Beats, Topps…"></div>
    <div class="field"><label>Player</label><select>${PLAYERS.map(p => `<option>${p.name}</option>`).join('')}</select></div>
    <div class="field"><label>Deal value</label><input placeholder="$85,000 / 12 months"></div>
    <div class="field"><label>Stage</label><select><option>Prospecting</option><option>Negotiating</option><option>Legal review</option><option>Contract sent</option></select></div>`},
  recruit:{title:'New <span class="it">recruit</span>',body:`
    <div class="field"><label>Name</label><input placeholder="Player name"></div>
    <div class="field"><label>Position & school</label><input placeholder="DB · Auburn · Sr."></div>
    <div class="field"><label>Stage</label><select><option>Sourced</option><option>Contacted</option><option>Visited</option><option>Verbal</option></select></div>
    <div class="field"><label>Notes</label><textarea placeholder="Scouting notes, contact details…"></textarea></div>`},
  call:{title:'Log <span class="it">call</span>',body:`
    <div class="field"><label>With</label><input placeholder="Joe Douglas, Carolina FO, player…"></div>
    <div class="field"><label>Player</label><select><option>—</option>${PLAYERS.map(p => `<option>${p.name}</option>`).join('')}</select></div>
    <div class="field"><label>Topic</label><select><option>Contract</option><option>Endorsement</option><option>Recruiting</option><option>Player</option><option>Internal</option></select></div>
    <div class="field"><label>Summary</label><textarea placeholder="Key takeaways, next steps…"></textarea></div>`},
  meeting:{title:'Schedule <span class="it">meeting</span>',body:`
    <div class="field"><label>Title</label><input placeholder="e.g. Mosley extension talks"></div>
    <div class="field"><label>Date</label><input type="date"></div>
    <div class="field"><label>Location / link</label><input placeholder="NYJ facility · Zoom · phone"></div>
    <div class="field"><label>Attendees</label><input placeholder="C.J., B. Wassel, Joe Douglas…"></div>`},
  note:{title:'Add <span class="it">note</span>',body:`
    <div class="field"><label>Player (optional)</label><select><option>—</option>${PLAYERS.map(p => `<option>${p.name}</option>`).join('')}</select></div>
    <div class="field"><label>Note</label><textarea placeholder="Internal context, strategy thoughts, watch-outs…" style="min-height:120px"></textarea></div>`},
  doc:{title:'Upload <span class="it">document</span>',body:`
    <div class="field"><label>File</label><input type="file"></div>
    <div class="field"><label>Type</label><select><option>Contract</option><option>Endorsement</option><option>Tax</option><option>Compliance</option><option>Marketing</option><option>Strategy</option></select></div>
    <div class="field"><label>Tag</label><select><option>Draft</option><option>Review</option><option>Signed</option></select></div>
    <div class="field"><label>Player (optional)</label><select><option>—</option>${PLAYERS.map(p => `<option>${p.name}</option>`).join('')}</select></div>`}
};

function openModal(type){
  const m = MODAL_FORMS[type];
  if(!m) return;
  modalTitle.innerHTML = m.title;
  modalBody.innerHTML = m.body;
  modalBg.dataset.type = type;
  modalBg.classList.add('on');
  closeQuickMenu();
}
function closeModal(){modalBg.classList.remove('on')}
function saveModal(){
  const labels = {
    contract:'Contract drafted',endorsement:'Endorsement logged',recruit:'Recruit added to pipeline',
    call:'Call logged',meeting:'Meeting scheduled',note:'Note saved',doc:'Document uploaded'
  };
  toast(labels[modalBg.dataset.type] || 'Saved');
  closeModal();
}

let toastT;
function toast(msg){
  document.getElementById('toastText').textContent = msg;
  document.getElementById('toast').classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => document.getElementById('toast').classList.remove('on'), 3200);
}

/* ===========================================================
   GLOBAL SEARCH
   =========================================================== */
document.getElementById('globalSearch').addEventListener('keypress', e => {
  if(e.key !== 'Enter') return;
  const q = e.target.value.toLowerCase().trim();
  if(!q) return;
  const match = PLAYERS.find(p => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q) || p.pos.toLowerCase().includes(q));
  if(match){openDrawer(match.id); e.target.value = ''}
  else toast(`No results for "${q}"`);
});

/* ===========================================================
   INIT
   =========================================================== */
renderOverviewRoster();
renderRoster();
renderChart();
renderNegotiations();
renderEndorsements();
renderCalList('overviewCal', 4);
renderCalList('fullCalList');
renderAlerts();
renderFunnel();
renderInboxList();
openThread(THREADS[0].id);
renderCalGrid();
renderDocs();
renderFoundations();
renderTraining();
renderNegWorkspace();
renderFinancials();
