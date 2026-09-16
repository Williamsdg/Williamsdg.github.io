/* Aldridge & Vance v2 — deterministic fictional demo data.
   Everything here is sample content for a concept project. Nothing is legal advice. */
window.AV = {
  storagePrefix: 'v2-aldridge-vance-',

  firm: {
    name: 'Aldridge & Vance',
    email: 'introductions@example.com',
    phone: '(555) 010-0148',
    address: '00 Sample Row, Suite 2 (fictional address)'
  },

  people: [
    {
      id: 'aldridge',
      name: 'Helen Aldridge',
      role: 'Attorney (fictional)',
      areas: ['disputes', 'contracts', 'employment'],
      note: 'Usually takes the first conversation when a business relationship has gone wrong or an employee issue has come up.'
    },
    {
      id: 'vance',
      name: 'Samuel Vance',
      role: 'Attorney (fictional)',
      areas: ['estates', 'property', 'formation'],
      note: 'Usually takes the first conversation about settling an estate, a property purchase or lease, or setting up an owner agreement.'
    }
  ],

  areas: [
    {
      id: 'disputes',
      n: 1,
      title: 'Business & partnership disputes',
      short: 'When co-owners disagree about money, control, or whether to carry on.',
      standfirst: 'Disagreements between co-owners are common, and most are settled without a trial. This guide explains how such a matter usually moves, in plain terms.',
      summary: 'Covers disagreements between partners, LLC members, or shareholders of small companies: access to records, distributions, decision-making deadlock, a partner leaving, or a proposed buy-out.',
      covers: [
        'Disagreements over profit distributions, draws, or capital contributions.',
        'Deadlock on major decisions, or one owner acting without the others.',
        'A co-owner who wants to leave, or whom the others want to buy out.',
        'Requests to see the company’s books and records.'
      ],
      questions: [
        ['Do we have to go to court?', 'Not necessarily. Many owner disputes end with a negotiated agreement or mediation. Whether a court filing is ever appropriate depends on facts only an attorney who has reviewed the matter can assess.'],
        ['Does it matter that we never signed an operating agreement?', 'It changes which rules apply to the business, but it does not mean nothing can be done. An attorney can explain what applies in your situation.'],
        ['Can the business keep running while this is sorted out?', 'Often, yes. Keeping ordinary operations steady is usually one of the first things discussed.']
      ],
      prepare: [
        'The formation documents you have (articles, operating or partnership agreement, bylaws).',
        'A short list of the people and businesses involved, for the conflict check.',
        'Recent financial statements, if you already have access to them.',
        'A plain timeline of what happened, kept to yourself until you have engaged a lawyer.'
      ],
      resolution: ['Negotiated agreement', 'Mediation', 'Court filing, if needed'],
      people: ['aldridge'],
      scenario: 'partner'
    },
    {
      id: 'estates',
      n: 2,
      title: 'Estate & trust administration',
      short: 'Settling the affairs of someone who has died, step by step.',
      standfirst: 'Settling a parent’s or spouse’s estate is paperwork-heavy and often emotional. This guide sets out the usual order of things so the next step is always clear.',
      summary: 'Covers helping executors, trustees, and family members gather assets, notify the right parties, handle probate filings where needed, pay final bills, and distribute property.',
      covers: [
        'Working out whether a probate court process is needed at all.',
        'Supporting a named executor or successor trustee through their duties.',
        'Inventories, notices to creditors, and final accounting.',
        'Distributing property and closing the estate or trust.'
      ],
      questions: [
        ['Is there a deadline to start?', 'Some steps can be time-sensitive. An attorney can tell you whether any deadlines apply to your situation once they know the details.'],
        ['What if there was no will?', 'Estates without a will are still settled; different rules decide who inherits. The process is explained in a first conversation.'],
        ['Do I have to pay the estate’s debts myself?', 'This is a common worry. The answer depends on the facts, so it is best discussed with an attorney before paying anything out of pocket.']
      ],
      prepare: [
        'A copy of the will or trust document, if one exists.',
        'Several certified copies of the death certificate.',
        'A rough list of accounts, property, and regular bills you know about.',
        'Names of other family members or beneficiaries, for the conflict check.'
      ],
      resolution: ['Informal settlement', 'Probate administration', 'Court guidance, if contested'],
      people: ['vance'],
      scenario: 'estate'
    },
    {
      id: 'contracts',
      n: 3,
      title: 'Contract enforcement',
      short: 'When a customer, supplier, or vendor isn’t doing what they agreed to.',
      standfirst: 'Unpaid invoices, missed deliveries, and work left half done. This guide describes how a business contract problem is usually approached, from the first letter onward.',
      summary: 'Covers unpaid invoices, missed deliveries, incomplete work, and disagreements about what a contract requires — whether your business is owed or is being asked to pay.',
      covers: [
        'Unpaid invoices and amounts owed under service or supply agreements.',
        'Work or goods that were not delivered as agreed.',
        'Disagreements about what a contract actually says.',
        'Claims made against your business under a contract.'
      ],
      questions: [
        ['Is an email agreement a contract?', 'Sometimes. Whether informal agreements are enforceable depends on the circumstances, which an attorney can review.'],
        ['Should I stop performing my side?', 'Stopping can have consequences. It is worth speaking with an attorney before changing what you are doing under the agreement.'],
        ['Is it worth pursuing a small amount?', 'That is a cost-and-benefit question you will discuss openly in a first conversation; the answer is different for every business.']
      ],
      prepare: [
        'The contract, or the emails, quotes, and invoices that make up the agreement.',
        'Any notices or letters either side has already sent.',
        'The names of the businesses and people involved, for the conflict check.'
      ],
      resolution: ['Demand & negotiation', 'Mediation or arbitration', 'Court filing, if needed'],
      people: ['aldridge'],
      scenario: 'contract'
    },
    {
      id: 'property',
      n: 4,
      title: 'Commercial real estate transactions',
      short: 'Buying, selling, or leasing property for a business.',
      standfirst: 'A lease or purchase is usually the largest commitment a small business makes. This guide explains the stages of a transaction and where legal review tends to fit.',
      summary: 'Covers purchase agreements, letters of intent, commercial leases, due-diligence review, and closings for offices, shops, warehouses, and small mixed-use buildings.',
      covers: [
        'Reviewing or negotiating letters of intent and purchase agreements.',
        'Commercial leases for tenants and small landlords.',
        'Title, survey, and zoning questions raised during due diligence.',
        'Preparing for and completing a closing.'
      ],
      questions: [
        ['When should a lawyer see the lease?', 'Ideally before anything is signed, including a letter of intent, since early terms tend to carry through.'],
        ['Is a standard lease really standard?', 'Printed forms are a starting point. Which terms are negotiable varies from deal to deal.'],
        ['Do you handle the loan?', 'This demo firm reviews the transaction documents; lenders and brokers play separate roles.']
      ],
      prepare: [
        'The property address or listing, and any letter of intent.',
        'The draft lease or purchase agreement, if you have one.',
        'Your target dates for signing, opening, or closing.',
        'Names of the other parties and brokers, for the conflict check.'
      ],
      resolution: ['Signed lease', 'Closing', 'Walk away before commitment'],
      people: ['vance'],
      scenario: 'property'
    },
    {
      id: 'employment',
      n: 5,
      title: 'Employment matters for small employers',
      short: 'Complaints, separations, and policies for companies with a small team.',
      standfirst: 'Small employers rarely have an HR department. This guide explains how a workplace complaint or separation is usually handled once a lawyer is involved.',
      summary: 'Covers internal complaints, agency letters or charges, separations, handbook and policy review, and worker classification questions for owner-run companies.',
      covers: [
        'Responding to an internal complaint from an employee.',
        'Letters or charges from a government agency or an employee’s attorney.',
        'Planning a separation or a reduction in staff.',
        'Handbooks, offer letters, and contractor classification.'
      ],
      questions: [
        ['Should I talk to the employee who complained?', 'How and when to communicate matters. It is sensible to speak with an attorney before taking steps that affect the employee.'],
        ['We received a letter from an agency. What now?', 'Such letters often include response dates. Share it with an attorney promptly so they can explain what it asks for.'],
        ['Do the rules depend on company size?', 'Some do. Headcount is one of the first things an attorney will ask about.']
      ],
      prepare: [
        'Your current handbook or written policies, if any.',
        'Any letter, charge, or notice you have received.',
        'Your approximate headcount — without employee names in any web form.'
      ],
      resolution: ['Internal resolution', 'Agency response', 'Negotiated separation or litigation'],
      people: ['aldridge'],
      scenario: 'employee'
    },
    {
      id: 'formation',
      n: 6,
      title: 'Business formation & owner agreements',
      short: 'Setting a new company up so owners know the rules before they need them.',
      standfirst: 'Many of the disputes in this journal begin with an agreement that was never written. This guide covers setting up a company and its owner agreements.',
      summary: 'Covers choosing an entity type, operating and shareholder agreements, buy-sell terms, and updating documents when an owner joins or leaves.',
      covers: [
        'Choosing and forming an entity with your accountant’s input.',
        'Operating, partnership, and shareholder agreements.',
        'Buy-sell terms for death, disability, or departure of an owner.',
        'Updating documents when ownership changes.'
      ],
      questions: [
        ['Can we use an online template?', 'Templates can be a starting point, but they may not reflect how your owners actually intend to work together.'],
        ['When should we write a buy-sell agreement?', 'Owners usually find it easier to agree terms while everyone is getting along.'],
        ['Do you work with our accountant?', 'Formation decisions often involve tax questions, so coordination with your accountant is typical.']
      ],
      prepare: [
        'The names of all intended owners, for the conflict check.',
        'How you expect to share contributions, profits, and decisions.',
        'Contact details for your accountant, if you have one.'
      ],
      resolution: ['Signed agreements', 'Filed formation documents', 'Periodic review'],
      people: ['vance'],
      scenario: 'other'
    }
  ],

  /* Scenario selector — each routes to a guide, next steps, and tailored form questions. */
  scenarios: [
    {
      id: 'partner',
      label: 'A business partner dispute',
      hint: 'Co-owners disagree about money, control, or the future.',
      area: 'disputes',
      next: [
        'You send a short introductory request — no confidential details.',
        'The firm runs a conflict check on the names of the owners and the business.',
        'A brief introductory call to see whether the firm can help, and what engagement would involve.',
        'If you engage the firm, an attorney reviews the governing documents and financial records.',
        'Together you choose a path: negotiation, mediation, or — only if needed — a court filing.'
      ],
      fields: [
        { id: 'role', type: 'radio', label: 'Your role in the business', required: true, options: ['Owner or partner', 'Manager, not an owner', 'Other'] },
        { id: 'entity', type: 'select', label: 'Type of business', required: true, options: ['LLC', 'Partnership', 'Corporation', 'Not sure'] },
        { id: 'agreement', type: 'radio', label: 'Is there a written operating or partnership agreement?', required: true, options: ['Yes', 'No', 'Not sure'] },
        { id: 'goal', type: 'select', label: 'What would a good outcome look like to you?', required: false, options: ['Keep working together', 'A buy-out', 'Wind the business down', 'Not sure yet'] }
      ]
    },
    {
      id: 'estate',
      label: 'Settling a parent’s estate',
      hint: 'A family member has died and affairs need settling.',
      area: 'estates',
      next: [
        'You send a short introductory request — no confidential details.',
        'The firm runs a conflict check on the names of the family members involved.',
        'An introductory call to walk through the usual order of steps and what engagement would involve.',
        'If you engage the firm, an attorney reviews the will or trust and a list of known assets.',
        'The estate is settled informally or through probate, then closed.'
      ],
      fields: [
        { id: 'relation', type: 'radio', label: 'Your relationship to the person who died', required: true, options: ['Child', 'Spouse', 'Named executor or trustee', 'Other'] },
        { id: 'docs', type: 'select', label: 'Did they leave a will or trust?', required: true, options: ['A will', 'A trust', 'Both', 'Neither', 'Not sure'] },
        { id: 'probate', type: 'radio', label: 'Has anyone opened a probate case?', required: true, options: ['Yes', 'No', 'Not sure'] }
      ]
    },
    {
      id: 'contract',
      label: 'A contract someone isn’t honoring',
      hint: 'Unpaid invoices, missed deliveries, unfinished work.',
      area: 'contracts',
      next: [
        'You send a short introductory request — no confidential details.',
        'The firm runs a conflict check on the other business’s name.',
        'An introductory call to understand the agreement in outline and discuss engagement.',
        'If you engage the firm, an attorney reviews the contract and correspondence.',
        'Usually a written demand and negotiation first; mediation, arbitration, or a filing if that fails.'
      ],
      fields: [
        { id: 'side', type: 'radio', label: 'Which describes your business?', required: true, options: ['We are owed something', 'We are being asked to pay or perform', 'Not sure'] },
        { id: 'form', type: 'select', label: 'How was the agreement made?', required: true, options: ['A signed written contract', 'Emails, quotes, or invoices', 'Verbally', 'Not sure'] },
        { id: 'range', type: 'select', label: 'Approximate amount involved', required: false, options: ['Under $10,000', '$10,000–$50,000', '$50,000–$250,000', 'Over $250,000', 'Prefer not to say'] }
      ]
    },
    {
      id: 'property',
      label: 'Buying or leasing commercial property',
      hint: 'An office, shop, warehouse, or small building.',
      area: 'property',
      next: [
        'You send a short introductory request — no confidential details.',
        'The firm runs a conflict check on the other party and any brokers.',
        'An introductory call about timing, the documents so far, and engagement terms.',
        'If you engage the firm, an attorney reviews the letter of intent, lease, or purchase agreement.',
        'Negotiated terms lead to a signed lease or a closing — or a decision to walk away.'
      ],
      fields: [
        { id: 'deal', type: 'radio', label: 'What are you doing?', required: true, options: ['Buying', 'Selling', 'Leasing as a tenant', 'Leasing as a landlord'] },
        { id: 'ptype', type: 'select', label: 'Type of property', required: true, options: ['Office', 'Retail', 'Warehouse or industrial', 'Mixed-use', 'Land'] },
        { id: 'stage', type: 'select', label: 'Where are things now?', required: true, options: ['Still looking', 'Letter of intent drafted or signed', 'Draft lease or contract in hand', 'Already under contract'] }
      ]
    },
    {
      id: 'employee',
      label: 'An employee complaint at my company',
      hint: 'A complaint, an agency letter, or a separation.',
      area: 'employment',
      next: [
        'You send a short introductory request — no employee names or details.',
        'The firm runs a conflict check on the company name and, later, the people involved.',
        'An introductory call to understand the kind of issue and discuss engagement.',
        'If you engage the firm, an attorney reviews your policies and any letter you received.',
        'The matter is resolved internally, through an agency response, or by negotiation.'
      ],
      fields: [
        { id: 'size', type: 'select', label: 'Approximate number of employees', required: true, options: ['1–14', '15–49', '50–99', '100 or more'] },
        { id: 'kind', type: 'radio', label: 'What kind of issue is it?', required: true, options: ['Internal complaint', 'Letter from an agency or attorney', 'Planning a separation', 'Policy or handbook review'] },
        { id: 'letter', type: 'radio', label: 'Is there a response date on any letter you received?', required: false, options: ['Yes', 'No', 'No letter received'] }
      ]
    },
    {
      id: 'other',
      label: 'Something else',
      hint: 'Not listed, or not sure which guide fits.',
      area: null,
      next: [
        'You send a short introductory request describing the topic in general terms.',
        'The firm checks whether the matter is one it handles, and runs a conflict check.',
        'If it is not, you are told so promptly — this demo firm does not refer to specific outside lawyers.',
        'If it is, an introductory call to discuss the matter and engagement terms.'
      ],
      fields: [
        { id: 'topic', type: 'select', label: 'Closest topic', required: true, options: ['Business & partnership disputes', 'Estate & trust administration', 'Contract enforcement', 'Commercial real estate transactions', 'Employment matters for small employers', 'Business formation & owner agreements', 'Not sure'] },
        { id: 'general', type: 'textarea', label: 'Describe the topic in one sentence', required: true, max: 160, help: 'Keep it general — no names, dates, account numbers, or confidential facts.' }
      ]
    }
  ],

  stages: [
    ['Intake', 'A short request tells the firm, in general terms, what the matter is about.'],
    ['Conflict check', 'Names of the people and businesses involved are checked before any details are shared.'],
    ['Engagement', 'If the firm can help, scope and terms are set out in a written engagement letter.'],
    ['Document review', 'The attorney reads what exists — agreements, records, letters — and asks questions.'],
    ['Resolution path', 'You decide together how to proceed. Paths differ by matter.']
  ]
};
