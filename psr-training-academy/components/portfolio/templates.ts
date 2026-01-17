export type PortfolioStatus = 'draft' | 'ready' | 'shared' | 'signedoff';

export const PORTFOLIO_SECTIONS: Array<{
  key: string;
  title: string;
  help: string;
}> = [
  {
    key: 'context',
    title: 'Context (high-level, non-identifying)',
    help: 'Summarize the situation without personal data. Avoid names, addresses, DOBs, phone numbers.',
  },
  {
    key: 'safeguards',
    title: 'Safeguards and vulnerability checks',
    help: 'Record checks for vulnerability, interpreters, appropriate adult, and any immediate safeguards.',
  },
  {
    key: 'advice_structure',
    title: 'Advice structure (how you approached it)',
    help: 'Outline how you gathered facts, set expectations, and structured advice/strategy discussion.',
  },
  {
    key: 'decision_points',
    title: 'Decision points and rationale',
    help: 'What were the key choices, what information mattered, and why?',
  },
  {
    key: 'outcome',
    title: 'Outcome (training summary)',
    help: 'What happened next? Keep it educational and non-identifying.',
  },
];

export const PORTFOLIO_REFLECTIONS: Array<{
  key: string;
  prompt: string;
}> = [
  { key: 'what_went_well', prompt: 'What went well?' },
  { key: 'what_to_improve', prompt: 'What would you improve next time?' },
  { key: 'learning_points', prompt: 'Key learning points / standards referenced (high level).' },
];
