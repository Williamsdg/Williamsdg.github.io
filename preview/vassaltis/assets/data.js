/* ==========================================================================
   VASSALTIS — verified public content
   Source: vassaltis.com + club.vassaltis.com, read 2026-09-16.
   Everything here is quoted or closely paraphrased from their own pages.
   Anything NOT published by Vassaltis is marked confirm:true and renders
   as a "To confirm" note in the preview. Do not add facts without a source.
   ========================================================================== */
window.VX = window.VX || {};

VX.contact = {
  winery: { name: 'Vassaltis Vineyards', address: 'Vourvoulos–Oia peripheral road, 847 00 Santorini, Greece', phone: '+30 22860 22211', tel: '+302286022211', email: 'info@vassaltis.com', hours: '11:00–20:00' },
  athens: { name: 'Vassaltis Downtown', address: 'Eschilou 44, Psyrri, Athens', phone: '+30 22860 22211', tel: '+302286022211' },
  hotel:  { name: 'The Vasilicos', url: 'https://www.thevasilicos.com/' },
  club:   'https://club.vassaltis.com/',
  post:   'https://club.vassaltis.com/vassaltis-post/'
};

const IHOST = 'https://www.i-host.gr/reservations/new?restaurant=713&channel=website&categories=';

VX.experiences = [
  { id: 'tasting', kind: 'Wine experience', name: 'Vassaltis Tasting', price: 40, unit: 'per person',
    short: '4 wines & 4 bites',
    body: 'Current vintages and rare vinifications with a focus on Assyrtiko. Each wine is paired with a bite designed for it.',
    schedule: null, duration: null, group: null,
    img: 'img/flight-bites.jpg', book: IHOST + 'SsdfRsAjSXueI5NjC3Hr2w' },
  { id: 'cellar', kind: 'Wine experience', name: 'Cellar Tour', price: 30, unit: 'per person',
    short: 'Tour & 4 wines',
    body: 'An intimate tour of the cellar: how the wines are made and the facilities behind them, followed by a tasting in the tasting room.',
    schedule: 'Daily, 16:00–17:00', duration: '1 hour', group: 'Up to 12 guests',
    img: 'img/barrels.jpg', book: IHOST + 'Nbl7HUKKQ9iHEv8f5eP_vw&lang=eng' },
  { id: 'lunch', kind: 'Lunch', name: 'Lunch to Share', price: 55, unit: 'per person',
    short: 'Three-course menu to share & 3 wines',
    body: 'Three courses designed for sharing, each with a 75ml pour of three Vassaltis wines. Dishes can be adjusted for groups of three.',
    schedule: 'Daily', duration: null, group: null,
    img: 'img/table-sea.jpg', book: IHOST + 'E-WVmGxeTreRYE8UOmOW8g' },
  { id: 'whole', kind: 'Lunch', name: 'The Whole Experience', price: 90, unit: 'per person',
    short: 'Winery tour, four-course lunch & four wines',
    body: 'A guided winery tour with the sommeliers, then a four-course lunch paired with four wines. Allergies and dietary needs can be accommodated with advance notice.',
    schedule: null, duration: null, group: null,
    img: 'img/plate-top.jpg', book: IHOST + '-a9j9ySfTuSWf2sUevS-8g' },
  { id: 'dinner', kind: 'Dinner', name: 'Dinner Degustation', price: 85, unit: 'per person',
    short: 'Five-course tasting menu',
    body: 'A single seating under night views of the stars and sea. Add a wine pairing, or choose bottles from the list.',
    extra: 'Wine pairing +€35 or +€55',
    schedule: 'Tue, Thu & Sat · 20:00–22:00', duration: '2 hours', group: null,
    img: 'img/bowl.jpg', book: IHOST + 'x_hp2OJhR6iQO9O3tunzpQ' }
];

