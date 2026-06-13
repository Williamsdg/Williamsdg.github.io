/* ============================================================
   GameFAQs redesign concept — shared game database
   One record per game. game.html?id=<slug> renders any of these.
   Descriptions/release facts sourced from public references
   (Wikipedia) for an unaffiliated design study.
   ============================================================ */
window.GAMES = [
  {
    id: "elden-ring-nightreign",
    title: "Elden Ring: Nightreign",
    cover: "covers/nightreign.png",
    c: "c1",
    score: 89,
    userScore: 8.9,
    genre: "Action RPG / Roguelike",
    developer: "FromSoftware",
    publisher: "Bandai Namco Entertainment",
    platformPrimary: "PS5",
    platforms: ["PS5", "Xbox Series", "PC"],
    releases: [
      { plat: "PS5, Xbox Series, PC", date: "May 30, 2025" }
    ],
    esrb: "M (Mature 17+)",
    players: "1–3 (Online Co-op)",
    desc: "Teams of three players collaborate across procedurally generated maps over three in-game days, defeating bosses and preparing for a final confrontation. The play area shrinks battle-royale style, with map resets after each daily boss and 'Shifting Earth' events that open expanded dungeons and greater rewards.",
    guideCount: 42,
    guides: [
      { title: "100% Completion Walkthrough", type: "Walkthrough", author: "SaikyoBro", size: "184 KB" },
      { title: "Nightlord Boss Strategy Compendium", type: "Boss FAQ", author: "Berserker", size: "92 KB" },
      { title: "All Nightfarer Classes & Builds", type: "Guide", author: "noz3r0", size: "61 KB" },
      { title: "Relic & Rune Farming Routes", type: "Guide", author: "KeyBlade999", size: "44 KB" },
      { title: "Shifting Earth Events — Full Map", type: "Maps", author: "Absolute Steve", size: "28 KB" }
    ],
    related: ["baldurs-gate-3", "monster-hunter-wilds", "ff7-rebirth"]
  },
  {
    id: "ff7-rebirth",
    title: "Final Fantasy VII Rebirth",
    cover: "covers/ff7rebirth.png",
    c: "c2",
    score: 92,
    userScore: 9.2,
    genre: "Action RPG",
    developer: "Square Enix Creative Business Unit I",
    publisher: "Square Enix",
    platformPrimary: "PS5",
    platforms: ["PS5", "PC"],
    releases: [
      { plat: "PlayStation 5", date: "February 29, 2024" },
      { plat: "Windows (PC)", date: "January 23, 2025" }
    ],
    esrb: "T (Teen)",
    players: "1 Player",
    desc: "The second entry in the Final Fantasy VII remake trilogy combines real-time action with strategic, role-playing elements as players guide Cloud and his companions across a sprawling open world. Hybrid combat mixes melee attacks with the Active Time Battle system while you explore iconic locations and complete quests.",
    guideCount: 68,
    guides: [
      { title: "Main Story Walkthrough (Spoiler-Free)", type: "Walkthrough", author: "Absolute Steve", size: "240 KB" },
      { title: "All Side Quests & World Intel", type: "Guide", author: "SaikyoBro", size: "131 KB" },
      { title: "Materia & Weapon Build Guide", type: "Guide", author: "noz3r0", size: "73 KB" },
      { title: "Queen's Blood Card Master List", type: "FAQ", author: "KeyBlade999", size: "55 KB" },
      { title: "Platinum Trophy Roadmap", type: "Trophy Guide", author: "Berserker", size: "39 KB" }
    ],
    related: ["metaphor-refantazio", "like-a-dragon-infinite-wealth", "elden-ring-nightreign"]
  },
  {
    id: "tears-of-the-kingdom",
    title: "The Legend of Zelda: Tears of the Kingdom",
    cover: "covers/totk.jpg",
    c: "c3",
    score: 96,
    userScore: 9.6,
    genre: "Action-Adventure",
    developer: "Nintendo EPD",
    publisher: "Nintendo",
    platformPrimary: "Switch",
    platforms: ["Switch", "Switch 2"],
    releases: [
      { plat: "Nintendo Switch", date: "May 12, 2023" },
      { plat: "Switch 2 (Enhanced)", date: "June 5, 2025" }
    ],
    esrb: "E10+ (Everyone 10+)",
    players: "1 Player",
    desc: "Link searches for Princess Zelda and fights to stop Ganondorf from destroying Hyrule across an expanded open world spanning sky islands and the underground Depths. New Ultrahand and Fuse construction mechanics let you build vehicles and contraptions to solve puzzles and traverse the land.",
    guideCount: 131,
    guides: [
      { title: "Complete 100% Walkthrough", type: "Walkthrough", author: "KeyBlade999", size: "312 KB" },
      { title: "All 152 Shrines — Solutions & Maps", type: "Maps", author: "Berserker", size: "188 KB" },
      { title: "Korok Seed Locations (All 1000)", type: "Guide", author: "SaikyoBro", size: "140 KB" },
      { title: "Best Zonai Builds & Schematics", type: "Guide", author: "noz3r0", size: "66 KB" },
      { title: "Armor & Upgrade Material Guide", type: "FAQ", author: "Absolute Steve", size: "48 KB" }
    ],
    related: ["astro-bot", "elden-ring-nightreign", "baldurs-gate-3"]
  },
  {
    id: "astro-bot",
    title: "Astro Bot",
    cover: "covers/astrobot.jpg",
    c: "c4",
    score: 94,
    userScore: 9.4,
    genre: "3D Platformer",
    developer: "Team Asobi",
    publisher: "Sony Interactive Entertainment",
    platformPrimary: "PS5",
    platforms: ["PS5"],
    releases: [
      { plat: "PlayStation 5", date: "September 6, 2024" }
    ],
    esrb: "E (Everyone)",
    players: "1 Player",
    desc: "Players guide Astro, a small robot, through a 3D platformer across 90 levels — jumping, hovering, punching, and spin-attacking to rescue lost bots and recover PS5 mothership parts. The game leans hard on the DualSense controller's haptics and adaptive triggers to make traversal and combat feel tactile.",
    guideCount: 24,
    guides: [
      { title: "Full Level Walkthrough", type: "Walkthrough", author: "SaikyoBro", size: "88 KB" },
      { title: "All Hidden Bots & Puzzle Pieces", type: "Guide", author: "KeyBlade999", size: "52 KB" },
      { title: "Special Bot Cameo Checklist", type: "FAQ", author: "Berserker", size: "31 KB" },
      { title: "Platinum Trophy Guide", type: "Trophy Guide", author: "noz3r0", size: "22 KB" }
    ],
    related: ["tears-of-the-kingdom", "ff7-rebirth", "silent-hill-2-remake"]
  },
  {
    id: "baldurs-gate-3",
    title: "Baldur's Gate 3",
    cover: "covers/bg3.jpg",
    c: "c5",
    score: 95,
    userScore: 9.5,
    genre: "CRPG / Turn-Based RPG",
    developer: "Larian Studios",
    publisher: "Larian Studios",
    platformPrimary: "PC",
    platforms: ["PC", "PS5", "Xbox Series"],
    releases: [
      { plat: "Windows (PC)", date: "August 3, 2023" },
      { plat: "PlayStation 5", date: "September 6, 2023" },
      { plat: "Xbox Series X/S", date: "December 7, 2023" }
    ],
    esrb: "M (Mature 17+)",
    players: "1–4 (Online Co-op)",
    desc: "Built on Dungeons & Dragons 5e, players create customizable characters and explore vast areas in real time while combat plays out in turns. Outcomes for fights, dialogue, and world interaction are largely decided by rolling a 20-sided die, making every choice consequential.",
    guideCount: 210,
    guides: [
      { title: "Act 1–3 Complete Walkthrough", type: "Walkthrough", author: "Absolute Steve", size: "410 KB" },
      { title: "Every Class Build & Multiclass Guide", type: "Guide", author: "noz3r0", size: "220 KB" },
      { title: "All Companions — Approval & Romance", type: "Guide", author: "SaikyoBro", size: "144 KB" },
      { title: "Best Endings & Choice Consequences", type: "FAQ", author: "Berserker", size: "97 KB" },
      { title: "Legendary Gear & Item Locations", type: "Maps", author: "KeyBlade999", size: "76 KB" }
    ],
    related: ["elden-ring-nightreign", "metaphor-refantazio", "tears-of-the-kingdom"]
  },
  {
    id: "metaphor-refantazio",
    title: "Metaphor: ReFantazio",
    cover: "covers/metaphor.png",
    c: "c6",
    score: 90,
    userScore: 9.0,
    genre: "Turn-Based RPG",
    developer: "Studio Zero",
    publisher: "Sega",
    platformPrimary: "Multi",
    platforms: ["PS5", "Xbox Series", "PC"],
    releases: [
      { plat: "PS5, Xbox Series, PC", date: "October 11, 2024" }
    ],
    esrb: "M (Mature 17+)",
    players: "1 Player",
    desc: "From the team behind Persona, players navigate a medieval fantasy realm through a calendar system — balancing exploration, social bonds, and dungeon crawling while competing in a royal tournament. Combat blends real-time action with turn-based mechanics and a 'Press Turn' system that rewards exploiting enemy weaknesses.",
    guideCount: 57,
    guides: [
      { title: "Story Walkthrough & Calendar Planner", type: "Walkthrough", author: "Absolute Steve", size: "176 KB" },
      { title: "All Archetypes & Lineage Builds", type: "Guide", author: "noz3r0", size: "98 KB" },
      { title: "Follower Bond Maxing Guide", type: "Guide", author: "SaikyoBro", size: "61 KB" },
      { title: "Optional Bosses & Best Gear", type: "FAQ", author: "Berserker", size: "44 KB" }
    ],
    related: ["ff7-rebirth", "like-a-dragon-infinite-wealth", "baldurs-gate-3"]
  },
  {
    id: "silent-hill-2-remake",
    title: "Silent Hill 2 Remake",
    cover: "covers/sh2.jpg",
    c: "c7",
    score: 86,
    userScore: 8.6,
    genre: "Survival Horror",
    developer: "Bloober Team",
    publisher: "Konami Digital Entertainment",
    platformPrimary: "PS5",
    platforms: ["PS5", "PC"],
    releases: [
      { plat: "PS5, Windows (PC)", date: "October 8, 2024" },
      { plat: "Xbox Series X/S", date: "November 21, 2025" }
    ],
    esrb: "M (Mature 17+)",
    players: "1 Player",
    desc: "Players guide James Sunderland through the fog-shrouded town of Silent Hill, solving puzzles and fighting monsters as he searches for his deceased wife. The remake modernizes combat and the camera while preserving the psychological horror and dread of the 2001 original.",
    guideCount: 33,
    guides: [
      { title: "Full Walkthrough (All Puzzles)", type: "Walkthrough", author: "Berserker", size: "120 KB" },
      { title: "All Endings Guide & Requirements", type: "FAQ", author: "SaikyoBro", size: "58 KB" },
      { title: "Riddle Puzzle Solutions (All Difficulties)", type: "Guide", author: "KeyBlade999", size: "41 KB" },
      { title: "Collectibles & Glimpse of the Past", type: "Maps", author: "noz3r0", size: "29 KB" }
    ],
    related: ["astro-bot", "monster-hunter-wilds", "elden-ring-nightreign"]
  },
  {
    id: "monster-hunter-wilds",
    title: "Monster Hunter Wilds",
    cover: "covers/mhwilds.png",
    c: "c8",
    score: 88,
    userScore: 8.8,
    genre: "Action RPG",
    developer: "Capcom",
    publisher: "Capcom",
    platformPrimary: "Multi",
    platforms: ["PS5", "Xbox Series", "PC"],
    releases: [
      { plat: "PS5, Xbox Series, PC", date: "February 28, 2025" }
    ],
    esrb: "T (Teen)",
    players: "1–4 (Online Co-op)",
    desc: "Hunters explore the Forbidden Lands, a harsh open world where they track and battle massive monsters, then harvest resources to craft better weapons and armor. Up to four-player crossplay co-op is supported, with new mechanics like mounted Seikret travel and a wound system for targeting monster weak points.",
    guideCount: 74,
    guides: [
      { title: "Low & High Rank Walkthrough", type: "Walkthrough", author: "SaikyoBro", size: "150 KB" },
      { title: "All 14 Weapon Types — Combo Guide", type: "Guide", author: "noz3r0", size: "112 KB" },
      { title: "Monster Weakness & Material Charts", type: "Guide", author: "KeyBlade999", size: "84 KB" },
      { title: "Best Armor Sets & Decorations", type: "FAQ", author: "Absolute Steve", size: "57 KB" },
      { title: "Endgame Tempered Hunt Farming", type: "Guide", author: "Berserker", size: "38 KB" }
    ],
    related: ["elden-ring-nightreign", "silent-hill-2-remake", "baldurs-gate-3"]
  },
  {
    id: "like-a-dragon-infinite-wealth",
    title: "Like a Dragon: Infinite Wealth",
    cover: "covers/likeadragon.jpg",
    c: "c10",
    score: 89,
    userScore: 8.9,
    genre: "Turn-Based RPG",
    developer: "Ryu Ga Gotoku Studio",
    publisher: "Sega",
    platformPrimary: "Multi",
    platforms: ["PS5", "Xbox Series", "PC"],
    releases: [
      { plat: "PS5, Xbox Series, PC", date: "January 26, 2024" }
    ],
    esrb: "M (Mature 17+)",
    players: "1 Player",
    desc: "Players control two protagonists and their party in turn-based combat across three cities, in a story centered on finding a character's missing mother in Hawaii. Beyond the main plot it's packed with side activities — karaoke, the Dondoko Island builder, Sujimon battles, and dozens of minigames.",
    guideCount: 61,
    guides: [
      { title: "Main Story Walkthrough", type: "Walkthrough", author: "Absolute Steve", size: "165 KB" },
      { title: "Dondoko Island Complete Guide", type: "Guide", author: "SaikyoBro", size: "88 KB" },
      { title: "Sujimon Battle & Catch List", type: "FAQ", author: "noz3r0", size: "62 KB" },
      { title: "Job/Class Builds & Stat Guide", type: "Guide", author: "Berserker", size: "47 KB" },
      { title: "Substories & 100% Completion", type: "Guide", author: "KeyBlade999", size: "53 KB" }
    ],
    related: ["ff7-rebirth", "metaphor-refantazio", "monster-hunter-wilds"]
  }
];
