/**
 * Content-writer output for Sun Life (Canada) (qiq-content-writer stage 4).
 * Numeric fields (volume, aht/fcr/csat/qa series, behaviour pillars, critical
 * failures) are copied directly from clients/sunlife/contacts/agent_metrics.json,
 * the qiq-dataset-builder output - not authored here. qaSeries and firstQa are
 * the two fields agent_metrics.json does not carry per-agent; qaSeries is a
 * deterministic (hashlib-seeded, not random-reseeded) derivation pulling
 * slightly against each agent's own ahtSeries, and firstQa is each agent's
 * continuationQa plus the team-wide first/continuation QA gap from
 * story-spec.json (90.0 - 86.0 = 4.0 pts).
 *
 * coachingPack cards follow the Micro Coaching card contract: title,
 * personalNote (this agent's own numbers), positiveOpening (omitted where not
 * supported), coachingFocus, practicalGuidance ("sounds like: ..."),
 * miniChallenge, encouragingClose. Cards are ranked per-agent by
 * severity_weight*100 + (50 if customerRisk) + this agent's own count, same
 * formula qiq-dataset-builder used to produce coachingGaps. say_unspoken is
 * not part of the rotation for Sun Life (one-sided client, per
 * story-spec.coaching.topics) - every pack below draws from the remaining
 * four topics only. No agent-facing string references any internal record
 * identifier, conversation log, quality percentage, or system name.
 * This demo uses illustrative, synthetic data - Sun Life has not shared
 * operational data with QiQ for this build.
 */

export const WK_LABELS = ["W1", "W2", "W3", "W4", "W5"]
export const COACHING_WEEK_INDEX = 1 // week 2, 0-indexed