VX.wines = [
  { id: 'petnat', name: 'PetNat', style: 'Pétillant naturel', grape: '100% Savvatiano', color: '#C95B5B', type: 'Sparkling',
    lede: 'Tradition and innovation in one bottle: a semi-sparkling wine made by the ancestral method, the oldest known way to make sparkling wine.',
    notes: 'Citrus, stone fruit and melon with pastry, floral and honeyed notes; an elegant mousse and subtle acidity.',
    making: 'Fermentation begins in stainless steel, then the still-fermenting wine is bottled under crown cap to finish. The trapped CO₂ gives a gentle fizz. Unfiltered, so slightly cloudy.',
    sheet: { year: '2024', url: 'https://vassaltis.com/wp-content/uploads/2025/05/Pet-Nat-2024-Fact-Sheet.pdf' } },
  { id: 'nassitis', name: 'Nassitis', style: 'White blend', grape: 'Assyrtiko · Aidani · Athiri', color: '#8FCDB0', type: 'White',
    lede: 'Santorini’s three principal white grapes brought together: perhaps the wine that best represents the island.',
    notes: 'Jasmine blossom, stone and tropical fruit on the nose; a palate led by Assyrtiko’s racy, volcanic minerality.',
    making: 'Aidani and Athiri give the explosive bouquet; Assyrtiko gives the structure. A balanced summer wine, always under the volcanic character of Santorini.',
    sheet: { year: '2023', url: 'https://vassaltis.com/wp-content/uploads/2024/05/Nassitis-2023-Fact-Sheet.pdf' } },
  { id: 'aidani', name: 'Aidani', style: 'Single variety', grape: '100% Aidani', color: '#A9C3DA', type: 'White',
    lede: 'Just 30 hectares of Aidani grow on the island. Vassaltis only bottles it on its own in especially good vintages.',
    notes: 'Jasmine and orange blossom with tropical fruit, soft herbs and a streak of salinity; a fulsome texture and refreshing finish.',
    making: 'Fermented in stainless steel and rested on the lees, without bâtonnage, for seven months. Made in 2015, 2017, 2018, 2020 and 2022.',
    tastingRoomOnly: true,
    sheet: { year: null, url: 'https://vassaltis.com/wp-content/uploads/2023/08/Vassaltis-Fact-Sheet-Aidani.pdf' } },
  { id: 'santorini', name: 'Santorini', style: 'PDO Santorini', grape: '100% Assyrtiko', color: '#3A3B3C', type: 'White',
    lede: 'The first wine Vassaltis ever made, and its signature expression of Assyrtiko.',
    notes: 'Basalt and pumice with ripe tropical fruit, honeysuckle and sea spray; salty green fruit, high minerality and a long citrus finish.',
    making: 'Hand-harvested from Imerovigli, Vourvoulos and Megalochori, many vines over 60 years old. Whole-bunch pressed, fermented in steel, seven months on fine lees.',
    sheet: { year: '2024', url: 'https://vassaltis.com/wp-content/uploads/2025/05/Santorini-2024-Fact-Sheet.pdf' } },
  { id: 'gramina', name: 'Gramina', style: 'Cuvée des Vignerons', grape: 'Assyrtiko · single plot, Vourvoulos', color: '#2F3A3A', type: 'White',
    lede: 'From the Latin for “field”: one very special plot in Vourvoulos, and a wine about somewhereness.',
    notes: 'Full-bodied and concentrated: intense mineral and smoky character with ripe citrus, stone fruit, flowers, toast and saline.',
    making: 'Picked before sunrise and pressed within two hours. Twelve months on lees after steel fermentation, then seven more months in bottle.',
    sheet: { year: '2023', url: 'https://vassaltis.com/wp-content/uploads/2025/05/Gramina2023-Fact-Sheet.pdf' } },
  { id: 'alcyone', name: 'Alcyone', style: 'Cuvée Mythologique', grape: 'Assyrtiko', color: '#2F6B3E', type: 'White',
    lede: 'Named for the daughter of Aeolus who calmed rough seas, a wine that tames the immense power of Assyrtiko.',
    notes: 'Elegant and layered: Assyrtiko’s minerality, structure from oak and an expressive side from cement, with long ageing potential.',
    making: 'Selected plots in Vourvoulos, Pyrgos and Megalochori. Partially fermented in large oak vats and cement tanks, then aged in 500-litre barrels with regular bâtonnage.',
    sheet: { year: '2023', url: 'https://vassaltis.com/wp-content/uploads/2025/05/Alcyone-2023-Fact-Sheet.pdf' } },
  { id: 'plethora', name: 'Plethora', style: 'Oxidative Assyrtiko', grape: 'Overripe Assyrtiko', color: '#B08A4E', type: 'White',
    lede: 'The Vassaltis philosophy in a bottle: respect for the past, eyes on the modern. An offering to the winemakers who passed the baton.',
    notes: 'Citrus peel, sea salt, flowers and dried herbs; briny, racy acidity with the nutty, mushroom notes of age.',
    making: 'Overripe bunches fermented in steel, then twelve months in barrels left un-topped for gentle oxidation. Two further years in bottle before release.',
    noPackshot: true,
    sheet: { year: '2021', url: 'https://vassaltis.com/wp-content/uploads/2025/05/Plethora-2021-Fact-Sheet.pdf' } },
  { id: 'vassanos', name: 'Vassanos', style: 'Mandilaria', grape: '100% Mandilaria', color: '#B7A0CB', type: 'Red',
    lede: 'Vassaltis means basalt. Vassanos, from the same rock, came to mean hardship: a testament to taming a difficult grape.',
    notes: 'High acidity, medium body and rich tannins; a red representative of the Santorini terroir.',
    making: 'Fermented with indigenous yeasts, then 24 months in 500-litre American oak barrels to soften a grape that struggles to ripen in volcanic soil.',
    sheet: { year: '2019', url: 'https://vassaltis.com/wp-content/uploads/2025/05/Vassanos-2019-Fact-Sheet.pdf' } },
  { id: 'mavrotragano', name: 'Mavrotragano', style: 'Limited bottling', grape: '100% Mavrotragano', color: '#AF4A4E', type: 'Red',
    lede: 'An enigma: thick-skinned, tannic and full-bodied, the opposite of what you’d expect from an island red.',
    notes: 'Cherries, black currants and plums with minerality, forest floor and black tea; smooth tannins and a long finish.',
    making: 'Whole-cluster maceration and fermentation on indigenous yeasts, then twelve months in oak to round out the grape’s gritty tannins.',
    sheet: { year: '2022', url: 'https://vassaltis.com/wp-content/uploads/2025/05/Mavrotragano-2022-Fact-Sheet.pdf' } },
  { id: 'vinsanto', name: 'Vinsanto', style: 'Naturally sweet', grape: 'Sun-dried grapes', color: '#DE7B4F', type: 'Sweet',
    lede: 'A wine of love and patience, made on Santorini since around the 12th century. Vassaltis’s own journey began in 2017.',
    notes: 'Less sugar, less volatile acidity, more ethereal aromas: sapidity, finesse and elegance. “A Vinsanto like no other.”',
    making: 'Grapes hang past harvest, then dry under the sun. The concentrated juice is vinified and aged for several years in barrel.',
    sheet: { year: '2020', url: 'https://vassaltis.com/wp-content/uploads/2025/05/Vinsanto-2020-Fact-Sheet.pdf' } }
];

