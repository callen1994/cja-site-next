// Type alias, staffing needs is a 7 element list with number of people needed every day
export type StaffingNeeds = [
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

// Type alias, availability is a 7 element list with boolean for availability each day
export type Availability = [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean
];
export type Status = 'Applicants' | 'Scheduled' | 'Not Interested';

// These need to be in this order becuase of how I'm
// doing the "looks good" and "looks bad" buttons
export const STATUSES: Status[] = ['Not Interested', 'Applicants', 'Scheduled'];
export const DEFAULT_STATUS: Status = 'Applicants';
export interface Recruit {
  id: number;
  availability: Availability;
  canCarPool: boolean;
  // * notes on why I called it this *
  specialSkill: boolean;
  name: string;
  status: Status;
}

export const MAX_CREW = 10;
export const DAY_LU = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];

export function nextGroup(g: Status, direction: 1 | -1) {
  // I don't want it to go out of range of the list
  const newIndex = stayBetween(
    0,
    STATUSES.indexOf(g) + direction,
    STATUSES.length - 1
  );
  return STATUSES[newIndex];
}

function stayBetween(min: number, val: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

// * notes on why I called it this *
// When I was first writing this I knew I wanted two criteria for what a given crew member
// could bring to the table, but having a car was the only skill I could think of for some reason,
// so I decided to go with "specialSkill" as a placeholder, and refactoring it now wouldn't really be worth it
