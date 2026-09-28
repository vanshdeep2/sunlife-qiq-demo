/**
 * Cross-VOC page constants from story-spec.json. Sun Life (Canada) is
 * one-sided - "member" for the demand side, "claim" for the transaction, no
 * supply-side content anywhere. Contact-centre figures are illustrative and
 * synthetic, but the external VOC below is real: Sun Life's own Trustpilot
 * profile for sunlife.ca (1.2 stars, 428 reviews, 120 read in full), app-store
 * ratings, and CBC / industry coverage of CDCP pre-authorization denials.
 * Storyline 4 (CDCP pre-authorization) is coachable: false in story-spec.json.
 * Nothing below implies Micro Coaching resolved or will resolve it.
 */

export const EXTERNAL_VOC = {
  platform: 'Trustpilot',
  rating: 1.2,
  ratingScale: 5,
  label: '(sunlife.ca)',
  // Rendered after the rating sentence on Executive. Overrides the template's
  // default "both aggregates look healthy" line, which is wrong at 1.2 stars.
  connectorNote:
    'The QA average looks healthy and the review score doesn’t. 402 of the 428 reviews are 1-star, while the my Sun Life app rates 4.5 on iOS and 4.0 on Android. Routine claims self-serve fine. The anger sits in the contacts that fall off that path, and that’s the tail the QA average hides.',
  reviewCount: 428,
  source: 'https://ca.trustpilot.com/review/sunlife.ca',
}

export const INTERNAL_VOC_STRIP = [
  {
    id: 'claim-decisions',
    title: 'Claim Decision Disputes (Health, Drug & Dental)',
    theme: 'A member is told by phone that a service is covered, the claim is declined at adjudication, and the follow-up call starts from scratch',
    volumeNote: 'Claim Decision Disputes is 20.0% of weekly contacts, the largest category; coverage-confirmed-then-declined is 960 of those a week',
    workaround: 'Members keep the date and name of whoever told them it was covered, and call back to repeat it, because nothing on the file shows it.',
    evidence: 'One member’s sequence: a first contact at CSAT 4 and QA 91%, then follow-ups at CSAT 2, 1 and 1 while QA held at 85-89%. The scorecard can’t see that the second call is about the same claim.',
    action: 'Micro Coaching cards 1 and 2 (start from the last call, let the decision set the tone) went to the whole team from week 2. Continuation-cohort CSAT has moved every week since, 1.6 to 2.4. Auto-fail contacts fell every week.',
  },
  {
    id: 'disability-suspension',
    title: 'Disability payments suspended pending a form',
    theme: 'An STD or LTD payment stops while the file waits on a physician statement, and the member finds out when the money doesn’t arrive',
    volumeNote: '2.5% of contacts (400 a week) inside Disability Claim Status, with the sharpest CSAT collapse in the build',
    workaround: 'Members call two and three times to find out which form is needed, often paying their doctor for it, while they have no income.',
    evidence: 'Real Trustpilot reviews: "My disability benefits were stopped in January 2026", "no voicemail was ever received" about a decision, "going on 3 months not paying me". The modelled sequence runs CSAT 3, then 1, then 1, with QA at 84-90% throughout.',
    action: 'Card 3 (name the adjudicator and the date) applies directly: name the form, the case manager and the day. A proactive call-back standard before any suspension is queued (see Actions). The policy requirement for the form stays.',
  },
  {
    id: 'chat-handoff',
    title: 'Digital Access & Claim Submission (App, Portal, Chat Handoff)',
    theme: 'The AI chat or the portal sends the member to the phone, and the phone queue or IVR call-back doesn’t reach them',
    volumeNote: '10.5% of contacts (1,680 a week); 43% of this cohort calls back, against 27.8% overall',
    workaround: 'Members try chat, then the phone, then chat again, and some submit claims only during the hours the portal allows.',
    evidence: 'Trustpilot reviews rose from 2 in August to 11 in September, and 9 of the 11 are about access: "The AI assistant told me to call them", "waiting 1 hour and a half on hold". Internal handoff contacts started rising about 9 days earlier (modelled).',
    action: 'Card 4 (count the calls they’ve made) for the conversation itself, plus a warm-handoff standard from chat to a person, queued in Actions.',
  },
  {
    id: 'cdcp-preauth',
    title: 'CDCP Pre-Authorization & Coverage',
    theme: 'A crown or denture pre-authorization comes back "does not meet plan criteria" with no specific reason, and the agent can’t see one either',
    volumeNote: '10.0% of contacts (1,600 a week); 580 avoidable; 41% come from dental offices',
    workaround: 'Dental offices resubmit the same request, and members call to ask why, sometimes reaching a supervisor who can’t say.',
    evidence: 'CBC (May 27 2026) reported about half of complex pre-authorizations rejected after the 18-64 expansion, often without specific reasons, with Sun Life referring questions to Health Canada. A dental office administrator: "rejection after rejection after rejection without any details or instructions."',
    action: 'Pass the denial reason to the agent desktop and the letter (see Actions). This is a data and process gap. Micro Coaching doesn’t address it.',
  },
]

