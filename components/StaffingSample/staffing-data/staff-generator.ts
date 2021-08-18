import { random } from 'lodash';
import { firstNames, lastNames } from './random-names';
import {
  Availability,
  DEFAULT_STATUS,
  Recruit,
  StaffingNeeds
} from './staffing.data-types';

export type RealNeeds = { amt: number; cpl: boolean; skl: boolean }[];

// When I do the

export function makeRecruits(needs: StaffingNeeds): Recruit[] {
  console.log('Making Recruits');
  const generator = randomRecruitGenerator(needs);
  const ret = new Array(39).fill(0).map(() => {
    const ret = generator.next();
    return ret.value as Recruit;
  });
  return ret;
}

// Been watching some cool videos about generator functions so I figured I'd use one
// since "generator" is in the file name
export function* randomRecruitGenerator(needs: StaffingNeeds) {
  let id = 0;
  while (true) {
    id = id + 1;
    if (id === 1) yield INIT_GUY;
    else yield randomRecruit(id, needs);
  }
}

const randElement = (list: any[]) => list[random(list.length - 1)];
const rnd = () => !!random(1);

export function randomRecruit(id: number, needs: StaffingNeeds): Recruit {
  return {
    id,
    availability: [...needs].map(rnd) as Availability,
    canCarPool: rnd(),
    specialSkill: rnd(),
    name: `${randElement(firstNames)} ${randElement(lastNames)}`,
    status: DEFAULT_STATUS
  };
}

const INIT_GUY = {
  id: 1,
  availability: [true, true, false, false, true, true, true] as Availability,
  canCarPool: true,
  specialSkill: true,
  name: 'Connor Allen',
  status: DEFAULT_STATUS
};

export function getRealNeeds(
  recruited: Recruit[],
  needs: StaffingNeeds
): RealNeeds {
  return [...needs].map((day, i) => {
    const avail = recruited.filter((r) => r.availability[i]);
    return {
      // I dont' want this going below 0
      amt: Math.max(0, day - avail.length),
      cpl: avail.some((r) => r.canCarPool),
      skl: avail.some((r) => r.specialSkill)
    };
  });
}

const perfectCrew = (needs: RealNeeds): Recruit => ({
  id: -1,
  availability: [...needs].map(() => true) as Availability,
  canCarPool: true,
  specialSkill: true,
  name: `Connor`,
  status: DEFAULT_STATUS
});

export function scoreCrew(recruit: Recruit, needs: RealNeeds): number {
  const getScore = (r: Recruit) =>
    needs
      // They only get an availability score on days that they're available
      .filter((d, i) => r.availability[i])
      .map(
        (day) =>
          // They get points for being available (especially on days we need)
          day.amt +
          // They get three points for being able to carpool/skill on a day that needs it
          (r.canCarPool && !day.cpl ? 3 : 0) +
          (r.specialSkill && !day.skl ? 3 : 0)
      )
      .reduce((a, b) => a + b, 0);
  return getScore(recruit) / (getScore(perfectCrew(needs)) || 1);
}

export function finished(needs: StaffingNeeds, recruited: Recruit[]): boolean {
  const realNeeds = getRealNeeds(recruited, needs);
  return scoreCrew(perfectCrew(realNeeds), realNeeds) === 0;
}

///////////////////////////////////////////////////////////////////////////
// Mostly for fun, I wrote a way to solve this programatically
// I was originally using this to ensure that the puzzle was solvable for the user
// with random recruits, but this is an O of n! time function and that blows.
//
// Populating 50 random recruits will almost certainly produce a solvable result
// and double checking that with the computer doesn't add a lot of value, and it can take
// a lot of time.
//
// Most of the time it's very quick, but if the algorithm needs to search more than around 20
// elements, it stops being viable. I was thinking of setting up a system where it throws an error
// when it takes longer than 5000 iterations or something. I could either re-run make
// recruits to hope for an easy list.
//
// Or I could use that to identify a set that was hard for the
// computer and see how those are to try and solve as a human...
///////////////////////////////////////////////////////////////////////////

// function staffIt(
//   toRecruit: Recruit[],
//   needs: StaffingNeeds,
//   recruited: Recruit[] = []
// ): Recruit[] | false {
//   // This is a depth-first search, essentially trying every combination of recruits until it can
//   // fill the needs of every day with less than 10 recruited.

//   // amt, cpl, skl = ammount, carpool, specialSkill
//   const realNeeds: RealNeeds = getRealNeeds(recruited, needs);

//   // If all the days on the real needs are filled, then we've done it
//   if (realNeeds.every(({ amt, cpl, skl }) => amt <= 0 && cpl && skl))
//     return [...recruited];
//   // If we haven't done it with 10 recruits
//   if (recruited.length === MAX_CREW) return false;
//   // If there are no more recruits to do it with, then we've failed
//   if (toRecruit.length === 0) return false;
//   // If there aren't enough people in the list to fill the busiest day don't bother with the rest
//   if (toRecruit.length < Math.max(...realNeeds.map((d) => d.amt))) return false;

//   const sorted = [...toRecruit].sort((r1, r2) =>
//     scoreCrew(r1, realNeeds) < scoreCrew(r2, realNeeds) ? 1 : -1
//   );
//   const sliceFirst = sorted.slice(1);
//   const tryFirst = staffIt(sliceFirst, needs, [...recruited, sorted[0]]);
//   // If recruiting with the first guy in the list fails, he's not in the solution so move on
//   if (tryFirst) return tryFirst;
//   return staffIt(sliceFirst, needs, recruited);
// }