VX.team = [
  { name: 'Yannis Valambous', role: 'Founder', img: 'img/p-yiannis-valambous.jpg', bio: 'Left a career in finance in London in 2010 to revive the vineyards his late father left him. Today Vassaltis is his life — from harvest to marketing.' },
  { name: 'Yannis Papaeconomou', role: 'Oenologist', img: 'img/p-yiannis-papaeconomou.jpg', bio: 'Studied oenology in Athens and made wine in Chile, France and New Zealand before joining at the very beginning.' },
  { name: 'Elias Roussakis', role: 'Consulting agronomist', img: 'img/p-ilias-roussakis.jpg', bio: 'The first on the ground in 2010. Born on Santorini, trained in Athens and Montpellier, and the one who persuaded Yannis to build a winery.' },
  { name: 'Artemis Kardoula', role: 'Hospitality manager', img: 'img/p-artemis-kardoula.jpg', bio: 'The face of Vassaltis on Santorini, and the person to ask about food and wine pairing.' },
  { name: 'Maria Papida', role: 'Sales manager, Athens', img: 'img/p-maria-papida.jpg', bio: 'Studied winemaking in Athens and wine marketing in Bordeaux; with Vassaltis since 2021.' },
  { name: 'Kiriaki Katsipi', role: 'Office', img: 'img/p-kiriaki-katsipi.jpg', bio: 'A native Santorinian and the winery’s jack-of-all-trades.' }
];