export const EXTERNAL_VOC_STRIP = [
  {
    id: 'unreachable',
    title: 'Unreachable by Phone',
    summary: 'About 22 of 120 reviews read, and 9 of the 11 September 2026 reviews. The most time-sensitive theme.',
    evidence: '"I have now been waiting 1 hour and a half on hold" · "The Ivr will say it will call you back but it will only call once" · "Their 1-877-786-5433 number goes unanswered."',
    action: 'Grounds storyline 3 (internal signal leads external).',
  },
  {
    id: 'inconsistent-decisions',
    title: 'Inconsistent Claim Decisions',
    summary: 'About 13 reviews cite denials and 11 cite contradictory answers between agents.',
    evidence: '"For the same medical submission, sometimes it is accepted and sometimes it is denied" · "was told we were fully covered" · "each agent provided me with a totally different information"',
    action: 'Grounds storyline 1. Micro Coaching cards 1 and 2 target how the follow-up is handled.',
  },
  {
    id: 'disability',
    title: 'Disability Claim Communication',
    summary: 'About 10 reviews, the most severe in tone: members off work without income.',
    evidence: '"My disability benefits were stopped in January 2026" · "no voicemail was ever received" · "going on 3 months not paying me"',
    action: 'Grounds storyline 2.',
  },
  {
    id: 'documentation',
    title: 'Documentation Loop',
    summary: 'About 27 reviews mention forms, resubmissions or unreadable attachments.',
    evidence: '"Prescription is not enough." · "asking for a form to be completed by the Dr. who is charging $45" · "Apparently the attachments were blurry"',
    action: 'Corroborates the Additional Information Requests driver (14.5% of weekly volume). Tracked, not one of the four featured storylines this period.',
  },
  {
    id: 'cdcp-news',
    title: 'CDCP Denials Without a Reason',
    summary: 'Four independent news and industry sources, May-June 2026, plus a Trustpilot review.',
    evidence: '"playing games" (CDCP patient, CBC) · "Rejection after rejection after rejection without any details or instructions" (dental office administrator)',
    action: 'Grounds storyline 4 (coachable: false). A data and process gap.',
  },
]

