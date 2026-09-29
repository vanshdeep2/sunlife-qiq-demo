/**
 * Single source of truth for page names, menu subtitles and journey labels.
 * Nav, FlowBar and every page heading read from here so a rename happens in
 * one place. These names are QiQ product names, not client-specific, so every
 * client demo shares them.
 */
export const PAGES = {
  executive: {
    path: '/',
    title: 'Executive',
    sub: "What's happening, what it costs, and what's being done about it",
    flowLabel: 'Insight - Executive Intelligence',
  },
  voc: {
    path: '/voc',
    title: 'Voice of the Customer',
    sub: 'Public reviews, ratings and news, all real and linked',
  },
  operations: {
    path: '/operations',
    title: 'Operations Director',
    sub: 'Weekly trends, team performance, coaching queue',
    flowLabel: 'Action - Operations Director',
  },
  quality: {
    path: '/quality',
    title: 'Quality Diagnostics',
    sub: 'Which contacts look fine on QA but failed the customer',
    flowLabel: 'Diagnosis - Quality Diagnostics',
  },
  agent: {
    path: '/agent',
    title: 'Agent Coaching',
    sub: "Per-agent gaps and the coaching delivered",
    flowLabel: 'Learning - Agent Coaching',
  },
  search: {
    path: '/search',
    title: 'Contact Evidence',
    sub: 'Full proof behind any number, contact by contact',
  },
}

/** Order shown in the dropdown menu. */
export const MENU_ORDER = ['executive', 'voc', 'operations', 'quality', 'agent', 'search']

/** Order of the journey bar shown at the top of the flow pages. */
export const FLOW_ORDER = ['executive', 'operations', 'quality', 'agent']
