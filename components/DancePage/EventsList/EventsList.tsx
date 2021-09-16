import React from "react";
import { DanceEvent, FilterField, FilterFig } from "../data-types";
import DanceEventComp from "./DanceEventComp/DanceEventComp";
import styles from "./EventsList.module.css";

interface Props {
  events: DanceEvent[];
  filters: FilterFig;
}

// This compnoent should re-render every time the filters are changed.
// If the events were in DancePage.tsx the entire page would re-render when the filters change
// and that would be sub-optimal at best and cause probems with the filters at worst.
export default function EventsList({ events, filters }: Props) {
  const applyFilter = (event: DanceEvent) => {
    0;
    const filts = filters;
    // If every value is blank
    return (Object.keys(filts) as FilterField[]).every(
      // The filter is empty or the event has the matching value
      (k) => !filts[k].length || filts[k].includes(event[k])
    );
    // Object.values(filts).every((v) =>
    //   !v
    //     ? true
    //     :
    // );
  };
  const inPerson = events.filter((e) => e.inPerson === "Yes" && applyFilter(e));
  const notInPerson = events.filter(
    (e) => e.inPerson === "No" && applyFilter(e)
  );
  return (
    <div className={styles["body-el"]}>
      {!events.length ? (
        <div className={styles["loading"]}>Loading Events...</div>
      ) : (
        <section>
          <h2>In Person Events</h2>
          <div className={styles["list"]}>
            {inPerson.map((event, i) => (
              <DanceEventComp event={event} index={i} key={i}></DanceEventComp>
            ))}
          </div>
          <h2>Other events to watch out for</h2>
          <div className={styles["list"]}>
            {notInPerson.map((event, i) => (
              <DanceEventComp event={event} index={i} key={i}></DanceEventComp>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
