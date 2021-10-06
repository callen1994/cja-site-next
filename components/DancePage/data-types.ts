export type FilterField = "city" | "dayOfWeek" | "inPerson" | "style";

export interface DanceEvent {
  // What?
  title: string;
  style: string;
  inPerson: "Yes" | "No";

  // When
  dayOfWeek: string;
  // how often it repeats
  repetition: string;
  time: string;

  // Where
  city: string;
  address: string;

  // Other info
  links: string;
  blurb: string;
  img: string;
}

export interface FilterFig {
  dayOfWeek: string[];
  city: string[];
  inPerson: string[];
  style: string[];
}

export interface FilterOptions {
  dayOfWeek: string[];
  city: string[];
  inPerson: string[];
  style: string[];
}

export const FILTERS: FilterField[] = [
  "city",
  "dayOfWeek",
  // 'inPerson',
  "style",
];

export const MT_FILTER_FIG: FilterFig = {
  dayOfWeek: [],
  city: [],
  inPerson: [],
  style: [],
};

export const MT_FILTER_OPTS: FilterOptions = {
  dayOfWeek: [],
  city: [],
  inPerson: [],
  style: [],
};