export const COMBINED_VOC_ISSUES = {
  title: "Issues found in both signals, and what we're doing about them",
  items: [
    {
      id: 'claim-decisions',
      title: 'Claim Decision Disputes (Health, Drug & Dental)',
      summary: 'The largest single driver, and the clearest match to what members write publicly.',
      internal: '3,200 weekly contacts (20.0% of volume), 55% FCR, 15% escalation, ownership scoring 2.0 on follow-up contacts.',
      external: 'Trustpilot (1.2 stars, 428 reviews) carries the same pattern: told it was covered, then declined, with different answers from different agents.',
      action: 'Micro Coaching cards 1 and 2 live team-wide from week 2. A rule to log every coverage confirmation on the file is queued (see Actions).',
      status: 'CSAT recovering · auto-fails down every week · live team-wide since week 2',
    },
    {
      id: 'chat-handoff',
      title: 'Chat-to-phone handoff',
      summary: 'The one signal where internal data moved before the public one.',
      internal: '1,680 weekly contacts, 43% repeat contact rate on this cohort, 24% closed with no resolution path.',
      external: 'Trustpilot went from 2 reviews in August to 11 in September, 9 of them about access. The app itself rates 4.0-4.5, so the failure is the handoff, not the app.',
      action: 'Warm-handoff standard from the AI chat to a person, and a second IVR call-back attempt, queued for review.',
      status: 'Open · process fix queued · watch the September spike',
    },
    {
      id: 'cdcp',
      title: 'CDCP Pre-Authorization & Coverage',
      summary: 'A national news story that also shows up as avoidable contact volume.',
      internal: '1,600 weekly contacts, 50% FCR (lowest of any category), 36% repeat within seven days.',
      external: 'CBC and industry coverage: about half of complex pre-authorizations rejected, often without a specific reason.',
      action: 'Pass the denial reason to the letter, the dental office and the agent desktop. Micro Coaching doesn’t address this. It’s a data problem.',
      status: 'Open · data fix queued · not a coaching item',
    },
  ],
}

export const SIGNAL_RECONCILIATION = [
  {
    title: 'Claim Decision Disputes',
    internal: 'Internal: 3,200 weekly contacts, continuation CSAT 2.0 against 4.0 first contact.',
    external: 'External: Trustpilot’s most-repeated claims complaint is being told one thing and paid another.',
    meaning: 'Both instruments agree on the pattern and its severity. This is the clearest, best-evidenced problem.',
  },
  {
    title: 'Disability payments suspended',
    internal: 'Internal volume is low at 2.5% of contacts.',
    external: 'External severity is high: disability reviews are the most distressed in the corpus.',
    meaning: 'A QA sample sized for the average rarely reaches this tail. Low volume isn’t low risk.',
  },
  {
    title: 'Chat-to-phone handoff',
    internal: 'Internal handoff contacts started rising about 9 days ahead of the public spike (modelled).',
    external: 'Trustpilot reviews rose from 2 in August to 11 in September (real count), 9 of them about access.',
    meaning: 'This is where internal data can warn before the reviews arrive, which is what QiQ is built to surface.',
  },
]

export const RISK_REGISTER = [
  {
    risk: 'Follow-up failure on declined claims and disability files',
    evidence: 'First-contact CSAT 4.0 vs continuation 2.0; QA still 86.0% on continuation',
    confidence: '90%',
    owner: 'CCM + Team Leads',
  },
  {
    risk: 'Disability payments suspended without a call',
    evidence: '400 weekly contacts, CSAT falls to 1 by the second call; most distressed theme on Trustpilot',
    confidence: '82%',
    owner: 'Disability case management',
  },
  {
    risk: 'Chat-to-phone handoff driving public complaints',
    evidence: '43% repeat rate on the cohort; Trustpilot access reviews 2 → 11 month on month',
    confidence: '80%',
    owner: 'Digital + Contact centre operations',
  },
  {
    risk: 'CDCP denial reasons invisible to members, dentists and agents',
    evidence: '1,600 weekly contacts, 580 avoidable; national news coverage May-June 2026',
    confidence: '88%',
    owner: 'CDCP operations with Health Canada',
  },
]

export const ACTION_AGENDA = [
  {
    rank: 1,
    title: 'Warm handoff from the AI chat to a person',
    detail: 'When the chat can’t answer, book a call-back or open a live chat with an agent instead of telling the member to call.',
    estimateLabel: 'Estimate',
  },
  {
    rank: 2,
    title: 'Keep the four Micro Coaching cards mandatory team-wide',
    detail: 'Start from the last call, let the decision set the tone, name the adjudicator and the date, count the calls they’ve made.',
    estimateLabel: null,
  },
  {
    rank: 3,
    title: 'Proactive call before any disability payment is suspended',
    detail: 'Case manager calls the member, names the exact form and the deadline, and confirms in writing.',
    estimateLabel: null,
  },
  {
    rank: 4,
    title: 'Pass the CDCP denial reason to the agent desktop and the letter',
    detail: 'Data and process fix with CDCP operations. Explicitly not a coaching fix.',
    estimateLabel: null,
  },
]

