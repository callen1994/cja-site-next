import React, { useEffect, useRef, useState } from "react";
import { getStyles } from "../../utils";
import {
  ExplainState,
  EXPLAIN_SERVICE,
} from "../ExplainOverlay/ExplainOverlay.service";
import CarIcon from "../Icons/CarIcon";
import StarIcon from "../Icons/StarIcon";
import ThumbIcon from "../Icons/ThumbIcon";
import {
  DAY_LU,
  nextGroup,
  Status,
} from "../staffing-data/staffing.data-types";
import { SET_HIGHLIGHT } from "../StaffingChart/StaffingChart";
import { RecruitWithScore } from "../StaffingSample";
import styles from "./RecruitShower.module.css";

interface Props {
  r: RecruitWithScore;
  moveRecruit: (id: number, newStatus: Status) => void;
}

export default function RecruitShower({ r, moveRecruit }: Props) {
  const myBody = useRef<HTMLDivElement>(null);
  const [explainState, setExplainState] = useState<ExplainState>(
    EXPLAIN_SERVICE.explainState
  );

  // Use Effect with an empty dependencies array is only called when the component mounts
  useEffect(() => {
    // When nextState is called EXPLAIN_SERVICE will notify all it's toNotify members
    EXPLAIN_SERVICE.toNotify.push(setExplainState);
  }, []);

  // I was gonna add keyboard navigation, but it requires disabling keyboard scrolling
  // and from an acessibility standpoint I don't know what's best...
  const keyHandler = (key: React.KeyboardEvent) => {
    if (key.key === "ArrowUp")
      document.getElementById(`CrewShower${r.id - 1}`)?.focus();
    if (key.key === "ArrowDown")
      document.getElementById(`CrewShower${r.id + 1}`)?.focus();
  };

  const highlighttMe = () => {
    // Only highlight them if they aren't already scheduled
    if (r.status !== "Scheduled") SET_HIGHLIGHT(r);
  };

  const doMove = (direction: 1 | -1) => {
    // I want to set the highlighted crew to none when the crew moves because I want to de-highlight the crew that's was clicked because it will be invisible
    // I had previously set the highlight to the next crew, but that was a little too busy and confusing.
    SET_HIGHLIGHT(null);
    moveRecruit(r.id, nextGroup(r.status, direction));
  };

  return (
    <div
      // Adding the explain state here allows me to style based on it
      // I only want to apply explanation styling to the first recruit
      className={`${styles.RecruitShower} ${r.id === 1 ? explainState : ""}`}
      onKeyUpCapture={keyHandler}
      onFocusCapture={highlighttMe}
      onBlurCapture={() => SET_HIGHLIGHT(null)}
    >
      <div
        id={`CrewShower${r.id}`}
        className={getStyles(styles, "recruit-row " + r.status)}
        tabIndex={0}
        ref={myBody}
      >
        <div className={styles["name"]}>
          {r.id}. {r.name}
        </div>
        <div className={getStyles(styles, "indicator " + r.canCarPool)}>
          <label>Can Drive</label>
          <CarIcon></CarIcon>
        </div>
        <div className={getStyles(styles, "indicator " + r.specialSkill)}>
          <label>Team Leader</label>
          <StarIcon></StarIcon>
        </div>

        <div className={styles["score"]}>{Math.ceil(r.score * 100)}</div>
        <button className={styles["looks-good"]} onClick={() => doMove(1)}>
          <ThumbIcon></ThumbIcon>
        </button>
        <button className={styles["looks-bad"]} onClick={() => doMove(-1)}>
          <ThumbIcon></ThumbIcon>
        </button>
      </div>
      <div className={styles["details"]}>
        <label>Available</label>
        {r.availability.map((avail, i) => (
          <div
            key={i}
            className={getStyles(styles, "day-of-week " + (avail ? "yes" : ""))}
          >
            {DAY_LU[i]}
          </div>
        ))}
      </div>
    </div>
  );
}