export const AGENT_METRICS = {
  "aisha-rahman": {
    "name": "Aisha Rahman",
    "slug": "aisha-rahman",
    "volume": 224,
    "firstContacts": 165,
    "continuationContacts": 59,
    "ahtSeconds": 478,
    "fcrPct": 82.1,
    "csat": 3.53,
    "firstCsat": 4.07,
    "continuationCsat": 2.0,
    "qaScore": 87.1,
    "continuationQa": 86.5,
    "ahtSeries": [
      483,
      462,
      482,
      476,
      480
    ],
    "fcrSeries": [
      92.2,
      82.9,
      80.0,
      79.6,
      75.5
    ],
    "csatSeries": [
      3.43,
      3.26,
      3.75,
      3.41,
      3.76
    ],
    "processAdherencePct": 93.3,
    "resolutionRatePct": 82.1,
    "criticalFailures": 20,
    "criticalFailureSeries": [
      5,
      5,
      1,
      9,
      0
    ],
    "empathy": 3.46,
    "behaviourFirst": {
      "clarity": 4.17,
      "ownership": 4.07,
      "listening": 4.2,
      "professionalism": 4.4,
      "empathy": 4.03,
      "managing_frustration": 3.95
    },
    "behaviourContinuation": {
      "clarity": 3.14,
      "ownership": 1.97,
      "listening": 2.79,
      "professionalism": 3.92,
      "empathy": 1.88,
      "managing_frustration": 2.13
    },
    "role": "Member Services Representative",
    "team": "Nadia Chowdhury",
    "qaSeries": [
      87.0,
      87.2,
      86.8,
      87.0,
      86.8
    ],
    "firstQa": 90.5,
    "coachingPack": {
      "packId": "pack-sunlife-aisha-rahman",
      "cycleType": "weekly_insight",
      "packSummary": "Four things from your last 224 contacts, starting with 57 follow-up or declined-claim contacts opened without picking up the prior context, mostly on Additional Information Requests (Forms, Prior Auth, Attachments), Digital Access & Claim Submission (App, Portal, Chat Handoff).",
      "packReason": "Built from your own contacts this period, 107 across these patterns, where a small change in how you opened or closed would have made the contact easier for the member.",
      "cardCount": 4,
      "estimatedPackDurationSeconds": 196,
      "packWordCount": 490,
      "cards": [
        {
          "cardId": "CARD-AISHA-RAHMAN-1",
          "priorityRank": 1,
          "topicKey": "open_with_incident",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Start From the Last Call · Additional Information Requests (Forms, Prior Auth, Attachments)",
          "personalNote": "57 of your 59 follow-up contacts this period (96.6%) mostly on Additional Information Requests (Forms, Prior Auth, Attachments) and Digital Access & Claim Submission (App, Portal, Chat Handoff).",
          "positiveOpening": "Your first-contact work is solid: 4.07 CSAT there, well ahead of the 2.0 average on follow-ups.",
          "coachingFocus": "When a member is calling back about a claim or a disability file that's already open, say what you can see has already happened before you ask them anything new.",
          "practicalGuidance": "Sounds like: \"I can see you called on the 3rd about this claim and were told it would be covered. Let me pick it up from there instead of starting over.\"",
          "miniChallenge": "On your next three follow-up contacts, open by naming what you can already see on the file before asking a new question.",
          "encouragingClose": "Members push back less when they feel remembered, not restarted.",
          "_severity": "high",
          "_metric": "57 contacts flagged for start from the last call",
          "wordCount": 137,
          "estimatedDurationSeconds": 55
        },
        {
          "cardId": "CARD-AISHA-RAHMAN-2",
          "priorityRank": 2,
          "topicKey": "route_forward",
          "affectedKpis": [
            "repeat_contact_rate",
            "fcr"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Name the Adjudicator and the Date · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "25 of your 224 contacts this period (11.2%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Additional Information Requests (Forms, Prior Auth, Attachments).",
          "positiveOpening": "Your first-contact work is solid: 4.07 CSAT there, well ahead of the 2.0 average on follow-ups.",
          "coachingFocus": "Before closing a claim or disability contact you can't resolve on the call, name who owns the next step and the day the member will hear back.",
          "practicalGuidance": "Sounds like: \"The adjudication team has this now. You'll hear from them by Thursday, and I'm noting on your file that you're expecting that call.\"",
          "miniChallenge": "On your next two unresolved contacts, name a specific team and a specific day before you end the call.",
          "encouragingClose": "A named owner and a date are most of what stops a member calling back with the same question.",
          "_severity": "high",
          "_metric": "25 contacts flagged for name the adjudicator and the date",
          "wordCount": 131,
          "estimatedDurationSeconds": 52
        },
        {
          "cardId": "CARD-AISHA-RAHMAN-3",
          "priorityRank": 3,
          "topicKey": "match_register",
          "affectedKpis": [
            "csat"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Let the Decision Set the Tone · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "17 of your 224 contacts this period (7.6%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Disability Claim Status (STD / LTD).",
          "positiveOpening": "Your first-contact work is solid: 4.07 CSAT there, well ahead of the 2.0 average on follow-ups.",
          "coachingFocus": "A declined claim after someone said it was covered is not a routine coverage question. Match your tone to how the member actually feels before explaining the plan rules.",
          "practicalGuidance": "Sounds like: \"You were told this was covered and then it was declined. I understand why that's frustrating, and I want to get you a clear answer, not just read you the booklet.\"",
          "miniChallenge": "On your next two declined-claim contacts, name the specific frustration in your own words before explaining the decision.",
          "encouragingClose": null,
          "_severity": "high",
          "_metric": "17 contacts flagged for let the decision set the tone",
          "wordCount": 120,
          "estimatedDurationSeconds": 48
        },
        {
          "cardId": "CARD-AISHA-RAHMAN-4",
          "priorityRank": 4,
          "topicKey": "acknowledge_effort",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Count the Calls They've Made · CDCP Pre-Authorization & Coverage",
          "personalNote": "8 of your 224 contacts this period (3.6%) mostly on CDCP Pre-Authorization & Coverage and Disability Claim Status (STD / LTD).",
          "positiveOpening": "Your first-contact work is solid: 4.07 CSAT there, well ahead of the 2.0 average on follow-ups.",
          "coachingFocus": "When a member says they've already called or waited on hold, acknowledge the repeat specifically before moving to the answer.",
          "practicalGuidance": "Sounds like: \"I can see this is your third call on this claim this month. I'm sorry you've had to chase it. Let's get it closed today.\"",
          "miniChallenge": "On your next follow-up contact, name how many times they've already reached out before answering the question itself.",
          "encouragingClose": null,
          "_severity": "medium",
          "_metric": "8 contacts flagged for count the calls they've made",
          "wordCount": 102,
          "estimatedDurationSeconds": 41
        }
      ]
    }
  },
  "chloe-gagnon": {
    "name": "Chloe Gagnon",
    "slug": "chloe-gagnon",
    "volume": 228,
    "firstContacts": 172,
    "continuationContacts": 56,
    "ahtSeconds": 488,
    "fcrPct": 87.7,
    "csat": 3.43,
    "firstCsat": 3.87,
    "continuationCsat": 2.07,
    "qaScore": 86.8,
    "continuationQa": 84.7,
    "ahtSeries": [
      501,
      488,
      493,
      468,
      492
    ],
    "fcrSeries": [
      85.0,
      93.2,
      83.3,
      89.8,
      87.2
    ],
    "csatSeries": [
      3.4,
      3.57,
      3.23,
      3.43,
      3.51
    ],
    "processAdherencePct": 94.7,
    "resolutionRatePct": 87.7,
    "criticalFailures": 19,
    "criticalFailureSeries": [
      0,
      5,
      8,
      3,
      3
    ],
    "empathy": 3.67,
    "behaviourFirst": {
      "clarity": 4.13,
      "ownership": 4.05,
      "listening": 4.19,
      "professionalism": 4.3,
      "empathy": 4.26,
      "managing_frustration": 3.96
    },
    "behaviourContinuation": {
      "clarity": 3.16,
      "ownership": 2.04,
      "listening": 2.86,
      "professionalism": 4.04,
      "empathy": 1.87,
      "managing_frustration": 2.13
    },
    "role": "Member Services Representative",
    "team": "Nadia Chowdhury",
    "qaSeries": [
      86.8,
      87.0,
      86.9,
      86.7,
      86.6
    ],
    "firstQa": 88.7,
    "coachingPack": {
      "packId": "pack-sunlife-chloe-gagnon",
      "cycleType": "weekly_insight",
      "packSummary": "Four things from your last 228 contacts, starting with 55 follow-up or declined-claim contacts opened without picking up the prior context, mostly on Additional Information Requests (Forms, Prior Auth, Attachments), CDCP Pre-Authorization & Coverage.",
      "packReason": "Built from your own contacts this period, 86 across these patterns, where a small change in how you opened or closed would have made the contact easier for the member.",
      "cardCount": 4,
      "estimatedPackDurationSeconds": 195,
      "packWordCount": 487,
      "cards": [
        {
          "cardId": "CARD-CHLOE-GAGNON-1",
          "priorityRank": 1,
          "topicKey": "open_with_incident",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Start From the Last Call · Additional Information Requests (Forms, Prior Auth, Attachments)",
          "personalNote": "55 of your 56 follow-up contacts this period (98.2%) mostly on Additional Information Requests (Forms, Prior Auth, Attachments) and CDCP Pre-Authorization & Coverage.",
          "positiveOpening": "Your first-contact work is solid: 3.87 CSAT there, well ahead of the 2.07 average on follow-ups.",
          "coachingFocus": "When a member is calling back about a claim or a disability file that's already open, say what you can see has already happened before you ask them anything new.",
          "practicalGuidance": "Sounds like: \"I can see you called on the 3rd about this claim and were told it would be covered. Let me pick it up from there instead of starting over.\"",
          "miniChallenge": "On your next three follow-up contacts, open by naming what you can already see on the file before asking a new question.",
          "encouragingClose": "Members push back less when they feel remembered, not restarted.",
          "_severity": "high",
          "_metric": "55 contacts flagged for start from the last call",
          "wordCount": 132,
          "estimatedDurationSeconds": 53
        },
        {
          "cardId": "CARD-CHLOE-GAGNON-2",
          "priorityRank": 2,
          "topicKey": "route_forward",
          "affectedKpis": [
            "repeat_contact_rate",
            "fcr"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Name the Adjudicator and the Date · Disability Claim Status (STD / LTD)",
          "personalNote": "17 of your 228 contacts this period (7.5%) mostly on Disability Claim Status (STD / LTD) and Claim Decision Disputes (Health, Drug & Dental).",
          "positiveOpening": "Your first-contact work is solid: 3.87 CSAT there, well ahead of the 2.07 average on follow-ups.",
          "coachingFocus": "Before closing a claim or disability contact you can't resolve on the call, name who owns the next step and the day the member will hear back.",
          "practicalGuidance": "Sounds like: \"The adjudication team has this now. You'll hear from them by Thursday, and I'm noting on your file that you're expecting that call.\"",
          "miniChallenge": "On your next two unresolved contacts, name a specific team and a specific day before you end the call.",
          "encouragingClose": "A named owner and a date are most of what stops a member calling back with the same question.",
          "_severity": "high",
          "_metric": "17 contacts flagged for name the adjudicator and the date",
          "wordCount": 130,
          "estimatedDurationSeconds": 52
        },
        {
          "cardId": "CARD-CHLOE-GAGNON-3",
          "priorityRank": 3,
          "topicKey": "match_register",
          "affectedKpis": [
            "csat"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Let the Decision Set the Tone · Disability Claim Status (STD / LTD)",
          "personalNote": "10 of your 228 contacts this period (4.4%) mostly on Disability Claim Status (STD / LTD) and Claim Decision Disputes (Health, Drug & Dental).",
          "positiveOpening": "Your first-contact work is solid: 3.87 CSAT there, well ahead of the 2.07 average on follow-ups.",
          "coachingFocus": "A declined claim after someone said it was covered is not a routine coverage question. Match your tone to how the member actually feels before explaining the plan rules.",
          "practicalGuidance": "Sounds like: \"You were told this was covered and then it was declined. I understand why that's frustrating, and I want to get you a clear answer, not just read you the booklet.\"",
          "miniChallenge": "On your next two declined-claim contacts, name the specific frustration in your own words before explaining the decision.",
          "encouragingClose": null,
          "_severity": "high",
          "_metric": "10 contacts flagged for let the decision set the tone",
          "wordCount": 120,
          "estimatedDurationSeconds": 48
        },
        {
          "cardId": "CARD-CHLOE-GAGNON-4",
          "priorityRank": 4,
          "topicKey": "acknowledge_effort",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Count the Calls They've Made · Additional Information Requests (Forms, Prior Auth, Attachments)",
          "personalNote": "4 of your 228 contacts this period (1.8%) mostly on Additional Information Requests (Forms, Prior Auth, Attachments) and Disability Claim Status (STD / LTD).",
          "positiveOpening": "Your first-contact work is solid: 3.87 CSAT there, well ahead of the 2.07 average on follow-ups.",
          "coachingFocus": "When a member says they've already called or waited on hold, acknowledge the repeat specifically before moving to the answer.",
          "practicalGuidance": "Sounds like: \"I can see this is your third call on this claim this month. I'm sorry you've had to chase it. Let's get it closed today.\"",
          "miniChallenge": "On your next follow-up contact, name how many times they've already reached out before answering the question itself.",
          "encouragingClose": null,
          "_severity": "medium",
          "_metric": "4 contacts flagged for count the calls they've made",
          "wordCount": 105,
          "estimatedDurationSeconds": 42
        }
      ]
    }
  },
  "daniel-okafor": {
    "name": "Daniel Okafor",
    "slug": "daniel-okafor",
    "volume": 329,
    "firstContacts": 233,
    "continuationContacts": 96,
    "ahtSeconds": 485,
    "fcrPct": 78.1,
    "csat": 3.45,
    "firstCsat": 4.05,
    "continuationCsat": 2.0,
    "qaScore": 87.3,
    "continuationQa": 86.4,
    "ahtSeries": [
      476,
      481,
      471,
      504,
      492
    ],
    "fcrSeries": [
      76.0,
      75.9,
      74.6,
      81.6,
      82.5
    ],
    "csatSeries": [
      3.28,
      3.41,
      3.33,
      3.68,
      3.54
    ],
    "processAdherencePct": 95.1,
    "resolutionRatePct": 78.1,
    "criticalFailures": 38,
    "criticalFailureSeries": [
      12,
      7,
      8,
      5,
      6
    ],
    "empathy": 3.49,
    "behaviourFirst": {
      "clarity": 4.24,
      "ownership": 4.08,
      "listening": 4.07,
      "professionalism": 4.36,
      "empathy": 4.14,
      "managing_frustration": 3.98
    },
    "behaviourContinuation": {
      "clarity": 3.35,
      "ownership": 1.99,
      "listening": 2.82,
      "professionalism": 4.13,
      "empathy": 1.92,
      "managing_frustration": 2.07
    },
    "role": "Member Services Representative",
    "team": "Nadia Chowdhury",
    "qaSeries": [
      87.5,
      87.4,
      87.3,
      87.4,
      87.4
    ],
    "firstQa": 90.4,
    "coachingPack": {
      "packId": "pack-sunlife-daniel-okafor",
      "cycleType": "weekly_insight",
      "packSummary": "Four things from your last 329 contacts, starting with 92 follow-up or declined-claim contacts opened without picking up the prior context, mostly on Disability Claim Status (STD / LTD), Digital Access & Claim Submission (App, Portal, Chat Handoff).",
      "packReason": "Built from your own contacts this period, 202 across these patterns, where a small change in how you opened or closed would have made the contact easier for the member.",
      "cardCount": 4,
      "estimatedPackDurationSeconds": 196,
      "packWordCount": 491,
      "cards": [
        {
          "cardId": "CARD-DANIEL-OKAFOR-1",
          "priorityRank": 1,
          "topicKey": "open_with_incident",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Start From the Last Call · Disability Claim Status (STD / LTD)",
          "personalNote": "92 of your 96 follow-up contacts this period (95.8%) mostly on Disability Claim Status (STD / LTD) and Digital Access & Claim Submission (App, Portal, Chat Handoff).",
          "positiveOpening": "Your first-contact work is solid: 4.05 CSAT there, well ahead of the 2.0 average on follow-ups.",
          "coachingFocus": "When a member is calling back about a claim or a disability file that's already open, say what you can see has already happened before you ask them anything new.",
          "practicalGuidance": "Sounds like: \"I can see you called on the 3rd about this claim and were told it would be covered. Let me pick it up from there instead of starting over.\"",
          "miniChallenge": "On your next three follow-up contacts, open by naming what you can already see on the file before asking a new question.",
          "encouragingClose": "Members push back less when they feel remembered, not restarted.",
          "_severity": "high",
          "_metric": "92 contacts flagged for start from the last call",
          "wordCount": 136,
          "estimatedDurationSeconds": 54
        },
        {
          "cardId": "CARD-DANIEL-OKAFOR-2",
          "priorityRank": 2,
          "topicKey": "route_forward",
          "affectedKpis": [
            "repeat_contact_rate",
            "fcr"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Name the Adjudicator and the Date · Disability Claim Status (STD / LTD)",
          "personalNote": "52 of your 329 contacts this period (15.8%) mostly on Disability Claim Status (STD / LTD) and Digital Access & Claim Submission (App, Portal, Chat Handoff).",
          "positiveOpening": "Your first-contact work is solid: 4.05 CSAT there, well ahead of the 2.0 average on follow-ups.",
          "coachingFocus": "Before closing a claim or disability contact you can't resolve on the call, name who owns the next step and the day the member will hear back.",
          "practicalGuidance": "Sounds like: \"The adjudication team has this now. You'll hear from them by Thursday, and I'm noting on your file that you're expecting that call.\"",
          "miniChallenge": "On your next two unresolved contacts, name a specific team and a specific day before you end the call.",
          "encouragingClose": "A named owner and a date are most of what stops a member calling back with the same question.",
          "_severity": "high",
          "_metric": "52 contacts flagged for name the adjudicator and the date",
          "wordCount": 132,
          "estimatedDurationSeconds": 53
        },
        {
          "cardId": "CARD-DANIEL-OKAFOR-3",
          "priorityRank": 3,
          "topicKey": "match_register",
          "affectedKpis": [
            "csat"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Let the Decision Set the Tone · Disability Claim Status (STD / LTD)",
          "personalNote": "42 of your 329 contacts this period (12.8%) mostly on Disability Claim Status (STD / LTD) and Claim Decision Disputes (Health, Drug & Dental).",
          "positiveOpening": "Your first-contact work is solid: 4.05 CSAT there, well ahead of the 2.0 average on follow-ups.",
          "coachingFocus": "A declined claim after someone said it was covered is not a routine coverage question. Match your tone to how the member actually feels before explaining the plan rules.",
          "practicalGuidance": "Sounds like: \"You were told this was covered and then it was declined. I understand why that's frustrating, and I want to get you a clear answer, not just read you the booklet.\"",
          "miniChallenge": "On your next two declined-claim contacts, name the specific frustration in your own words before explaining the decision.",
          "encouragingClose": null,
          "_severity": "high",
          "_metric": "42 contacts flagged for let the decision set the tone",
          "wordCount": 120,
          "estimatedDurationSeconds": 48
        },
        {
          "cardId": "CARD-DANIEL-OKAFOR-4",
          "priorityRank": 4,
          "topicKey": "acknowledge_effort",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Count the Calls They've Made · Disability Claim Status (STD / LTD)",
          "personalNote": "16 of your 329 contacts this period (4.9%) mostly on Disability Claim Status (STD / LTD) and Coverage & Eligibility Questions (routine).",
          "positiveOpening": "Your first-contact work is solid: 4.05 CSAT there, well ahead of the 2.0 average on follow-ups.",
          "coachingFocus": "When a member says they've already called or waited on hold, acknowledge the repeat specifically before moving to the answer.",
          "practicalGuidance": "Sounds like: \"I can see this is your third call on this claim this month. I'm sorry you've had to chase it. Let's get it closed today.\"",
          "miniChallenge": "On your next follow-up contact, name how many times they've already reached out before answering the question itself.",
          "encouragingClose": null,
          "_severity": "medium",
          "_metric": "16 contacts flagged for count the calls they've made",
          "wordCount": 103,
          "estimatedDurationSeconds": 41
        }
      ]
    }
  },
  "harpreet-gill": {
    "name": "Harpreet Gill",
    "slug": "harpreet-gill",
    "volume": 410,
    "firstContacts": 300,
    "continuationContacts": 110,
    "ahtSeconds": 480,
    "fcrPct": 83.2,
    "csat": 3.43,
    "firstCsat": 3.96,
    "continuationCsat": 1.97,
    "qaScore": 86.8,
    "continuationQa": 85.3,
    "ahtSeries": [
      487,
      481,
      480,
      475,
      479
    ],
    "fcrSeries": [
      79.8,
      80.0,
      87.4,
      87.5,
      81.1
    ],
    "csatSeries": [
      3.24,
      3.42,
      3.4,
      3.55,
      3.55
    ],
    "processAdherencePct": 93.2,
    "resolutionRatePct": 83.2,
    "criticalFailures": 40,
    "criticalFailureSeries": [
      9,
      6,
      8,
      7,
      10
    ],
    "empathy": 3.52,
    "behaviourFirst": {
      "clarity": 4.25,
      "ownership": 4.05,
      "listening": 4.13,
      "professionalism": 4.36,
      "empathy": 4.12,
      "managing_frustration": 3.95
    },
    "behaviourContinuation": {
      "clarity": 3.33,
      "ownership": 1.97,
      "listening": 2.81,
      "professionalism": 3.96,
      "empathy": 1.9,
      "managing_frustration": 2.09
    },
    "role": "Member Services Representative",
    "team": "Nadia Chowdhury",
    "qaSeries": [
      86.6,
      86.9,
      87.0,
      86.7,
      86.8
    ],
    "firstQa": 89.3,
    "coachingPack": {
      "packId": "pack-sunlife-harpreet-gill",
      "cycleType": "weekly_insight",
      "packSummary": "Four things from your last 410 contacts, starting with 103 follow-up or declined-claim contacts opened without picking up the prior context, mostly on Claim Decision Disputes (Health, Drug & Dental), Additional Information Requests (Forms, Prior Auth, Attachments).",
      "packReason": "Built from your own contacts this period, 236 across these patterns, where a small change in how you opened or closed would have made the contact easier for the member.",
      "cardCount": 4,
      "estimatedPackDurationSeconds": 196,
      "packWordCount": 488,
      "cards": [
        {
          "cardId": "CARD-HARPREET-GILL-1",
          "priorityRank": 1,
          "topicKey": "open_with_incident",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Start From the Last Call · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "103 of your 110 follow-up contacts this period (93.6%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Additional Information Requests (Forms, Prior Auth, Attachments).",
          "positiveOpening": "Your first-contact work is solid: 3.96 CSAT there, well ahead of the 1.97 average on follow-ups.",
          "coachingFocus": "When a member is calling back about a claim or a disability file that's already open, say what you can see has already happened before you ask them anything new.",
          "practicalGuidance": "Sounds like: \"I can see you called on the 3rd about this claim and were told it would be covered. Let me pick it up from there instead of starting over.\"",
          "miniChallenge": "On your next three follow-up contacts, open by naming what you can already see on the file before asking a new question.",
          "encouragingClose": "Members push back less when they feel remembered, not restarted.",
          "_severity": "high",
          "_metric": "103 contacts flagged for start from the last call",
          "wordCount": 135,
          "estimatedDurationSeconds": 54
        },
        {
          "cardId": "CARD-HARPREET-GILL-2",
          "priorityRank": 2,
          "topicKey": "route_forward",
          "affectedKpis": [
            "repeat_contact_rate",
            "fcr"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Name the Adjudicator and the Date · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "66 of your 410 contacts this period (16.1%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Coverage & Eligibility Questions (routine).",
          "positiveOpening": "Your first-contact work is solid: 3.96 CSAT there, well ahead of the 1.97 average on follow-ups.",
          "coachingFocus": "Before closing a claim or disability contact you can't resolve on the call, name who owns the next step and the day the member will hear back.",
          "practicalGuidance": "Sounds like: \"The adjudication team has this now. You'll hear from them by Thursday, and I'm noting on your file that you're expecting that call.\"",
          "miniChallenge": "On your next two unresolved contacts, name a specific team and a specific day before you end the call.",
          "encouragingClose": "A named owner and a date are most of what stops a member calling back with the same question.",
          "_severity": "high",
          "_metric": "66 contacts flagged for name the adjudicator and the date",
          "wordCount": 129,
          "estimatedDurationSeconds": 52
        },
        {
          "cardId": "CARD-HARPREET-GILL-3",
          "priorityRank": 3,
          "topicKey": "match_register",
          "affectedKpis": [
            "csat"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Let the Decision Set the Tone · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "52 of your 410 contacts this period (12.7%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Disability Claim Status (STD / LTD).",
          "positiveOpening": "Your first-contact work is solid: 3.96 CSAT there, well ahead of the 1.97 average on follow-ups.",
          "coachingFocus": "A declined claim after someone said it was covered is not a routine coverage question. Match your tone to how the member actually feels before explaining the plan rules.",
          "practicalGuidance": "Sounds like: \"You were told this was covered and then it was declined. I understand why that's frustrating, and I want to get you a clear answer, not just read you the booklet.\"",
          "miniChallenge": "On your next two declined-claim contacts, name the specific frustration in your own words before explaining the decision.",
          "encouragingClose": null,
          "_severity": "high",
          "_metric": "52 contacts flagged for let the decision set the tone",
          "wordCount": 120,
          "estimatedDurationSeconds": 48
        },
        {
          "cardId": "CARD-HARPREET-GILL-4",
          "priorityRank": 4,
          "topicKey": "acknowledge_effort",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Count the Calls They've Made · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "15 of your 410 contacts this period (3.7%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Group Retirement Transfers & Withdrawals.",
          "positiveOpening": "Your first-contact work is solid: 3.96 CSAT there, well ahead of the 1.97 average on follow-ups.",
          "coachingFocus": "When a member says they've already called or waited on hold, acknowledge the repeat specifically before moving to the answer.",
          "practicalGuidance": "Sounds like: \"I can see this is your third call on this claim this month. I'm sorry you've had to chase it. Let's get it closed today.\"",
          "miniChallenge": "On your next follow-up contact, name how many times they've already reached out before answering the question itself.",
          "encouragingClose": null,
          "_severity": "medium",
          "_metric": "15 contacts flagged for count the calls they've made",
          "wordCount": 104,
          "estimatedDurationSeconds": 42
        }
      ]
    }
  },
  "jasmine-wong": {
    "name": "Jasmine Wong",
    "slug": "jasmine-wong",
    "volume": 273,
    "firstContacts": 197,
    "continuationContacts": 76,
    "ahtSeconds": 482,
    "fcrPct": 77.7,
    "csat": 3.48,
    "firstCsat": 4.01,
    "continuationCsat": 2.09,
    "qaScore": 85.1,
    "continuationQa": 81.7,
    "ahtSeries": [
      515,
      482,
      469,
      489,
      456
    ],
    "fcrSeries": [
      78.3,
      81.4,
      73.7,
      81.4,
      73.1
    ],
    "csatSeries": [
      3.39,
      3.51,
      3.16,
      3.63,
      3.69
    ],
    "processAdherencePct": 94.1,
    "resolutionRatePct": 77.7,
    "criticalFailures": 24,
    "criticalFailureSeries": [
      4,
      5,
      5,
      7,
      3
    ],
    "empathy": 3.48,
    "behaviourFirst": {
      "clarity": 4.15,
      "ownership": 4.06,
      "listening": 4.09,
      "professionalism": 4.38,
      "empathy": 4.07,
      "managing_frustration": 4.0
    },
    "behaviourContinuation": {
      "clarity": 3.21,
      "ownership": 2.03,
      "listening": 2.74,
      "professionalism": 3.94,
      "empathy": 1.93,
      "managing_frustration": 2.05
    },
    "role": "Member Services Representative",
    "team": "Nadia Chowdhury",
    "qaSeries": [
      84.7,
      84.9,
      85.2,
      84.9,
      85.0
    ],
    "firstQa": 85.7,
    "coachingPack": {
      "packId": "pack-sunlife-jasmine-wong",
      "cycleType": "weekly_insight",
      "packSummary": "Four things from your last 273 contacts, starting with 72 follow-up or declined-claim contacts opened without picking up the prior context, mostly on Additional Information Requests (Forms, Prior Auth, Attachments), Premiums, Billing & Account Changes.",
      "packReason": "Built from your own contacts this period, 132 across these patterns, where a small change in how you opened or closed would have made the contact easier for the member.",
      "cardCount": 4,
      "estimatedPackDurationSeconds": 194,
      "packWordCount": 485,
      "cards": [
        {
          "cardId": "CARD-JASMINE-WONG-1",
          "priorityRank": 1,
          "topicKey": "open_with_incident",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Start From the Last Call · Additional Information Requests (Forms, Prior Auth, Attachments)",
          "personalNote": "72 of your 76 follow-up contacts this period (94.7%) mostly on Additional Information Requests (Forms, Prior Auth, Attachments) and Premiums, Billing & Account Changes.",
          "positiveOpening": "Your first-contact work is solid: 4.01 CSAT there, well ahead of the 2.09 average on follow-ups.",
          "coachingFocus": "When a member is calling back about a claim or a disability file that's already open, say what you can see has already happened before you ask them anything new.",
          "practicalGuidance": "Sounds like: \"I can see you called on the 3rd about this claim and were told it would be covered. Let me pick it up from there instead of starting over.\"",
          "miniChallenge": "On your next three follow-up contacts, open by naming what you can already see on the file before asking a new question.",
          "encouragingClose": "Members push back less when they feel remembered, not restarted.",
          "_severity": "high",
          "_metric": "72 contacts flagged for start from the last call",
          "wordCount": 133,
          "estimatedDurationSeconds": 53
        },
        {
          "cardId": "CARD-JASMINE-WONG-2",
          "priorityRank": 2,
          "topicKey": "route_forward",
          "affectedKpis": [
            "repeat_contact_rate",
            "fcr"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Name the Adjudicator and the Date · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "31 of your 273 contacts this period (11.4%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Disability Claim Status (STD / LTD).",
          "positiveOpening": "Your first-contact work is solid: 4.01 CSAT there, well ahead of the 2.09 average on follow-ups.",
          "coachingFocus": "Before closing a claim or disability contact you can't resolve on the call, name who owns the next step and the day the member will hear back.",
          "practicalGuidance": "Sounds like: \"The adjudication team has this now. You'll hear from them by Thursday, and I'm noting on your file that you're expecting that call.\"",
          "miniChallenge": "On your next two unresolved contacts, name a specific team and a specific day before you end the call.",
          "encouragingClose": "A named owner and a date are most of what stops a member calling back with the same question.",
          "_severity": "high",
          "_metric": "31 contacts flagged for name the adjudicator and the date",
          "wordCount": 130,
          "estimatedDurationSeconds": 52
        },
        {
          "cardId": "CARD-JASMINE-WONG-3",
          "priorityRank": 3,
          "topicKey": "match_register",
          "affectedKpis": [
            "csat"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Let the Decision Set the Tone · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "16 of your 273 contacts this period (5.9%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Disability Claim Status (STD / LTD).",
          "positiveOpening": "Your first-contact work is solid: 4.01 CSAT there, well ahead of the 2.09 average on follow-ups.",
          "coachingFocus": "A declined claim after someone said it was covered is not a routine coverage question. Match your tone to how the member actually feels before explaining the plan rules.",
          "practicalGuidance": "Sounds like: \"You were told this was covered and then it was declined. I understand why that's frustrating, and I want to get you a clear answer, not just read you the booklet.\"",
          "miniChallenge": "On your next two declined-claim contacts, name the specific frustration in your own words before explaining the decision.",
          "encouragingClose": null,
          "_severity": "high",
          "_metric": "16 contacts flagged for let the decision set the tone",
          "wordCount": 120,
          "estimatedDurationSeconds": 48
        },
        {
          "cardId": "CARD-JASMINE-WONG-4",
          "priorityRank": 4,
          "topicKey": "acknowledge_effort",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Count the Calls They've Made · Premiums, Billing & Account Changes",
          "personalNote": "13 of your 273 contacts this period (4.8%) mostly on Premiums, Billing & Account Changes and Coverage & Eligibility Questions (routine).",
          "positiveOpening": "Your first-contact work is solid: 4.01 CSAT there, well ahead of the 2.09 average on follow-ups.",
          "coachingFocus": "When a member says they've already called or waited on hold, acknowledge the repeat specifically before moving to the answer.",
          "practicalGuidance": "Sounds like: \"I can see this is your third call on this claim this month. I'm sorry you've had to chase it. Let's get it closed today.\"",
          "miniChallenge": "On your next follow-up contact, name how many times they've already reached out before answering the question itself.",
          "encouragingClose": null,
          "_severity": "medium",
          "_metric": "13 contacts flagged for count the calls they've made",
          "wordCount": 102,
          "estimatedDurationSeconds": 41
        }
      ]
    }
  },
  "kevin-nguyen": {
    "name": "Kevin Nguyen",
    "slug": "kevin-nguyen",
    "volume": 243,
    "firstContacts": 177,
    "continuationContacts": 66,
    "ahtSeconds": 489,
    "fcrPct": 86.8,
    "csat": 3.47,
    "firstCsat": 4.01,
    "continuationCsat": 2.02,
    "qaScore": 86.3,
    "continuationQa": 83.1,
    "ahtSeries": [
      488,
      485,
      480,
      491,
      499
    ],
    "fcrSeries": [
      86.8,
      84.8,
      86.3,
      90.6,
      85.5
    ],
    "csatSeries": [
      3.32,
      3.46,
      3.47,
      3.43,
      3.6
    ],
    "processAdherencePct": 95.1,
    "resolutionRatePct": 86.8,
    "criticalFailures": 21,
    "criticalFailureSeries": [
      6,
      4,
      4,
      3,
      4
    ],
    "empathy": 3.55,
    "behaviourFirst": {
      "clarity": 4.21,
      "ownership": 4.04,
      "listening": 4.14,
      "professionalism": 4.38,
      "empathy": 4.2,
      "managing_frustration": 3.97
    },
    "behaviourContinuation": {
      "clarity": 3.32,
      "ownership": 2.02,
      "listening": 2.69,
      "professionalism": 3.99,
      "empathy": 1.82,
      "managing_frustration": 2.16
    },
    "role": "Member Services Representative",
    "team": "Nadia Chowdhury",
    "qaSeries": [
      86.2,
      86.1,
      86.2,
      86.1,
      86.4
    ],
    "firstQa": 87.1,
    "coachingPack": {
      "packId": "pack-sunlife-kevin-nguyen",
      "cycleType": "weekly_insight",
      "packSummary": "Four things from your last 243 contacts, starting with 66 follow-up or declined-claim contacts opened without picking up the prior context, mostly on Additional Information Requests (Forms, Prior Auth, Attachments), Coverage & Eligibility Questions (routine).",
      "packReason": "Built from your own contacts this period, 113 across these patterns, where a small change in how you opened or closed would have made the contact easier for the member.",
      "cardCount": 4,
      "estimatedPackDurationSeconds": 194,
      "packWordCount": 484,
      "cards": [
        {
          "cardId": "CARD-KEVIN-NGUYEN-1",
          "priorityRank": 1,
          "topicKey": "open_with_incident",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Start From the Last Call · Additional Information Requests (Forms, Prior Auth, Attachments)",
          "personalNote": "66 of your 66 follow-up contacts this period (100.0%) mostly on Additional Information Requests (Forms, Prior Auth, Attachments) and Coverage & Eligibility Questions (routine).",
          "positiveOpening": "Your first-contact work is solid: 4.01 CSAT there, well ahead of the 2.02 average on follow-ups.",
          "coachingFocus": "When a member is calling back about a claim or a disability file that's already open, say what you can see has already happened before you ask them anything new.",
          "practicalGuidance": "Sounds like: \"I can see you called on the 3rd about this claim and were told it would be covered. Let me pick it up from there instead of starting over.\"",
          "miniChallenge": "On your next three follow-up contacts, open by naming what you can already see on the file before asking a new question.",
          "encouragingClose": "Members push back less when they feel remembered, not restarted.",
          "_severity": "high",
          "_metric": "66 contacts flagged for start from the last call",
          "wordCount": 133,
          "estimatedDurationSeconds": 53
        },
        {
          "cardId": "CARD-KEVIN-NGUYEN-2",
          "priorityRank": 2,
          "topicKey": "route_forward",
          "affectedKpis": [
            "repeat_contact_rate",
            "fcr"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Name the Adjudicator and the Date · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "21 of your 243 contacts this period (8.6%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Coverage & Eligibility Questions (routine).",
          "positiveOpening": "Your first-contact work is solid: 4.01 CSAT there, well ahead of the 2.02 average on follow-ups.",
          "coachingFocus": "Before closing a claim or disability contact you can't resolve on the call, name who owns the next step and the day the member will hear back.",
          "practicalGuidance": "Sounds like: \"The adjudication team has this now. You'll hear from them by Thursday, and I'm noting on your file that you're expecting that call.\"",
          "miniChallenge": "On your next two unresolved contacts, name a specific team and a specific day before you end the call.",
          "encouragingClose": "A named owner and a date are most of what stops a member calling back with the same question.",
          "_severity": "high",
          "_metric": "21 contacts flagged for name the adjudicator and the date",
          "wordCount": 129,
          "estimatedDurationSeconds": 52
        },
        {
          "cardId": "CARD-KEVIN-NGUYEN-3",
          "priorityRank": 3,
          "topicKey": "match_register",
          "affectedKpis": [
            "csat"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Let the Decision Set the Tone · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "13 of your 243 contacts this period (5.3%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Disability Claim Status (STD / LTD).",
          "positiveOpening": "Your first-contact work is solid: 4.01 CSAT there, well ahead of the 2.02 average on follow-ups.",
          "coachingFocus": "A declined claim after someone said it was covered is not a routine coverage question. Match your tone to how the member actually feels before explaining the plan rules.",
          "practicalGuidance": "Sounds like: \"You were told this was covered and then it was declined. I understand why that's frustrating, and I want to get you a clear answer, not just read you the booklet.\"",
          "miniChallenge": "On your next two declined-claim contacts, name the specific frustration in your own words before explaining the decision.",
          "encouragingClose": null,
          "_severity": "high",
          "_metric": "13 contacts flagged for let the decision set the tone",
          "wordCount": 120,
          "estimatedDurationSeconds": 48
        },
        {
          "cardId": "CARD-KEVIN-NGUYEN-4",
          "priorityRank": 4,
          "topicKey": "acknowledge_effort",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Count the Calls They've Made · Coverage & Eligibility Questions (routine)",
          "personalNote": "13 of your 243 contacts this period (5.3%) mostly on Coverage & Eligibility Questions (routine) and Claim Payment & Reimbursement Status.",
          "positiveOpening": "Your first-contact work is solid: 4.01 CSAT there, well ahead of the 2.02 average on follow-ups.",
          "coachingFocus": "When a member says they've already called or waited on hold, acknowledge the repeat specifically before moving to the answer.",
          "practicalGuidance": "Sounds like: \"I can see this is your third call on this claim this month. I'm sorry you've had to chase it. Let's get it closed today.\"",
          "miniChallenge": "On your next follow-up contact, name how many times they've already reached out before answering the question itself.",
          "encouragingClose": null,
          "_severity": "medium",
          "_metric": "13 contacts flagged for count the calls they've made",
          "wordCount": 102,
          "estimatedDurationSeconds": 41
        }
      ]
    }
  },
  "marc-tremblay": {
    "name": "Marc Tremblay",
    "slug": "marc-tremblay",
    "volume": 258,
    "firstContacts": 184,
    "continuationContacts": 74,
    "ahtSeconds": 485,
    "fcrPct": 85.3,
    "csat": 3.4,
    "firstCsat": 3.99,
    "continuationCsat": 1.95,
    "qaScore": 86.6,
    "continuationQa": 83.1,
    "ahtSeries": [
      472,
      480,
      486,
      478,
      515
    ],
    "fcrSeries": [
      85.5,
      90.4,
      79.2,
      78.8,
      93.2
    ],
    "csatSeries": [
      3.48,
      3.48,
      3.31,
      3.21,
      3.52
    ],
    "processAdherencePct": 94.6,
    "resolutionRatePct": 85.3,
    "criticalFailures": 24,
    "criticalFailureSeries": [
      6,
      6,
      2,
      5,
      5
    ],
    "empathy": 3.49,
    "behaviourFirst": {
      "clarity": 4.26,
      "ownership": 4.02,
      "listening": 4.09,
      "professionalism": 4.3,
      "empathy": 4.13,
      "managing_frustration": 3.98
    },
    "behaviourContinuation": {
      "clarity": 3.26,
      "ownership": 2.04,
      "listening": 2.89,
      "professionalism": 4.05,
      "empathy": 1.9,
      "managing_frustration": 2.08
    },
    "role": "Member Services Representative",
    "team": "Nadia Chowdhury",
    "qaSeries": [
      86.4,
      86.4,
      86.4,
      86.8,
      86.7
    ],
    "firstQa": 87.1,
    "coachingPack": {
      "packId": "pack-sunlife-marc-tremblay",
      "cycleType": "weekly_insight",
      "packSummary": "Four things from your last 258 contacts, starting with 72 follow-up or declined-claim contacts opened without picking up the prior context, mostly on Claim Decision Disputes (Health, Drug & Dental), Additional Information Requests (Forms, Prior Auth, Attachments).",
      "packReason": "Built from your own contacts this period, 135 across these patterns, where a small change in how you opened or closed would have made the contact easier for the member.",
      "cardCount": 4,
      "estimatedPackDurationSeconds": 197,
      "packWordCount": 494,
      "cards": [
        {
          "cardId": "CARD-MARC-TREMBLAY-1",
          "priorityRank": 1,
          "topicKey": "open_with_incident",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Start From the Last Call · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "72 of your 74 follow-up contacts this period (97.3%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Additional Information Requests (Forms, Prior Auth, Attachments).",
          "positiveOpening": "Your first-contact work is solid: 3.99 CSAT there, well ahead of the 1.95 average on follow-ups.",
          "coachingFocus": "When a member is calling back about a claim or a disability file that's already open, say what you can see has already happened before you ask them anything new.",
          "practicalGuidance": "Sounds like: \"I can see you called on the 3rd about this claim and were told it would be covered. Let me pick it up from there instead of starting over.\"",
          "miniChallenge": "On your next three follow-up contacts, open by naming what you can already see on the file before asking a new question.",
          "encouragingClose": "Members push back less when they feel remembered, not restarted.",
          "_severity": "high",
          "_metric": "72 contacts flagged for start from the last call",
          "wordCount": 135,
          "estimatedDurationSeconds": 54
        },
        {
          "cardId": "CARD-MARC-TREMBLAY-2",
          "priorityRank": 2,
          "topicKey": "route_forward",
          "affectedKpis": [
            "repeat_contact_rate",
            "fcr"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Name the Adjudicator and the Date · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "28 of your 258 contacts this period (10.9%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Additional Information Requests (Forms, Prior Auth, Attachments).",
          "positiveOpening": "Your first-contact work is solid: 3.99 CSAT there, well ahead of the 1.95 average on follow-ups.",
          "coachingFocus": "Before closing a claim or disability contact you can't resolve on the call, name who owns the next step and the day the member will hear back.",
          "practicalGuidance": "Sounds like: \"The adjudication team has this now. You'll hear from them by Thursday, and I'm noting on your file that you're expecting that call.\"",
          "miniChallenge": "On your next two unresolved contacts, name a specific team and a specific day before you end the call.",
          "encouragingClose": "A named owner and a date are most of what stops a member calling back with the same question.",
          "_severity": "high",
          "_metric": "28 contacts flagged for name the adjudicator and the date",
          "wordCount": 131,
          "estimatedDurationSeconds": 52
        },
        {
          "cardId": "CARD-MARC-TREMBLAY-3",
          "priorityRank": 3,
          "topicKey": "match_register",
          "affectedKpis": [
            "csat"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Let the Decision Set the Tone · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "19 of your 258 contacts this period (7.4%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Disability Claim Status (STD / LTD).",
          "positiveOpening": "Your first-contact work is solid: 3.99 CSAT there, well ahead of the 1.95 average on follow-ups.",
          "coachingFocus": "A declined claim after someone said it was covered is not a routine coverage question. Match your tone to how the member actually feels before explaining the plan rules.",
          "practicalGuidance": "Sounds like: \"You were told this was covered and then it was declined. I understand why that's frustrating, and I want to get you a clear answer, not just read you the booklet.\"",
          "miniChallenge": "On your next two declined-claim contacts, name the specific frustration in your own words before explaining the decision.",
          "encouragingClose": null,
          "_severity": "high",
          "_metric": "19 contacts flagged for let the decision set the tone",
          "wordCount": 120,
          "estimatedDurationSeconds": 48
        },
        {
          "cardId": "CARD-MARC-TREMBLAY-4",
          "priorityRank": 4,
          "topicKey": "acknowledge_effort",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Count the Calls They've Made · Additional Information Requests (Forms, Prior Auth, Attachments)",
          "personalNote": "16 of your 258 contacts this period (6.2%) mostly on Additional Information Requests (Forms, Prior Auth, Attachments) and Digital Access & Claim Submission (App, Portal, Chat Handoff).",
          "positiveOpening": "Your first-contact work is solid: 3.99 CSAT there, well ahead of the 1.95 average on follow-ups.",
          "coachingFocus": "When a member says they've already called or waited on hold, acknowledge the repeat specifically before moving to the answer.",
          "practicalGuidance": "Sounds like: \"I can see this is your third call on this claim this month. I'm sorry you've had to chase it. Let's get it closed today.\"",
          "miniChallenge": "On your next follow-up contact, name how many times they've already reached out before answering the question itself.",
          "encouragingClose": null,
          "_severity": "medium",
          "_metric": "16 contacts flagged for count the calls they've made",
          "wordCount": 108,
          "estimatedDurationSeconds": 43
        }
      ]
    }
  },
  "priya-sandhu": {
    "name": "Priya Sandhu",
    "slug": "priya-sandhu",
    "volume": 355,
    "firstContacts": 249,
    "continuationContacts": 106,
    "ahtSeconds": 482,
    "fcrPct": 78.0,
    "csat": 3.35,
    "firstCsat": 3.96,
    "continuationCsat": 1.93,
    "qaScore": 85.2,
    "continuationQa": 84.2,
    "ahtSeries": [
      476,
      472,
      490,
      494,
      478
    ],
    "fcrSeries": [
      78.9,
      72.1,
      83.1,
      77.9,
      77.5
    ],
    "csatSeries": [
      3.31,
      3.29,
      3.23,
      3.38,
      3.55
    ],
    "processAdherencePct": 96.3,
    "resolutionRatePct": 78.0,
    "criticalFailures": 36,
    "criticalFailureSeries": [
      10,
      7,
      7,
      6,
      6
    ],
    "empathy": 3.44,
    "behaviourFirst": {
      "clarity": 4.21,
      "ownership": 4.06,
      "listening": 4.14,
      "professionalism": 4.36,
      "empathy": 4.09,
      "managing_frustration": 4.01
    },
    "behaviourContinuation": {
      "clarity": 3.2,
      "ownership": 1.98,
      "listening": 2.76,
      "professionalism": 4.01,
      "empathy": 1.91,
      "managing_frustration": 2.15
    },
    "role": "Member Services Representative",
    "team": "Nadia Chowdhury",
    "qaSeries": [
      85.4,
      85.1,
      85.2,
      85.2,
      85.5
    ],
    "firstQa": 88.2,
    "coachingPack": {
      "packId": "pack-sunlife-priya-sandhu",
      "cycleType": "weekly_insight",
      "packSummary": "Four things from your last 355 contacts, starting with 99 follow-up or declined-claim contacts opened without picking up the prior context, mostly on Disability Claim Status (STD / LTD), Additional Information Requests (Forms, Prior Auth, Attachments).",
      "packReason": "Built from your own contacts this period, 236 across these patterns, where a small change in how you opened or closed would have made the contact easier for the member.",
      "cardCount": 4,
      "estimatedPackDurationSeconds": 195,
      "packWordCount": 487,
      "cards": [
        {
          "cardId": "CARD-PRIYA-SANDHU-1",
          "priorityRank": 1,
          "topicKey": "open_with_incident",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Start From the Last Call · Disability Claim Status (STD / LTD)",
          "personalNote": "99 of your 106 follow-up contacts this period (93.4%) mostly on Disability Claim Status (STD / LTD) and Additional Information Requests (Forms, Prior Auth, Attachments).",
          "positiveOpening": "Your first-contact work is solid: 3.96 CSAT there, well ahead of the 1.93 average on follow-ups.",
          "coachingFocus": "When a member is calling back about a claim or a disability file that's already open, say what you can see has already happened before you ask them anything new.",
          "practicalGuidance": "Sounds like: \"I can see you called on the 3rd about this claim and were told it would be covered. Let me pick it up from there instead of starting over.\"",
          "miniChallenge": "On your next three follow-up contacts, open by naming what you can already see on the file before asking a new question.",
          "encouragingClose": "Members push back less when they feel remembered, not restarted.",
          "_severity": "high",
          "_metric": "99 contacts flagged for start from the last call",
          "wordCount": 134,
          "estimatedDurationSeconds": 54
        },
        {
          "cardId": "CARD-PRIYA-SANDHU-2",
          "priorityRank": 2,
          "topicKey": "route_forward",
          "affectedKpis": [
            "repeat_contact_rate",
            "fcr"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Name the Adjudicator and the Date · Disability Claim Status (STD / LTD)",
          "personalNote": "69 of your 355 contacts this period (19.4%) mostly on Disability Claim Status (STD / LTD) and Additional Information Requests (Forms, Prior Auth, Attachments).",
          "positiveOpening": "Your first-contact work is solid: 3.96 CSAT there, well ahead of the 1.93 average on follow-ups.",
          "coachingFocus": "Before closing a claim or disability contact you can't resolve on the call, name who owns the next step and the day the member will hear back.",
          "practicalGuidance": "Sounds like: \"The adjudication team has this now. You'll hear from them by Thursday, and I'm noting on your file that you're expecting that call.\"",
          "miniChallenge": "On your next two unresolved contacts, name a specific team and a specific day before you end the call.",
          "encouragingClose": "A named owner and a date are most of what stops a member calling back with the same question.",
          "_severity": "high",
          "_metric": "69 contacts flagged for name the adjudicator and the date",
          "wordCount": 130,
          "estimatedDurationSeconds": 52
        },
        {
          "cardId": "CARD-PRIYA-SANDHU-3",
          "priorityRank": 3,
          "topicKey": "match_register",
          "affectedKpis": [
            "csat"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Let the Decision Set the Tone · Disability Claim Status (STD / LTD)",
          "personalNote": "48 of your 355 contacts this period (13.5%) mostly on Disability Claim Status (STD / LTD) and Claim Decision Disputes (Health, Drug & Dental).",
          "positiveOpening": "Your first-contact work is solid: 3.96 CSAT there, well ahead of the 1.93 average on follow-ups.",
          "coachingFocus": "A declined claim after someone said it was covered is not a routine coverage question. Match your tone to how the member actually feels before explaining the plan rules.",
          "practicalGuidance": "Sounds like: \"You were told this was covered and then it was declined. I understand why that's frustrating, and I want to get you a clear answer, not just read you the booklet.\"",
          "miniChallenge": "On your next two declined-claim contacts, name the specific frustration in your own words before explaining the decision.",
          "encouragingClose": null,
          "_severity": "high",
          "_metric": "48 contacts flagged for let the decision set the tone",
          "wordCount": 120,
          "estimatedDurationSeconds": 48
        },
        {
          "cardId": "CARD-PRIYA-SANDHU-4",
          "priorityRank": 4,
          "topicKey": "acknowledge_effort",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Count the Calls They've Made · Disability Claim Status (STD / LTD)",
          "personalNote": "20 of your 355 contacts this period (5.6%) mostly on Disability Claim Status (STD / LTD) and Claim Payment & Reimbursement Status.",
          "positiveOpening": "Your first-contact work is solid: 3.96 CSAT there, well ahead of the 1.93 average on follow-ups.",
          "coachingFocus": "When a member says they've already called or waited on hold, acknowledge the repeat specifically before moving to the answer.",
          "practicalGuidance": "Sounds like: \"I can see this is your third call on this claim this month. I'm sorry you've had to chase it. Let's get it closed today.\"",
          "miniChallenge": "On your next follow-up contact, name how many times they've already reached out before answering the question itself.",
          "encouragingClose": null,
          "_severity": "medium",
          "_metric": "20 contacts flagged for count the calls they've made",
          "wordCount": 103,
          "estimatedDurationSeconds": 41
        }
      ]
    }
  },
  "ryan-macdonald": {
    "name": "Ryan MacDonald",
    "slug": "ryan-macdonald",
    "volume": 408,
    "firstContacts": 291,
    "continuationContacts": 117,
    "ahtSeconds": 490,
    "fcrPct": 83.6,
    "csat": 3.39,
    "firstCsat": 3.94,
    "continuationCsat": 2.02,
    "qaScore": 86.5,
    "continuationQa": 83.9,
    "ahtSeries": [
      487,
      499,
      479,
      500,
      482
    ],
    "fcrSeries": [
      83.6,
      81.1,
      76.8,
      87.1,
      88.0
    ],
    "csatSeries": [
      3.12,
      3.28,
      3.43,
      3.48,
      3.6
    ],
    "processAdherencePct": 93.9,
    "resolutionRatePct": 83.6,
    "criticalFailures": 41,
    "criticalFailureSeries": [
      12,
      12,
      6,
      5,
      6
    ],
    "empathy": 3.48,
    "behaviourFirst": {
      "clarity": 4.24,
      "ownership": 4.11,
      "listening": 4.14,
      "professionalism": 4.42,
      "empathy": 4.1,
      "managing_frustration": 3.93
    },
    "behaviourContinuation": {
      "clarity": 3.26,
      "ownership": 1.95,
      "listening": 2.81,
      "professionalism": 4.04,
      "empathy": 1.94,
      "managing_frustration": 2.08
    },
    "role": "Member Services Representative",
    "team": "Nadia Chowdhury",
    "qaSeries": [
      86.4,
      86.6,
      86.4,
      86.3,
      86.7
    ],
    "firstQa": 87.9,
    "coachingPack": {
      "packId": "pack-sunlife-ryan-macdonald",
      "cycleType": "weekly_insight",
      "packSummary": "Four things from your last 408 contacts, starting with 112 follow-up or declined-claim contacts opened without picking up the prior context, mostly on Claim Decision Disputes (Health, Drug & Dental), Digital Access & Claim Submission (App, Portal, Chat Handoff).",
      "packReason": "Built from your own contacts this period, 275 across these patterns, where a small change in how you opened or closed would have made the contact easier for the member.",
      "cardCount": 4,
      "estimatedPackDurationSeconds": 197,
      "packWordCount": 490,
      "cards": [
        {
          "cardId": "CARD-RYAN-MACDONALD-1",
          "priorityRank": 1,
          "topicKey": "open_with_incident",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Start From the Last Call · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "112 of your 117 follow-up contacts this period (95.7%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Digital Access & Claim Submission (App, Portal, Chat Handoff).",
          "positiveOpening": "Your first-contact work is solid: 3.94 CSAT there, well ahead of the 2.02 average on follow-ups.",
          "coachingFocus": "When a member is calling back about a claim or a disability file that's already open, say what you can see has already happened before you ask them anything new.",
          "practicalGuidance": "Sounds like: \"I can see you called on the 3rd about this claim and were told it would be covered. Let me pick it up from there instead of starting over.\"",
          "miniChallenge": "On your next three follow-up contacts, open by naming what you can already see on the file before asking a new question.",
          "encouragingClose": "Members push back less when they feel remembered, not restarted.",
          "_severity": "high",
          "_metric": "112 contacts flagged for start from the last call",
          "wordCount": 137,
          "estimatedDurationSeconds": 55
        },
        {
          "cardId": "CARD-RYAN-MACDONALD-2",
          "priorityRank": 2,
          "topicKey": "route_forward",
          "affectedKpis": [
            "repeat_contact_rate",
            "fcr"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Name the Adjudicator and the Date · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "70 of your 408 contacts this period (17.2%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Claim Payment & Reimbursement Status.",
          "positiveOpening": "Your first-contact work is solid: 3.94 CSAT there, well ahead of the 2.02 average on follow-ups.",
          "coachingFocus": "Before closing a claim or disability contact you can't resolve on the call, name who owns the next step and the day the member will hear back.",
          "practicalGuidance": "Sounds like: \"The adjudication team has this now. You'll hear from them by Thursday, and I'm noting on your file that you're expecting that call.\"",
          "miniChallenge": "On your next two unresolved contacts, name a specific team and a specific day before you end the call.",
          "encouragingClose": "A named owner and a date are most of what stops a member calling back with the same question.",
          "_severity": "high",
          "_metric": "70 contacts flagged for name the adjudicator and the date",
          "wordCount": 129,
          "estimatedDurationSeconds": 52
        },
        {
          "cardId": "CARD-RYAN-MACDONALD-3",
          "priorityRank": 3,
          "topicKey": "match_register",
          "affectedKpis": [
            "csat"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Let the Decision Set the Tone · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "64 of your 408 contacts this period (15.7%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Disability Claim Status (STD / LTD).",
          "positiveOpening": "Your first-contact work is solid: 3.94 CSAT there, well ahead of the 2.02 average on follow-ups.",
          "coachingFocus": "A declined claim after someone said it was covered is not a routine coverage question. Match your tone to how the member actually feels before explaining the plan rules.",
          "practicalGuidance": "Sounds like: \"You were told this was covered and then it was declined. I understand why that's frustrating, and I want to get you a clear answer, not just read you the booklet.\"",
          "miniChallenge": "On your next two declined-claim contacts, name the specific frustration in your own words before explaining the decision.",
          "encouragingClose": null,
          "_severity": "high",
          "_metric": "64 contacts flagged for let the decision set the tone",
          "wordCount": 120,
          "estimatedDurationSeconds": 48
        },
        {
          "cardId": "CARD-RYAN-MACDONALD-4",
          "priorityRank": 4,
          "topicKey": "acknowledge_effort",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Count the Calls They've Made · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "29 of your 408 contacts this period (7.1%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Coverage & Eligibility Questions (routine).",
          "positiveOpening": "Your first-contact work is solid: 3.94 CSAT there, well ahead of the 2.02 average on follow-ups.",
          "coachingFocus": "When a member says they've already called or waited on hold, acknowledge the repeat specifically before moving to the answer.",
          "practicalGuidance": "Sounds like: \"I can see this is your third call on this claim this month. I'm sorry you've had to chase it. Let's get it closed today.\"",
          "miniChallenge": "On your next follow-up contact, name how many times they've already reached out before answering the question itself.",
          "encouragingClose": null,
          "_severity": "medium",
          "_metric": "29 contacts flagged for count the calls they've made",
          "wordCount": 104,
          "estimatedDurationSeconds": 42
        }
      ]
    }
  },
  "sophie-belanger": {
    "name": "Sophie Belanger",
    "slug": "sophie-belanger",
    "volume": 279,
    "firstContacts": 194,
    "continuationContacts": 85,
    "ahtSeconds": 480,
    "fcrPct": 82.8,
    "csat": 3.38,
    "firstCsat": 3.93,
    "continuationCsat": 2.12,
    "qaScore": 85.5,
    "continuationQa": 81.8,
    "ahtSeries": [
      485,
      469,
      483,
      477,
      484
    ],
    "fcrSeries": [
      81.5,
      77.6,
      83.9,
      82.8,
      87.5
    ],
    "csatSeries": [
      3.46,
      3.02,
      3.32,
      3.57,
      3.48
    ],
    "processAdherencePct": 93.2,
    "resolutionRatePct": 82.8,
    "criticalFailures": 24,
    "criticalFailureSeries": [
      6,
      6,
      8,
      1,
      3
    ],
    "empathy": 3.41,
    "behaviourFirst": {
      "clarity": 4.21,
      "ownership": 3.97,
      "listening": 4.13,
      "professionalism": 4.37,
      "empathy": 4.05,
      "managing_frustration": 3.94
    },
    "behaviourContinuation": {
      "clarity": 3.26,
      "ownership": 1.98,
      "listening": 2.79,
      "professionalism": 4.11,
      "empathy": 1.94,
      "managing_frustration": 2.18
    },
    "role": "Member Services Representative",
    "team": "Nadia Chowdhury",
    "qaSeries": [
      85.6,
      85.2,
      85.3,
      85.3,
      85.2
    ],
    "firstQa": 85.8,
    "coachingPack": {
      "packId": "pack-sunlife-sophie-belanger",
      "cycleType": "weekly_insight",
      "packSummary": "Four things from your last 279 contacts, starting with 81 follow-up or declined-claim contacts opened without picking up the prior context, mostly on Claim Payment & Reimbursement Status, Group Retirement Transfers & Withdrawals.",
      "packReason": "Built from your own contacts this period, 148 across these patterns, where a small change in how you opened or closed would have made the contact easier for the member.",
      "cardCount": 4,
      "estimatedPackDurationSeconds": 192,
      "packWordCount": 481,
      "cards": [
        {
          "cardId": "CARD-SOPHIE-BELANGER-1",
          "priorityRank": 1,
          "topicKey": "open_with_incident",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Start From the Last Call · Claim Payment & Reimbursement Status",
          "personalNote": "81 of your 85 follow-up contacts this period (95.3%) mostly on Claim Payment & Reimbursement Status and Group Retirement Transfers & Withdrawals.",
          "positiveOpening": "Your first-contact work is solid: 3.93 CSAT there, well ahead of the 2.12 average on follow-ups.",
          "coachingFocus": "When a member is calling back about a claim or a disability file that's already open, say what you can see has already happened before you ask them anything new.",
          "practicalGuidance": "Sounds like: \"I can see you called on the 3rd about this claim and were told it would be covered. Let me pick it up from there instead of starting over.\"",
          "miniChallenge": "On your next three follow-up contacts, open by naming what you can already see on the file before asking a new question.",
          "encouragingClose": "Members push back less when they feel remembered, not restarted.",
          "_severity": "high",
          "_metric": "81 contacts flagged for start from the last call",
          "wordCount": 131,
          "estimatedDurationSeconds": 52
        },
        {
          "cardId": "CARD-SOPHIE-BELANGER-2",
          "priorityRank": 2,
          "topicKey": "route_forward",
          "affectedKpis": [
            "repeat_contact_rate",
            "fcr"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Name the Adjudicator and the Date · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "32 of your 279 contacts this period (11.5%) mostly on Claim Decision Disputes (Health, Drug & Dental) and CDCP Pre-Authorization & Coverage.",
          "positiveOpening": "Your first-contact work is solid: 3.93 CSAT there, well ahead of the 2.12 average on follow-ups.",
          "coachingFocus": "Before closing a claim or disability contact you can't resolve on the call, name who owns the next step and the day the member will hear back.",
          "practicalGuidance": "Sounds like: \"The adjudication team has this now. You'll hear from them by Thursday, and I'm noting on your file that you're expecting that call.\"",
          "miniChallenge": "On your next two unresolved contacts, name a specific team and a specific day before you end the call.",
          "encouragingClose": "A named owner and a date are most of what stops a member calling back with the same question.",
          "_severity": "high",
          "_metric": "32 contacts flagged for name the adjudicator and the date",
          "wordCount": 128,
          "estimatedDurationSeconds": 51
        },
        {
          "cardId": "CARD-SOPHIE-BELANGER-3",
          "priorityRank": 3,
          "topicKey": "match_register",
          "affectedKpis": [
            "csat"
          ],
          "contentType": "scenario_example",
          "cardShape": "standard",
          "title": "Let the Decision Set the Tone · Claim Decision Disputes (Health, Drug & Dental)",
          "personalNote": "18 of your 279 contacts this period (6.5%) mostly on Claim Decision Disputes (Health, Drug & Dental) and Disability Claim Status (STD / LTD).",
          "positiveOpening": "Your first-contact work is solid: 3.93 CSAT there, well ahead of the 2.12 average on follow-ups.",
          "coachingFocus": "A declined claim after someone said it was covered is not a routine coverage question. Match your tone to how the member actually feels before explaining the plan rules.",
          "practicalGuidance": "Sounds like: \"You were told this was covered and then it was declined. I understand why that's frustrating, and I want to get you a clear answer, not just read you the booklet.\"",
          "miniChallenge": "On your next two declined-claim contacts, name the specific frustration in your own words before explaining the decision.",
          "encouragingClose": null,
          "_severity": "high",
          "_metric": "18 contacts flagged for let the decision set the tone",
          "wordCount": 120,
          "estimatedDurationSeconds": 48
        },
        {
          "cardId": "CARD-SOPHIE-BELANGER-4",
          "priorityRank": 4,
          "topicKey": "acknowledge_effort",
          "affectedKpis": [
            "csat",
            "repeat_contact_rate"
          ],
          "contentType": "trigger_action_reminder",
          "cardShape": "standard",
          "title": "Count the Calls They've Made · Claim Payment & Reimbursement Status",
          "personalNote": "17 of your 279 contacts this period (6.1%) mostly on Claim Payment & Reimbursement Status and Group Retirement Transfers & Withdrawals.",
          "positiveOpening": "Your first-contact work is solid: 3.93 CSAT there, well ahead of the 2.12 average on follow-ups.",
          "coachingFocus": "When a member says they've already called or waited on hold, acknowledge the repeat specifically before moving to the answer.",
          "practicalGuidance": "Sounds like: \"I can see this is your third call on this claim this month. I'm sorry you've had to chase it. Let's get it closed today.\"",
          "miniChallenge": "On your next follow-up contact, name how many times they've already reached out before answering the question itself.",
          "encouragingClose": null,
          "_severity": "medium",
          "_metric": "17 contacts flagged for count the calls they've made",
          "wordCount": 102,
          "estimatedDurationSeconds": 41
        }
      ]
    }
  }
}

export const AGENT_METRIC_ORDER = [
  "aisha-rahman",
  "chloe-gagnon",
  "daniel-okafor",
  "harpreet-gill",
  "jasmine-wong",
  "kevin-nguyen",
  "marc-tremblay",
  "priya-sandhu",
  "ryan-macdonald",
  "sophie-belanger"
]

export const FLAGGED_AGENT_SLUGS = [
  "ryan-macdonald",
  "harpreet-gill",
  "daniel-okafor",
  "priya-sandhu"
]

export const TEAM_AGGREGATES = {
  "totalContacts": 3007,
  "qaScore": 86.31,
  "csat": 3.42,
  "firstCsat": 3.98,
  "continuationCsat": 2.01,
  "ahtSeconds": 484,
  "fcrPct": 82.3,
  "criticalFailuresTotal": 287,
  "agentsWithCriticalFailures": 10
}

export const CARD_SHAPE_LABELS = {
  standard: "Standard",
  situation_led: "Situation-led",
  short: "Quick note",
}

export const CONTENT_TYPE_LABELS = {
  knowledge_check: "Knowledge check",
  scenario_example: "Scenario",
  trigger_action_reminder: "Trigger and action",
}
