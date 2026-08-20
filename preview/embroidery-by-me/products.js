/* WeAddALogo — product catalog
   This file is the single seam for the rotating retail lineup.
   Swapping products = editing this array. In the live build, options and
   pricing flow straight into Stripe Checkout line items.
   Prices are from WeAddALogo's 2026 price list & current preorder flyers.
   Sizes shown are standard apparel ranges pending final confirmation.
   optionPrices lets an option adjust the unit price (e.g. Embroidery +$10). */

const EBM_ICONS = {
  crewneck: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 10c0 4 3.5 7 8 7s8-3 8-7l10 4 8 14-9 5-1-4v25H16V29l-1 4-9-5 8-14 10-4z"/><path d="M26 34h12" stroke-dasharray="2.5 3"/></svg>',
  hoodie: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 12c2-3 5-5 9-5s7 2 9 5l9 5 8 14-9 5-1-4v25H16V32l-1 4-9-5 8-14 9-5z"/><path d="M23 12c0 6 4 10 9 10s9-4 9-10"/><path d="M28 42v10M36 42v10"/></svg>',
  tee: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 10c0 3.5 3.5 6 8 6s8-2.5 8-6l11 5 6 11-8 5-2-3v26H17V28l-2 3-8-5 6-11 11-5z"/><rect x="25" y="28" width="14" height="12" rx="1.5" stroke-dasharray="2.5 3"/></svg>',
  longsleeve: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 10c0 3.5 3.5 6 8 6s8-2.5 8-6l11 5 5 10-7 4v25h-8V44H23v10h-8V29l-7-4 5-10 11-5z"/><rect x="26" y="26" width="12" height="10" rx="1.5" stroke-dasharray="2.5 3"/></svg>',
  cap: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 34c0-11 9-20 20-20s20 9 20 20v4H12v-4z"/><path d="M12 38c-3 0-5 2-4 5l2 3c8-2 16-3 22-3"/><path d="M32 14v24" stroke-dasharray="2.5 3"/></svg>',
  koozie: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 22h24v26a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6V22z"/><path d="M23 22c0-7 4-12 9-12s9 5 9 12"/><rect x="26" y="30" width="12" height="12" rx="2" stroke-dasharray="2.5 3"/></svg>'
};

const EBM_PRODUCTS = [
  {
    id: 'halloween-tee', icon: 'tee', badge: 'DTF', photo: 'img/work-halloween.jpg',
    name: 'Halloween in Leeds Tee', price: 20,
    desc: 'Spooky season, local pride. Leeds mark on the left chest, full-back "Halloween in Leeds" print. Preorders through Sept 1.',
    options: {
      'Size': ['S', 'M', 'L', 'XL', '2XL'],
      'Color': ['Ash', 'Tan', 'Kelly', 'White']
    }
  },
  {
    id: 'leeds-crewneck', icon: 'crewneck', badge: 'Embroidered', photo: 'img/work-crewneck.jpg',
    name: 'Embroidered LEEDS Sweatshirt', price: 40,
    desc: 'Classic look, lasting quality — big tonal LEEDS embroidery on a pigment-washed crewneck. Game day, events, gifts & everyday wear.',
    options: {
      'Size': ['S', 'M', 'L', 'XL', '2XL']
    }
  },
  {
    id: 'halloween-crewneck', icon: 'crewneck', badge: 'DTF',
    name: 'Halloween in Leeds Crewneck', price: 35,
    desc: 'The preorder favorite — cozy crewneck with the full-back "Halloween in Leeds" print. Preorders through Sept 1.',
    options: {
      'Size': ['S', 'M', 'L', 'XL', '2XL'],
      'Color': ['Ash', 'Tan', 'Kelly', 'White']
    }
  },
  {
    id: 'leeds-cap', icon: 'cap', badge: 'Embroidered',
    name: 'Embroidered LEEDS Cap', price: 20,
    desc: 'Retro two-tone cap with bold LEEDS embroidery on the crown.',
    options: {
      'Style': ['Cream / Forest']
    }
  },
  {
    id: 'halloween-longsleeve', icon: 'longsleeve', badge: 'DTF',
    name: 'Halloween in Leeds Long Sleeve', price: 25,
    desc: 'Same spooky front-and-back design, long-sleeve comfort for fall nights. Preorders through Sept 1.',
    options: {
      'Size': ['S', 'M', 'L', 'XL', '2XL'],
      'Color': ['Ash', 'Tan', 'Kelly', 'White']
    }
  },
  {
    id: 'dtf-koozie', icon: 'koozie', badge: 'DTF',
    name: 'Koozie with DTF', price: 3,
    desc: 'Your logo or design pressed on a koozie — perfect for game day and events.',
    options: {
      'Quantity note': ['Single', 'Ask about bulk']
    },
    personalize: { label: 'Design or text', placeholder: 'e.g. team logo, name' }
  },
  {
    id: 'custom-tee', icon: 'tee', badge: 'DTF',
    name: 'Custom DTF T-Shirt', price: 15,
    desc: 'Your design, pressed in full color. Artwork collected after checkout.',
    options: {
      'Size': ['S', 'M', 'L', 'XL', '2XL']
    },
    personalize: { label: 'Tell us about your design', placeholder: 'What are we printing?' }
  },
  {
    id: 'custom-longsleeve', icon: 'longsleeve', badge: 'DTF',
    name: 'Custom DTF Long Sleeve', price: 20,
    desc: 'Full-color DTF print on a long-sleeve tee. Artwork collected after checkout.',
    options: {
      'Size': ['S', 'M', 'L', 'XL', '2XL']
    },
    personalize: { label: 'Tell us about your design', placeholder: 'What are we printing?' }
  },
  {
    id: 'custom-sweatshirt', icon: 'crewneck', badge: 'Custom',
    name: 'Custom Sweatshirt', price: 30,
    desc: 'Your design on a crewneck sweatshirt — full-color DTF print, or upgrade to stitched embroidery.',
    options: {
      'Size': ['S', 'M', 'L', 'XL', '2XL'],
      'Decoration': ['DTF Print', 'Embroidery']
    },
    optionPrices: { 'Decoration': { 'Embroidery': 10 } },
    personalize: { label: 'Tell us about your design', placeholder: 'What are we adding?' }
  },
  {
    id: 'custom-hoodie', icon: 'hoodie', badge: 'Custom',
    name: 'Custom Hoodie', price: 35,
    desc: 'Your design on a cozy hoodie — full-color DTF print, or upgrade to stitched embroidery.',
    options: {
      'Size': ['S', 'M', 'L', 'XL', '2XL'],
      'Decoration': ['DTF Print', 'Embroidery']
    },
    optionPrices: { 'Decoration': { 'Embroidery': 10 } },
    personalize: { label: 'Tell us about your design', placeholder: 'What are we adding?' }
  }
];
