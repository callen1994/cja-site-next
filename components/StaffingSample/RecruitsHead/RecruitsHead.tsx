import React, { useEffect, useState } from "react";
import { getStyles } from "../../Utilities/utils";
import {
  ExplainState,
  EXPLAIN_SERVICE,
} from "../ExplainOverlay/ExplainOverlay.service";
import ChevronIcon from "../../Utilities/Icons/ChevronIcon";
import { nextGroup, Status } from "../staffing-data/staffing.data-types";
import { SortType } from "../StaffingSample";
import styles from "./RecruitsHead.module.css";
import { Dropdown } from "semantic-ui-react";

interface Props {
  group: Status;
  sort: SortType;
  updateSort: (sort: SortType) => void;
  updateGroup: (newBucket: Status) => void;
}

export default function RecruitsHead({
  group,
  sort,
  updateSort,
  updateGroup,
}: Props) {
  const [explainState, setExplainState] = useState<ExplainState>(
    EXPLAIN_SERVICE.explainState
  );

  // Use Effect with an empty dependencies array is only called when the component mounts
  useEffect(() => {
    // When nextState is called EXPLAIN_SERVICE will notify all it's toNotify members
    EXPLAIN_SERVICE.toNotify.push(setExplainState);
  }, []);

  return (
    <div className={`${styles["RecruitsHead"]} ${explainState}`}>
      {/* For keyboard access I want the  */}
      <div
        className={getStyles(styles, "group " + explainState)}
        tabIndex={0}
        onKeyUp={(e) =>
          e.key === "ArrowRight"
            ? updateGroup(nextGroup(group, 1))
            : e.key === "ArrowLeft"
            ? updateGroup(nextGroup(group, -1))
            : ""
        }
      >
        <button
          tabIndex={-1}
          className={styles["prev"]}
          onClick={() => updateGroup(nextGroup(group, -1))}
        >
          <div className={styles["button-body"]}>
            <ChevronIcon />
          </div>
        </button>
        <h2 className={styles["group-name"]}>{group}</h2>
        <button
          tabIndex={-1}
          className={styles["next"]}
          onClick={() => updateGroup(nextGroup(group, 1))}
        >
          <div className={styles["button-body"]}>
            <ChevronIcon />
          </div>
        </button>
      </div>
      <div className={getStyles(styles, "sort " + explainState)}>
        <label htmlFor="sort">Sort by:</label>
        <Dropdown
          id={styles["myDropdown"]}
          placeholder=''
          fluid
          selection
          // After getting all the values, mung it to the type that the dropdown value wants
          options={[
            {value:'id', text: 'ID'},
            {value:'name', text: 'Name'},
            {value:'score', text: 'Score'}
          ]}
          value={sort}
          onChange={(event, data) => {
            console.log(data.value);
            updateSort(data.value as SortType);
          }}
        ></Dropdown>
      </div>
    </div>
  );
}
