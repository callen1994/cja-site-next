import PaisleySwish from "../FancyAssets/PaisleySwish/PaisleySwish";
import { cloneDeep } from "lodash";
// import { globalService } from "./DataService/service";
import EventFilter from "./EventFilter/EventFilter";
import EventsList from "./EventsList/EventsList";
import {
  DanceEvent,
  FilterFig,
  FilterOptions,
  FITLERS,
  MT_FITLER_FIG,
} from "./data-types";

import styles from "./DancePage.module.css";
import { useState } from "react";

// The data fetched from my google sheet is now going to be provided as props
interface Props {
  blurbs: string[];
  filterOptions: FilterOptions;
  eventList: DanceEvent[];
}

export default function DancePage({ blurbs, filterOptions, eventList }: Props) {
  const [filterState, setFilter] = useState<FilterFig>(
    cloneDeep(MT_FITLER_FIG)
  );

  return (
    <div className={styles["body-el"]}>
      <h2 className={styles["header"]}>
        Dance <span className={styles["subtitle"]}>In The Bay</span>
      </h2>
      <PaisleySwish className={styles["my-swish"]}></PaisleySwish>
      <div className={styles["page-body"]}>
        {blurbs.map((b, p) => (
          <p className={styles["intro-blurb"]} key={p}>
            {b.split("\\n").map((seg, i) => (
              <span key={i}>
                {seg}
                <br />
              </span>
            ))}
          </p>
        ))}
        <div className={styles["filters"]}>
          {FITLERS.map((f, i) => (
            <EventFilter
              key={i}
              field={f}
              options={filterOptions[f]}
              selected={filterState[f]}
              filterChange={(newVal) =>
                setFilter((oldFilts) => ({ ...oldFilts, [f]: newVal }))
              }
            ></EventFilter>
          ))}
        </div>
        <EventsList events={eventList} filters={filterState}></EventsList>
      </div>
    </div>
  );
}
