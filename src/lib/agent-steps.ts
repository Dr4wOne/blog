// The agent stepper's script: one coding task, step by step.
export interface Step {
  kind: 'goal' | 'reason' | 'act' | 'approve' | 'observe' | 'done'
  label: string
  text: string
  code?: string
}

export const STEPS: Step[] = [
  { kind: 'goal', label: 'Goal', text: 'Fix the failing login test.' },
  {
    kind: 'reason',
    label: 'Reason',
    text: 'I need to see the failure first. I’ll run the test suite.',
  },
  {
    kind: 'act',
    label: 'Tool call',
    text: 'The model asks the harness to run a command.',
    code: 'npm test -- login',
  },
  {
    kind: 'approve',
    label: 'Approval',
    text: 'The harness pauses: running commands needs your permission. If you say no, the command never runs and the agent stops to ask how to proceed.',
  },
  {
    kind: 'observe',
    label: 'Observe',
    text: 'The test expected status 401 but got 500. The stack trace points at the token check.',
    code: 'Expected 401, received 500\n  at checkToken (src/auth.ts:42)',
  },
  {
    kind: 'reason',
    label: 'Reason',
    text: 'An expired token throws instead of returning 401. I’ll read that function.',
  },
  { kind: 'act', label: 'Tool call', text: 'Read a file.', code: 'read src/auth.ts' },
  {
    kind: 'observe',
    label: 'Observe',
    text: 'Line 42 calls verify() without catching the expiry error.',
  },
  {
    kind: 'act',
    label: 'Tool call',
    text: 'Edit the file: catch the expiry error and return 401.',
    code: 'edit src/auth.ts',
  },
  { kind: 'act', label: 'Tool call', text: 'Run the test again.', code: 'npm test -- login' },
  { kind: 'observe', label: 'Observe', text: 'All login tests pass.' },
  {
    kind: 'done',
    label: 'Done',
    text: 'Goal met. The agent stops and reports what it changed and why.',
  },
]

export const DENIED: Step = {
  kind: 'done',
  label: 'Stopped',
  text: 'You said no, so the command never runs. A good agent asks how you’d like to proceed instead of trying something else on its own.',
}
