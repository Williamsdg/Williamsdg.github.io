/* Embroidery by Me — product catalog (SAMPLE DATA)
   This file is the single seam for the rotating retail lineup.
   Swapping products = editing this array. In the live build, options and
   pricing flow straight into Square Checkout line items.
   All products, prices, and options below are placeholders pending
   Embroidery by Me's real lineup. */

const EBM_ICONS = {
  crewneck: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 10c0 4 3.5 7 8 7s8-3 8-7l10 4 8 14-9 5-1-4v25H16V29l-1 4-9-5 8-14 10-4z"/><path d="M26 34h12" stroke-dasharray="2.5 3"/></svg>',
  hoodie: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 12c2-3 5-5 9-5s7 2 9 5l9 5 8 14-9 5-1-4v25H16V32l-1 4-9-5 8-14 9-5z"/><path d="M23 12c0 6 4 10 9 10s9-4 9-10"/><path d="M28 42v10M36 42v10"/></svg>',
  tee: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 10c0 3.5 3.5 6 8 6s8-2.5 8-6l11 5 6 11-8 5-2-3v26H17V28l-2 3-8-5 6-11 11-5z"/><rect x="25" y="28" width="14" height="12" rx="1.5" stroke-dasharray="2.5 3"/></svg>',
  cap: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 34c0-11 9-20 20-20s20 9 20 20v4H12v-4z"/><path d="M12 38c-3 0-5 2-4 5l2 3c8-2 16-3 22-3"/><path d="M32 14v24" stroke-dasharray="2.5 3"/></svg>',
  tote: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22h36l-3 32H17l-3-32z"/><path d="M24 22c0-6 3.5-11 8-11s8 5 8 11"/><path d="M26 36h12M26 42h12" stroke-dasharray="2.5 3"/></svg>',
  blanket: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="14" width="44" height="36" rx="4"/><path d="M10 42c6-3 12-3 18 0s12 3 18 0M10 34c6-3 12-3 18 0s12 3 18 0" stroke-dasharray="2.5 3"/></svg>',
  towel: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h28v48l-7-4-7 4-7-4-7 4V8z"/><path d="M25 20h14M25 27h14" stroke-dasharray="2.5 3"/></svg>',
  beanie: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 40c0-13 8-24 18-24s18 11 18 24"/><rect x="12" y="40" width="40" height="10" rx="3"/><circle cx="32" cy="13" r="3.5"/><path d="M20 40V30M28 40V27M36 40V27M44 40V30" stroke-dasharray="2.5 3"/></svg>',
  quarterzip: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 10c0 4 3.5 7 8 7s8-3 8-7l10 4 8 14-9 5-1-4v25H16V29l-1 4-9-5 8-14 10-4z"/><path d="M32 17v14"/><circle cx="32" cy="33" r="1.6"/><path d="M22 32h5" stroke-dasharray="2.5 3"/></svg>'
};