/** Storyline 3 - internal signal leads external. External counts are real (monthly); lead time and correlation are modelled. */
export const STORYLINE_3 = {
  correlation: 0.71,
  lagDays: 9,
  internalContacts: 1680,
}

/** Storyline 4 is coachable: false in story-spec.json. No coaching-outcome language appears anywhere it's referenced. */
export const STORYLINE_4 = {
  contactsWeekly: 1600,
  avoidableContactsWeekly: 580,
  repeatWithinSevenDaysPct: 36,
  providerOfficeSharePct: 41,
  coachable: false,
}

export const ACTION_DETAILS = {
  'decide-scale-coaching': {
    tone: 'red',
    type: 'System',
    chip: 'CSAT 1.6 → 2.4',
    category: 'Decide now',
    title: 'Keep Micro Coaching mandatory for every agent on follow-up contacts',
    summary:
      'All ten agents carried auto-fails on the same pattern, so the start-from-the-last-call and let-the-decision-set-the-tone cards went out team-wide from week 2. The decision now is to keep them a standing requirement, not a one-off pilot.',
    rationale:
      'The agents with the most auto-fails scored close to the team QA average while CSAT on the same contacts sat far below it. Treating a follow-up about a declined claim as a new call showed up across the whole team, so the fix was team-wide from the start.',
    owner: 'CCM + Team Leads',
    timeline: 'Live team-wide since week 2. This decision is whether it stays a permanent standard',
    impact: 'Continuation-cohort CSAT is already 1.6 → 2.4, and auto-fails fell every week. Keeping it mandatory is what holds that as volume grows. Blended CSAT is only 3.35 → 3.6 so far, which is the reason to keep it running.',
    kpis: ['CSAT', 'Auto-fail contacts', 'Continuation contacts'],
  },
  'decide-coverage-log': {
    tone: 'amber',
    type: 'Process',
    chip: '960 contacts/wk',
    category: 'Decide now',
    title: 'Log every phone coverage confirmation on the member’s file',
    summary:
      'When an agent confirms coverage by phone, record what was confirmed, the conditions (referral, pre-determination), and the date. The next agent and the adjudicator can then see it.',
    rationale:
      '960 contacts a week come from members told by phone that something was covered and then declined. Trustpilot reviewers quote the date and the agent’s words back. A logged confirmation settles the follow-up in one call.',
    owner: 'Contact centre operations + Adjudication',
    timeline: 'Process standard proposed for new confirmations from week 6',
    impact: 'Expected to reduce the 27.8% overall repeat-contact rate and the "told it was covered" complaints on public review sites.',
    kpis: ['Repeat contact rate', 'Escalation rate', 'External VOC'],
  },
  'ready-chat-handoff': {
    tone: 'amber',
    chip: '1,680 contacts/wk',
    category: 'Ready to execute',
    title: 'Warm handoff from the AI chat, and a second IVR call-back attempt',
    summary:
      'When the chat can’t answer, it books a call-back or passes the conversation to a live agent with the context attached. The IVR call-back retries once if the first attempt isn’t answered.',
    rationale:
      '43% of Digital Access & Claim Submission contacts call back, and 9 of the 11 September Trustpilot reviews are about reaching someone. Reviewers quote the chat telling them to call, and the call-back that came once.',
    owner: 'Digital + Contact centre operations',
    timeline: 'Ready to scope, awaiting go-ahead',
    impact: 'Modelled to cut repeat contacts on this cohort and slow the public access complaints before they compound.',
    kpis: ['Repeat contact rate', 'CSAT', 'External VOC'],
  },
  'ready-disability-callback': {
    tone: 'amber',
    chip: '400 contacts/wk',
    category: 'Ready to execute',
    title: 'Proactive call before any disability payment is suspended',
    summary:
      'Before a payment is held for missing information, the case manager calls the member, names the exact form and deadline, and confirms in writing, including whether the form fee is reimbursable.',
    rationale:
      'Suspended-payment contacts fall to CSAT 1 by the second call. Members learn about the suspension when the money doesn’t arrive, and reviewers describe decision voicemails that never came.',
    owner: 'Disability case management',
    timeline: 'Can start with existing case managers; needs a trigger in the case system',
    impact: 'Removes the first surprise call in most suspended-payment sequences. Card 3 covers how the call itself is handled.',
    kpis: ['CSAT', 'Escalation rate', 'Repeat contact rate'],
  },
  'ready-cdcp-reason': {
    tone: 'amber',
    chip: '580 avoidable/wk',
    category: 'Ready to execute',
    title: 'Pass the CDCP denial reason to the agent desktop and the letter',
    summary:
      'Carry the specific criterion that wasn’t met (missing radiograph, clinical notes, frequency limit) into the denial letter, the dental office notice and the agent’s screen. This isn’t a coaching fix. Storyline 4 is coachable: false.',
    rationale:
      'About half of complex pre-authorizations were rejected after the 18-64 expansion, often without a specific reason (CBC, May 2026). 36% of these contacts repeat within seven days, and 41% come from dental offices.',
    owner: 'CDCP operations with Health Canada',
    timeline: 'Needs agreement on which criteria can be disclosed; no agent-facing redesign',
    impact: 'Directly addresses the 580 weekly avoidable contacts. Coaching won’t move this driver. Only the data fix will.',
    kpis: ['FCR', 'Repeat contact rate', 'External VOC'],
  },
  'watch-auto-fails': {
    tone: 'amber',
    category: 'Watch next week',
    title: 'Auto-fail contacts and continuation CSAT trend',
    summary: 'Confirm auto-fails keep falling and continuation CSAT keeps climbing now that coaching is standard across the team.',
    rationale:
      'Both have moved every week since week 2. The test is whether they hold as coaching moves from a new habit to routine practice.',
    owner: 'CCM + Team Leads',
    timeline: 'Reviewed weekly',
    impact: 'A steady trend here is the leading confirmation that the fix is holding at team-wide scale.',
    kpis: ['Auto-fail contacts', 'CSAT'],
  },
  'watch-csat': {
    tone: 'amber',
    category: 'Watch next week',
    title: 'Blended CSAT vs target',
    summary: 'Population-wide CSAT averaged 3.4 for the period against a 4.2 target, rising from 3.35 to 3.6 as the continuation cohort recovers. Expect it to keep closing gradually.',
    rationale:
      'Blended CSAT averages across all 16,000 weekly contacts. Continuation contacts, the ones coaching targets, are 28% of that volume, so the blended figure lags by design.',
    owner: 'CCM + Team Leads',
    timeline: 'Reviewed weekly',
    impact: 'The population-level success measure once enough weeks of coaching accumulate.',
    kpis: ['CSAT'],
  },
  'watch-cdcp': {
    tone: 'red',
    category: 'Watch next week',
    title: 'CDCP pre-authorization volume, unresolved by coaching',
    summary: '1,600 CDCP Pre-Authorization & Coverage contacts a week, 580 avoidable, stay open until the denial-reason fix ships. This is the storyline that keeps the rest of the demo honest.',
    rationale:
      'No coaching touches this driver. Volume is expected to hold or rise as the June 2026 eligibility expansion brings more enrollees to the dentist.',
    owner: 'CDCP operations with Health Canada',
    timeline: 'Avoidable volume continues weekly until the fix is agreed',
    impact: 'Avoidable only through the data and process fix, not through coaching or QA.',
    kpis: ['FCR', 'Repeat contact rate'],
  },
}

export const ACTION_BOARD_COLUMNS = ['Decide now', 'Ready to execute', 'Watch next week']
