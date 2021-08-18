// Making this a string makes it more intuitive which state refers to what
// and it's easier to re-order the states if I want to do something different

// I've divided this out so I can use "RealExplainState" as a key type on any lookup object(s)
// The "explain-x-y" allows me to use this as a css selector which I apply to stuff that needs to
// be displayed differently based on the explain state
export type RealExplainState =
  | 'start'
  | 'explain-chart-slots'
  | 'explain-chart-day'
  | 'explain-crew-display'
  | 'explain-crew-buttons'
  | 'explain-recruits-groups'
  | 'explain-recruits-sort';
export type ExplainState = RealExplainState | undefined;
export const NOTIFY_STATES: RealExplainState[] = [
  'start',
  'explain-chart-slots',
  'explain-chart-day',
  'explain-crew-display',
  'explain-crew-buttons',
  'explain-recruits-sort',
  'explain-recruits-groups'
];

export class ExplainService {
  // A list of functions to call when the explain state changes
  // This is how I notify subscribers of an event (this avoids installing Rxjs)
  toNotify: ((x: ExplainState) => void)[] = [];
  explainState: ExplainState = 'start';
  nextState() {
    // the notify state will be undefined when I next past the end of the list at which point everything that was wondering about the state should forget about it
    if (!this.explainState) return;
    const last = NOTIFY_STATES.indexOf(this.explainState);
    this.explainState = NOTIFY_STATES[last + 1];
    this.toNotify.map((fun) => fun(this.explainState));
  }
  // Used for the help button and used to make testing easier
  startOver() {
    this.explainState = 'start';
    this.toNotify.map((fun) => fun(this.explainState));
  }
  cleanup() {
    this.explainState = 'start';
    this.toNotify = [];
  }
}

export const EXPLAIN_SERVICE = new ExplainService();
