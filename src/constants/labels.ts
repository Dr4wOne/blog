// UI text labels and strings - for localization & consistency
// All hardcoded UI text should come from here

export const SITE = {
  title: 'DR4W — Signal Log',
  description: 'Technical essays on AI, systems, and engineering',
  tagline: 'A guided tour from LLMs to agents, harnesses, and tooling',
} as const;

export const ARTICLE_PARTS = {
  1: {
    number: 'LOG 01',
    title: 'What is an LLM?',
    intro: 'By the end of this part you\'ll know what this "AI" we chat with really is, what it does under the hood, and what it is not.',
  },
  2: {
    number: 'LOG 02',
    title: 'Tokenization',
    intro: 'By the end of this part you\'ll understand what the model really "sees" when you type something, why that explains odd behaviors, and why it costs money.',
  },
  3: {
    number: 'LOG 03',
    title: 'Embeddings & vectors',
    intro: 'By the end of this part you\'ll understand how a computer can measure that "car" and "automobile" mean nearly the same thing.',
  },
  4: {
    number: 'LOG 04',
    title: 'Transformers & attention',
    intro: 'By the end of this part you\'ll understand the machinery inside every modern LLM, the transformer, and attention.',
  },
  5: {
    number: 'LOG 05',
    title: 'Inference, context & prompting',
    intro: 'By the end of this part you\'ll understand what happens when you hit enter: context window, randomness, prompting, and hallucination.',
  },
  6: {
    number: 'LOG 06',
    title: 'What is an agent?',
    intro: 'By the end of this part you\'ll understand how AI goes from answering text to doing things in the world.',
  },
  7: {
    number: 'LOG 07',
    title: 'What is a harness?',
    intro: 'By the end of this part you\'ll understand what a harness is and why the model alone does nothing useful.',
  },
  8: {
    number: 'LOG 08',
    title: 'The tooling we use',
    intro: 'By the end of this part you\'ll recognize the pieces that show up day to day and know what each is for.',
  },
} as const;

export const SECTION_TYPES = {
  core: 'Core Idea',
  analogy: 'Analogy',
  deepDive: 'Deep Dive',
  memory: 'Key Insight',
  test: 'In Practice',
  next: 'Next',
  misconceptions: 'Common Misconceptions',
} as const;

export const FOOTER = {
  copyright: '© 2026 DR4W. All rights reserved.',
  tagline: 'Signal Log — Essays on AI, systems, and engineering.',
  exploreMore: 'Explore More',
  mainSite: 'Daniel Baumann\'s Main Site',
  about: 'About',
  projects: 'Projects',
  aiAgents: 'AI & Agents',
  signalLog: 'Signal Log',
  blogHome: 'Blog Home',
  allArticles: 'All Articles',
  footerTagline: 'Signal Log — Technical essays on AI, systems, and engineering',
  footerCopyright: '© 2026 Daniel Baumann',
} as const;

export const NAVIGATION = {
  home: 'Home',
  articles: 'Articles',
  archive: 'Archive',
  about: 'About',
} as const;

export const TABLE_OF_CONTENTS = {
  title: 'Table of Contents',
  readingTime: 'min read',
} as const;

export const DIAGRAM_TITLES = {
  D1: 'Autocomplete in action',
  D2: 'Three phases to assistant',
  D3: 'Tokenizer example',
  D4: 'Semantic space',
  D5: 'Context window assembly',
  D9: 'Temperature control',
  D11: 'Multi-head attention',
  D12: 'Agent loop',
  D13: 'Harness architecture',
  D15: 'Directory structure',
  D16: 'System architecture',
} as const;

export const MISSION_BRIEFING = {
  title: 'MISSION BRIEFING',
  yearAndSetup: 'Year 2194. The war ended. But the protocol remained. A reactivated infiltrator unit awakens to a human distress signal: ',
  distressSignal: '"…if anyone can hear this… we are still here…"',
  noMathRequired: 'No math required.',
  byTheEndYouWill: 'By the end you\'ll understand:',
  whatIsLLM: 'What an LLM actually is (and isn\'t)',
  howItGetsConverted: 'How it gets turned into an agent that acts in the world',
  tooling: 'The tooling around it (harnesses, rules, workflows, MCP)',
  whyMatters: 'Why context, tokens, and temperature matter',
} as const;

export const INTERACTIVE_WIDGETS = {
  tokenizerTitle: '💾 Try tokenization',
  tokenizerHint: 'Type text and see how it splits into tokens',
  tokenizerPlaceholder: 'Type something... (e.g., unconstitutionally)',
  tokenizerNote: 'Note: token counts are approximate (illustrative, not from a real tokenizer)',
  temperatureTitle: '🎲 Temperature slider',
  temperatureHint: 'Adjust randomness and see sample completions change',
  temperatureLabel: 'Temperature:',
  temperatureSample1: 'Sample 1:',
  temperatureSample2: 'Sample 2:',
  temperatureLikelyPrefix: 'The next word is likely:',
  temperaturePossiblyPrefix: 'Or possibly:',
  agentTitle: '🤖 Agent loop stepper',
  agentHint: 'Step through: Goal → Reason → Act → Observe',
  agentGoal: 'GOAL',
  agentExampleGoal: 'Fix the login bug in auth.ts',
  agentReason: 'REASON',
  agentReasonExample: 'Read the file to understand the issue',
  agentAct: 'ACT',
  agentActExample: 'Run: npm test',
  agentObserve: 'OBSERVE',
  agentObserveExample: 'Test output: PASS',
  agentGoalMet: 'GOAL MET',
  agentGoalMetExample: '✓ Bug fixed',
  agentNextBtn: '► Next Step',
  agentResetBtn: '↻ Reset',
  agentApprovalRequired: '⚠ APPROVAL REQUIRED',
  agentApprovalAction: 'Run: npm test',
  agentApproveBtn: '✓ Approve',
  agentDenyBtn: '✗ Deny',
  agentDeniedMsg: '❌ Agent loop denied. Returning to planning phase.',
} as const;

export const MISSION_LOG = {
  title: 'MISSION LOG',
} as const;