const EBM_PRODUCTS = [
  {
    id: 'crewneck', icon: 'crewneck', badge: 'Embroidered',
    name: 'Embroidered Crewneck', price: 42,
    desc: 'Heavyweight cotton-blend crewneck with your choice of stitched personalization.',
    options: {
      'Size': ['S', 'M', 'L', 'XL', '2XL'],
      'Color': ['Black', 'Cream', 'Navy'],
      'Embroidery': ['Initials', 'Name', 'Small Design'],
      'Placement': ['Left Chest', 'Center']
    },
    personalize: { label: 'Embroidery text', placeholder: 'e.g. EHW, or a name' }
  },
  {
    id: 'dad-hat', icon: 'cap', badge: 'Embroidered',
    name: 'Classic Dad Hat', price: 28,
    desc: 'Unstructured six-panel cap, stitched front and center.',
    options: {
      'Color': ['Khaki', 'Black', 'Washed Denim', 'White'],
      'Embroidery': ['Initials', 'Word or Name', 'Small Design']
    },
    personalize: { label: 'Embroidery text', placeholder: 'What should we stitch?' }
  },
  {
    id: 'tote', icon: 'tote', badge: 'Embroidered',
    name: 'Monogram Canvas Tote', price: 34,
    desc: 'Sturdy natural canvas tote with a classic single, double, or triple monogram.',
    options: {
      'Color': ['Natural', 'Black'],
      'Monogram Style': ['Single Initial', 'Three-Letter', 'Full Name']
    },
    personalize: { label: 'Monogram letters', placeholder: 'e.g. sEw' }
  },
  {
    id: 'quarter-zip', icon: 'quarterzip', badge: 'Embroidered',
    name: 'Quarter-Zip Pullover', price: 54,
    desc: 'Polished quarter-zip — a favorite for offices, teams, and gifts.',
    options: {
      'Size': ['S', 'M', 'L', 'XL', '2XL'],
      'Color': ['Heather Gray', 'Navy', 'Forest'],
      'Embroidery': ['Initials', 'Name', 'Logo (upload after checkout)']
    },
    personalize: { label: 'Embroidery text', placeholder: 'Initials or name' }
  },
  {
    id: 'baby-blanket', icon: 'blanket', badge: 'Embroidered',
    name: 'Baby Milestone Blanket', price: 38,
    desc: 'Plush keepsake blanket stitched with baby’s name and birthdate.',
    options: {
      'Color': ['Sage', 'Blush', 'Oat'],
      'Thread Color': ['White', 'Charcoal', 'Terracotta']
    },
    personalize: { label: 'Name + birthdate', placeholder: 'e.g. Charlie · 03.14.2026' }
  },
  {
    id: 'gameday-tee', icon: 'tee', badge: 'DTF',
    name: 'Game Day DTF Tee', price: 28,
    desc: 'Soft-style tee with a full-color DTF print — bold color, no cracking.',
    options: {
      'Size': ['S', 'M', 'L', 'XL', '2XL'],
      'Color': ['White', 'Sand', 'Black'],
      'Design': ['Current Drop A', 'Current Drop B', 'Current Drop C']
    }
  },
  {
    id: 'varsity-hoodie', icon: 'hoodie', badge: 'Embroidered',
    name: 'Varsity Initial Hoodie', price: 48,
    desc: 'Midweight fleece hoodie with an oversized chain-stitch varsity initial.',
    options: {
      'Size': ['S', 'M', 'L', 'XL', '2XL'],
      'Color': ['Black', 'Cream', 'Forest'],
      'Thread Color': ['Cream', 'Terracotta', 'Sage']
    },
    personalize: { label: 'Varsity initial', placeholder: 'One letter' }
  },
  {
    id: 'towel-set', icon: 'towel', badge: 'Embroidered',
    name: 'Linen Kitchen Towel Set (2)', price: 26,
    desc: 'Two linen-blend towels with a monogram — a go-to hostess and wedding gift.',
    options: {
      'Color': ['Oat', 'White'],
      'Monogram Style': ['Single Initial', 'Three-Letter']
    },
    personalize: { label: 'Monogram letters', placeholder: 'e.g. W' }
  },
  {
    id: 'beanie', icon: 'beanie', badge: 'Embroidered',
    name: 'Embroidered Beanie', price: 26,
    desc: 'Ribbed cuffed beanie, stitched on the fold.',
    options: {
      'Color': ['Black', 'Oat', 'Rust'],
      'Embroidery': ['Initials', 'Word or Name']
    },
    personalize: { label: 'Embroidery text', placeholder: 'What should we stitch?' }
  },
  {
    id: 'photo-tee', icon: 'tee', badge: 'DTF',
    name: 'Custom Photo DTF Tee', price: 32,
    desc: 'Your photo or artwork, printed edge-to-edge in full color. Artwork collected after checkout.',
    options: {
      'Size': ['S', 'M', 'L', 'XL', '2XL'],
      'Color': ['White', 'Sand', 'Black'],
      'Print Size': ['Standard (10")', 'Large (12")']
    }
  }
];