VX.post = [
  { n: 9, season: 'Summer 2025', en: 'https://club.vassaltis.com/wp-content/uploads/2025/07/9-Vassaltis-ENG-Newspaper-July-2025-v3.pdf', el: 'https://club.vassaltis.com/wp-content/uploads/2025/07/9-Vassaltis-GRE-Newspaper-July-2025-v3.pdf' },
  { n: 8, season: 'Winter 2025', en: 'https://club.vassaltis.com/wp-content/uploads/2025/01/8-Vassaltis-ENG-Newspaper-Jan-2025-v4.pdf', el: 'https://club.vassaltis.com/wp-content/uploads/2025/01/8-Vassaltis-GRE-Newspaper-Jan-2025-v3.pdf' },
  { n: 7, season: 'Summer 2024', en: 'https://club.vassaltis.com/wp-content/uploads/2024/07/Vassaltis-Post-Issue-7-ENG.pdf', el: 'https://club.vassaltis.com/wp-content/uploads/2024/07/Vassaltis-Post-Issue-7-GR.pdf' },
  { n: 6, season: 'Winter 2024', en: 'https://club.vassaltis.com/wp-content/uploads/2024/04/6-Vassaltis-Newspaper-Feb-2024-v7.pdf', el: 'https://club.vassaltis.com/wp-content/uploads/2024/04/6-Vassaltis-GRE-Newspaper-Feb-2024-v4.pdf' },
  { n: 5, season: 'Autumn 2023', en: 'https://club.vassaltis.com/wp-content/uploads/2024/02/Vassaltis-Post-issue-5-1-1.pdf', el: 'https://club.vassaltis.com/wp-content/uploads/2024/02/Vassaltis-Post-issue-5-GR.pdf' },
  { n: 4, season: 'Spring 2023', en: 'https://club.vassaltis.com/wp-content/uploads/2024/02/Vassaltis-Post-issue-4-1.pdf', el: 'https://club.vassaltis.com/wp-content/uploads/2024/02/Vassaltis-Post-issue-4-GR.pdf' },
  { n: 3, season: 'Winter 2023', en: 'https://club.vassaltis.com/wp-content/uploads/2024/02/Vassaltis-Post-issue-3-2.pdf', el: 'https://club.vassaltis.com/wp-content/uploads/2024/02/Vassaltis-Post-issue-3-GR-1-1.pdf' },
  { n: 2, season: 'Autumn 2022', en: 'https://club.vassaltis.com/wp-content/uploads/2024/02/Vassaltis-Post-issue-2-1.pdf', el: 'https://club.vassaltis.com/wp-content/uploads/2024/02/Vassaltis-Post-issue-2-GR.pdf' },
  { n: 1, season: 'Summer 2022', en: 'https://club.vassaltis.com/wp-content/uploads/2024/02/Vassaltis-Post-issue-1-1.pdf', el: null }
];

VX.vintageReports = ['2024','2023','2022','2021','2020','2019','2018','2017','2016'].map(y => ({ year: y, url: `https://vassaltis.com/wp-content/uploads/2024/11/Vintage-Report-${y}.pdf` }));

VX.wine = id => VX.wines.find(w => w.id === id);
VX.exp = id => VX.experiences.find(e => e.id === id);
VX.bottle = w => w.noPackshot ? null : `img/bottle-${w.id}.webp`;
