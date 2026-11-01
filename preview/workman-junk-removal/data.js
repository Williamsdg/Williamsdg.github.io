/* Workman Junk Removal — concept data. Every list below is taken from workmanjunkremoval.com. */
window.WJR = {
  phone: '(231) 557-8386', tel: '2315578386', email: 'workmanjunkremoval@gmail.com',
  take: [
    { cat: 'Household items', slug: 'household', items: [
      ['Mattresses and box springs', 'mattress', 'box spring', 'bed'], ['Trash bags', 'trash', 'garbage', 'bags'], ['Furniture', 'furniture'],
      ['Electronics', 'electronics', 'tv', 'television', 'computer', 'monitor', 'printer'], ['Toys', 'toys', 'toy'], ['All household items', 'household', 'boxes', 'clutter', 'stuff', 'junk']
    ]},
    { cat: 'Furniture', slug: 'furniture', items: [
      ['Couches and sectionals', 'couch', 'sofa', 'sectional', 'loveseat', 'recliner'], ['Mattresses', 'mattress'], ['Tables and chairs', 'table', 'chair', 'chairs', 'dining', 'patio'],
      ['Wardrobes and chests', 'wardrobe', 'chest', 'armoire'], ['Dressers', 'dresser'], ['All furniture', 'desk', 'bookshelf', 'bookcase', 'cabinet', 'bed frame', 'nightstand', 'entertainment center']
    ]},
    { cat: 'Appliances', slug: 'appliances', items: [
      ['Washers and dryers', 'washer', 'dryer', 'washing machine', 'laundry'], ['Ovens and stoves', 'oven', 'stove', 'range'], ['Fridges', 'fridge', 'refrigerator', 'freezer'],
      ['Dishwashers', 'dishwasher', 'dish washer'], ['Hot water heaters', 'water heater', 'hot water', 'boiler'], ['Any other appliances', 'appliance', 'microwave', 'ac unit', 'air conditioner', 'furnace']
    ]},
    { cat: 'Structure removal', slug: 'structures', href: 'structure-removal.html', items: [
      ['Sheds', 'shed', 'garage demo'], ['Fences', 'fence', 'fencing', 'gate'], ['Playsets and swing sets', 'playset', 'swing set', 'swingset', 'play set', 'slide', 'jungle gym'],
      ['Decks', 'deck'], ['Retaining walls', 'retaining wall'], ['Concrete', 'concrete', 'cement', 'patio slab', 'sidewalk']
    ]},
    { cat: 'Construction debris', slug: 'construction', items: [
      ['Remodeling debris', 'remodel', 'remodeling', 'debris', 'demolition', 'demo', 'construction', 'renovation'], ['Contractor bags', 'contractor bag'], ['Roof shingles', 'shingle', 'shingles', 'roofing', 'roof'],
      ['Scrap metal', 'scrap', 'metal', 'steel', 'iron'], ['Insulation', 'insulation'], ['Drywall', 'drywall', 'sheetrock', 'plaster']
    ]},
    { cat: 'Yard waste', slug: 'yard', items: [
      ['Brush', 'brush', 'branches', 'limbs', 'shrubs', 'bushes'], ['Leaf bags', 'leaf bag', 'leaf bags'], ['Wood', 'wood', 'lumber', 'firewood', 'logs', 'pallets'],
      ['Leaves', 'leaves', 'yard waste', 'yard'], ['Fallen trees', 'tree', 'trees', 'stump'], ['All yard waste', 'landscaping']
    ]},
    { cat: 'Miscellaneous', slug: 'misc', items: [
      ['Hot tubs', 'hot tub', 'hottub', 'jacuzzi', 'spa', 'swim spa'], ['Pianos', 'piano'], ['Tires', 'tire', 'tires'],
      ['Lawnmowers', 'lawnmower', 'lawn mower', 'mower', 'riding mower'], ['Grills', 'grill', 'bbq', 'barbecue'], ['Random things', 'random', 'misc']
    ]},
    { cat: 'Clean outs', slug: 'cleanouts', href: 'cleanouts.html', items: [
      ['Estate clean outs', 'estate'], ['Hoarder clean outs', 'hoarder', 'hoarding'], ['Garage clean outs', 'garage'], ['Basement clean outs', 'basement'],
      ['Shed clean outs', 'shed clean'], ['Attic clean outs', 'attic'], ['Full house clean outs', 'house', 'whole house', 'full house', 'apartment', 'rental', 'storage unit']
    ]}
  ],
  towns: [
    { n: 'Ludington', s: 'ludington', x: 130, y: 87 }, { n: 'Pentwater', s: 'pentwater', x: 138, y: 191 },
    { n: 'Baldwin', s: 'baldwin', x: 391, y: 119 }, { n: 'Hart', s: 'hart', x: 168, y: 241 },
    { n: 'Shelby', s: 'shelby', x: 168, y: 295 }, { n: 'Hesperia', s: 'hesperia', x: 309, y: 319 },
    { n: 'White Cloud', s: 'white-cloud', x: 425, y: 330 }, { n: 'Rothbury', s: 'rothbury', x: 176, y: 356 },
    { n: 'Fremont', s: 'fremont', x: 352, y: 379 }, { n: 'Montague', s: 'montague', x: 165, y: 406, dy: -9 },
    { n: 'Newaygo', s: 'newaygo', x: 413, y: 408 }, { n: 'Whitehall', s: 'whitehall', x: 178, y: 419, dy: 19 },
    { n: 'Twin Lake', s: 'twin-lake', x: 255, y: 443 }, { n: 'Muskegon', s: 'muskegon', x: 218, y: 520, home: true },
    { n: 'Cedar Springs', s: 'cedar-springs', x: 522, y: 526, anchor: 'end' }, { n: 'Ravenna', s: 'ravenna', x: 354, y: 546 },
    { n: 'Norton Shores', s: 'norton-shores', x: 211, y: 561 }, { n: 'Sparta', s: 'sparta', x: 452, y: 563 },
    { n: 'Fruitport', s: 'fruitport', x: 259, y: 583 }, { n: 'Grand Rapids', s: 'grand-rapids', x: 471, y: 682 }
  ],
  shore: [[118,0],[122,40],[130,92],[133,140],[134,192],[120,235],[91,270],[100,300],[109,318],[118,360],[128,395],[137,422],[150,470],[178,522],[195,575],[217,624],[228,700],[235,760]],
  reviews: [
    { who: 'Amy Cherette', text: 'Isaac did a fantastic job removing our old hot tub. He was very responsive via text and kept in touch throughout. He kept everything clean and removed all debris as promised. Would highly recommend him!' },
    { who: 'Shawn Koch', text: 'Highly recommend! Prompt and professional, Workman junk removal was here within 24 hours of my call. I had to give him a tip, and you will too! Great job!' },
    { who: 'Kristin Kurcz', text: 'Isaac was very personable, extremely responsive and able to assist with our needs immediately. Definitely recommend!!!' },
    { who: 'Josh Beetham', text: 'Very happy with work professional and efficient. Would hire again.' },
    { who: 'Brett Oslund', text: 'Very fast and thorough. Nice people too!' }
  ]
};
