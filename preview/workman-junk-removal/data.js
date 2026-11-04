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
    {'n': 'Ludington', 's': 'ludington', 'x': 153, 'y': 100},
    {'n': 'Pentwater', 's': 'pentwater', 'x': 162, 'y': 206},
    {'n': 'Hart', 's': 'hart', 'x': 192, 'y': 257},
    {'n': 'Shelby', 's': 'shelby', 'x': 192, 'y': 311},
    {'n': 'Baldwin', 's': 'baldwin', 'x': 418, 'y': 133},
    {'n': 'Hesperia', 's': 'hesperia', 'x': 335, 'y': 335},
    {'n': 'White Cloud', 's': 'white-cloud', 'x': 453, 'y': 347},
    {'n': 'Rothbury', 's': 'rothbury', 'x': 201, 'y': 373},
    {'n': 'Fremont', 's': 'fremont', 'x': 378, 'y': 396},
    {'n': 'Montague', 's': 'montague', 'x': 192, 'y': 428, 'anchor': 'end', 'dx': -9, 'dy': -6},
    {'n': 'Newaygo', 's': 'newaygo', 'x': 441, 'y': 426},
    {'n': 'Whitehall', 's': 'whitehall', 'x': 199, 'y': 432, 'anchor': 'start', 'dx': 9, 'dy': 17},
    {'n': 'Twin Lake', 's': 'twin-lake', 'x': 280, 'y': 461},
    {'n': 'Muskegon', 's': 'muskegon', 'x': 243, 'y': 539, 'anchor': 'start', 'dx': 12, 'dy': 6, 'home': true},
    {'n': 'Cedar Springs', 's': 'cedar-springs', 'x': 551, 'y': 545, 'anchor': 'end', 'dx': -10, 'dy': 5},
    {'n': 'Ravenna', 's': 'ravenna', 'x': 381, 'y': 565},
    {'n': 'Norton Shores', 's': 'norton-shores', 'x': 236, 'y': 578, 'anchor': 'start', 'dx': 10, 'dy': 14},
    {'n': 'Sparta', 's': 'sparta', 'x': 481, 'y': 583},
    {'n': 'Fruitport', 's': 'fruitport', 'x': 284, 'y': 601},
    {'n': 'Grand Rapids', 's': 'grand-rapids', 'x': 499, 'y': 703, 'anchor': 'end', 'dx': -10, 'dy': 5}
  ],
  reviews: [
    { who: 'Amy Cherette', text: 'Isaac did a fantastic job removing our old hot tub. He was very responsive via text and kept in touch throughout. He kept everything clean and removed all debris as promised. Would highly recommend him!' },
    { who: 'Shawn Koch', text: 'Highly recommend! Prompt and professional, Workman junk removal was here within 24 hours of my call. I had to give him a tip, and you will too! Great job!' },
    { who: 'Kristin Kurcz', text: 'Isaac was very personable, extremely responsive and able to assist with our needs immediately. Definitely recommend!!!' },
    { who: 'Josh Beetham', text: 'Very happy with work professional and efficient. Would hire again.' },
    { who: 'Brett Oslund', text: 'Very fast and thorough. Nice people too!' }
  ]
};
window.WJR.map = {"w":640,"h":760,"counties":[{"n":"BARRY","d":"M761.1,820.3 762.2,1032.7 662.0,1033.7 554.3,1032.7 553.2,821.9 657.3,820.9 761.1,820.3Z","served":false,"cx":658,"cy":927},{"n":"ISABELLA","d":"M756.3,397.5 754.6,186.2 967.5,185.3 966.9,397.6 861.7,397.5 756.3,397.5Z","served":false,"cx":861,"cy":291},{"n":"LAKE","d":"M334.3,-28.6 431.7,-26.9 432.3,-26.9 544.8,-27.3 545.8,185.1 336.1,185.1 335.6,183.0 334.3,-28.6Z","served":true,"cx":440,"cy":78},{"n":"MECOSTA","d":"M545.8,396.3 545.8,185.1 754.6,186.2 756.3,397.5 545.8,396.3Z","served":false,"cx":651,"cy":291},{"n":"MONTCALM","d":"M656.0,608.7 656.0,502.1 545.7,502.0 545.8,396.3 756.3,397.5 861.7,397.5 865.7,608.7 656.0,608.7Z","served":false,"cx":706,"cy":502},{"n":"NEWAYGO","d":"M545.7,502.0 541.7,502.1 445.2,502.8 335.6,502.5 335.4,396.8 336.1,185.1 545.8,185.1 545.8,396.3 545.7,502.0Z","served":true,"cx":401,"cy":300},{"n":"OSCEOLA","d":"M755.4,-26.9 754.6,186.2 545.8,185.1 544.8,-27.3 646.2,-27.4 755.4,-26.9Z","served":false,"cx":650,"cy":79},{"n":"WEXFORD","d":"M646.2,-27.4 544.8,-27.3 432.3,-26.9 431.7,-26.9 433.1,-238.9 646.5,-238.5 646.2,-27.4Z","served":false,"cx":539,"cy":-133},{"n":"ALLEGAN","d":"M448.7,821.9 479.5,821.9 553.2,821.9 554.3,1032.7 456.7,1033.2 232.0,1034.0 237.4,1019.1 242.7,997.0 246.3,963.9 246.7,960.6 249.0,945.5 249.1,945.4 249.3,944.6 249.3,944.4 250.8,939.1 252.2,934.3 253.1,928.5 253.1,928.4 253.3,927.3 251.8,901.2 252.9,896.8 257.5,885.0 260.8,868.2 261.6,851.6 260.9,825.2 260.7,822.3 448.7,821.9Z","served":false,"cx":393,"cy":928},{"n":"KENT","d":"M445.2,502.8 541.7,502.1 545.7,502.0 656.0,502.1 656.0,608.7 657.3,820.9 553.2,821.9 479.5,821.9 448.7,821.9 447.5,688.9 446.1,662.2 445.1,556.2 445.2,502.8Z","served":true,"cx":551,"cy":662},{"n":"MANISTEE","d":"M182.2,-35.7 185.1,-42.1 185.2,-42.2 192.8,-53.6 196.4,-63.1 196.5,-63.4 197.7,-66.5 198.8,-70.2 201.2,-78.8 208.5,-87.0 208.6,-87.4 212.1,-96.4 212.4,-97.2 213.2,-99.1 213.2,-99.3 213.4,-99.8 214.5,-102.1 214.9,-102.8 215.2,-103.6 218.4,-110.3 218.5,-110.6 220.4,-114.4 234.3,-137.0 241.7,-170.8 243.4,-183.0 243.3,-191.4 241.7,-201.6 241.8,-210.0 243.0,-220.7 243.0,-220.7 243.1,-220.8 245.3,-224.3 247.5,-232.1 249.8,-242.2 433.1,-238.9 431.7,-26.9 334.3,-28.6 182.2,-35.7Z","served":false,"cx":308,"cy":-135},{"n":"MASON","d":"M162.7,182.8 162.7,172.3 162.7,172.0 162.6,171.4 162.6,169.8 162.6,169.7 161.9,164.2 161.6,162.2 161.4,160.8 161.4,160.5 161.3,160.1 161.0,158.8 156.4,140.0 156.2,138.1 156.1,136.6 155.9,132.9 155.3,122.8 155.2,122.6 155.2,122.3 154.5,119.3 153.8,115.7 152.4,109.1 148.7,91.4 148.6,90.7 148.6,90.6 148.5,90.5 140.4,73.8 139.7,72.2 139.2,71.5 131.5,59.6 131.0,58.5 130.5,57.4 130.3,57.1 128.4,53.0 125.8,43.8 125.8,37.9 125.8,37.6 125.9,37.5 128.3,32.0 128.4,31.7 128.6,31.5 131.8,27.4 132.1,27.0 133.2,26.1 145.8,16.3 152.2,11.3 155.4,8.8 155.6,8.6 155.7,8.5 155.8,8.4 163.2,0.1 164.5,-1.9 165.0,-2.6 165.3,-3.0 166.9,-5.4 167.1,-5.8 176.1,-22.4 177.3,-25.1 177.7,-25.9 177.9,-26.4 182.2,-35.7 334.3,-28.6 335.6,183.0 336.1,185.1 169.1,182.7 162.7,182.8Z","served":true,"cx":231,"cy":75},{"n":"MUSKEGON","d":"M149.0,393.8 149.4,393.8 335.4,396.8 335.6,502.5 445.2,502.8 445.1,556.2 393.2,555.8 393.6,608.7 232.8,609.0 229.0,598.3 220.9,579.7 215.5,567.3 215.3,566.8 213.3,562.3 207.3,549.8 200.8,536.0 199.0,532.3 198.9,532.1 198.5,531.3 198.4,531.1 197.5,529.0 197.4,528.9 196.5,526.9 194.9,523.7 183.9,500.6 183.5,499.7 182.5,497.6 182.4,497.4 181.5,495.4 181.1,494.6 179.9,492.1 179.3,490.9 178.3,488.7 175.7,482.1 175.1,480.6 174.8,480.0 174.3,478.5 172.9,475.2 171.1,469.9 164.2,449.6 161.1,440.2 161.0,440.1 160.9,439.8 160.8,439.5 159.7,435.4 159.6,435.2 159.5,434.8 159.3,433.9 155.0,418.7 154.9,418.3 152.3,407.7 151.7,404.9 151.3,403.5 151.0,402.2 149.0,393.8Z","served":true,"cx":332,"cy":507},{"n":"OCEANA","d":"M149.0,393.8 146.1,381.8 146.1,381.8 146.0,381.6 142.5,370.8 142.3,370.1 141.7,368.4 141.4,367.6 141.3,367.4 140.6,365.9 140.4,365.5 140.3,365.3 140.1,364.9 139.8,364.2 139.8,364.2 129.7,343.5 128.2,340.3 128.2,340.2 126.9,337.5 126.1,335.8 125.6,335.0 125.3,334.3 125.1,333.9 124.9,333.5 124.6,332.8 124.1,331.7 123.5,330.6 123.4,330.3 123.4,330.3 119.3,320.1 115.6,306.5 115.3,305.5 115.2,304.0 115.1,303.9 115.1,303.1 115.0,302.4 115.0,302.3 114.3,296.0 114.3,295.5 114.3,294.9 114.3,290.3 114.3,289.0 114.4,288.5 115.2,281.5 115.3,280.4 115.5,280.0 119.2,269.4 119.4,268.8 120.1,267.8 120.5,267.3 124.4,261.2 125.2,260.1 126.0,258.9 127.4,256.7 127.7,256.2 128.9,254.7 129.3,254.1 130.2,253.0 130.9,252.2 131.0,252.0 131.5,251.4 134.0,248.2 137.4,243.8 138.0,243.0 140.3,240.1 140.8,239.3 140.8,239.3 141.0,239.1 148.4,228.2 149.3,227.0 149.7,226.0 156.3,212.2 156.5,211.8 156.6,211.5 157.5,208.6 159.8,201.5 159.9,201.0 162.7,185.1 162.7,184.8 162.7,182.9 162.7,182.8 169.1,182.7 336.1,185.1 335.4,396.8 149.4,393.8 149.0,393.8Z","served":true,"cx":225,"cy":290},{"n":"OTTAWA","d":"M445.1,556.2 446.1,662.2 447.5,688.9 448.7,821.9 260.7,822.3 259.8,812.4 259.4,782.4 259.9,766.6 258.4,751.8 257.5,730.2 253.0,688.1 250.2,671.4 245.1,650.8 242.5,646.0 242.3,640.2 240.5,630.2 232.8,609.0 393.6,608.7 393.2,555.8 445.1,556.2Z","served":true,"cx":341,"cy":689},{"n":"IONIA","d":"M656.0,608.7 865.7,608.7 865.6,820.5 761.1,820.3 657.3,820.9 656.0,608.7Z","served":false,"cx":761,"cy":715}],"lakes":[{"cx":224.9,"cy":535.0,"rx":10,"ry":4,"rot":0},{"cx":180.8,"cy":437.8,"rx":3,"ry":7,"rot":-35},{"cx":238.1,"cy":577.6,"rx":5,"ry":2,"rot":0},{"cx":167.6,"cy":206.7,"rx":3,"ry":2,"rot":0},{"cx":158.8,"cy":109.4,"rx":3,"ry":2,"rot":0}],"roads":[{"n":"US-31","major":true,"d":"M154.3,0.0 L154.3,100.3 L163.2,206.7 L194.0,255.4 L194.0,310.1 L200.7,373.3 L189.6,425.6 L220.5,498.6 L242.5,541.1 L238.1,577.6 L255.8,644.5 L286.6,760.0","lx":145.5,"ly":340.5,"anchor":"end"},{"n":"I-96","major":true,"d":"M242.5,541.1 L286.6,601.9 L352.8,626.2 L383.7,644.5 L449.8,681.0 L498.3,705.3 L639.5,729.6","lx":383.7,"ly":662.7,"anchor":"start"},{"n":"M-37","major":false,"d":"M498.3,705.3 L480.7,583.7 L463.0,498.6 L441.0,425.6 L454.2,346.6 L419.0,133.8 L419.0,0.0","lx":441.0,"ly":231.0,"anchor":"end"},{"n":"US-10","major":false,"d":"M154.3,100.3 L264.6,103.4 L419.0,133.8 L639.5,133.8","lx":286.6,"ly":115.5,"anchor":"start"},{"n":"M-46","major":false,"d":"M242.5,541.1 L379.3,565.4 L463.0,547.2 L551.2,547.2 L639.5,547.2","lx":595.3,"ly":538.1,"anchor":"end"},{"n":"M-120","major":false,"d":"M242.5,541.1 L280.0,462.1 L379.3,395.2","lx":313.1,"ly":431.7,"anchor":"start"},{"n":"M-82","major":false,"d":"M379.3,395.2 L441.0,425.6"},{"n":"M-20","major":false,"d":"M207.3,346.6 L335.2,334.4 L454.2,346.6 L639.5,346.6","lx":529.2,"ly":358.7,"anchor":"start"}],"scale":{"x":28,"y":728,"len":88,"label":"10 mi"},"lakeLabel":{"x":60,"y":470}};
