import React, { Fragment } from "react";
import {
  finished,
  getRealNeeds,
  makeRecruits,
  scoreCrew,
} from "./staffing-data/staff-generator";
import {
  DEFAULT_STATUS,
  MAX_CREW,
  Recruit,
  StaffingNeeds,
  Status,
} from "./staffing-data/staffing.data-types";
import RecruitShower from "./RecruitShower/RecruitShower";
import StaffingChart from "./StaffingChart/StaffingChart";
import RecruitsHead from "./RecruitsHead/RecruitsHead";
import { condContent } from "../Utilities/utils";
import ExplainOverlay from "./ExplainOverlay/ExplainOverlay";
import {
  EXPLAIN_SERVICE,
  ExplainState,
} from "./ExplainOverlay/ExplainOverlay.service";
import ThumbIcon from "../Utilities/Icons/ThumbIcon";
import HelpIcon from "../Utilities/Icons/HelpIcon";

import styles from "./StaffingSample.module.css";

interface Props {}
export type SortType = "id" | "name" | "score";

interface State {
  explainState: ExplainState;
  staffingNeeds: StaffingNeeds;
  recruits: Recruit[];
  sort: SortType;
  group: Status;
  done: boolean;
}

// By default recruits don't have a score, the score is determined by the staffing
// needs and updated dynamically as more recruits are hired.
// In my state I have recruits. When sorting/displaying them they have a calculated score
// when the recruit is manipulated, I will say "recruit with this id is changed"
export interface RecruitWithScore extends Recruit {
  score: number;
}

export default class StaffingSample extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const staffingNeeds: StaffingNeeds = [6, 3, 3, 3, 3, 5, 9];
    this.state = {
      staffingNeeds,
      sort: "id",
      group: DEFAULT_STATUS,
      // Start at 3, each "got it" click reduced it until it's 0, at which point it evaluates to false if anyone else is wondering about it.
      explainState: EXPLAIN_SERVICE.explainState,
      recruits: makeRecruits(staffingNeeds),
      done: false,
    };
  }

  componentDidMount() {
    // react got mad at me putting this into the constructor
    EXPLAIN_SERVICE.toNotify.push((explainState: ExplainState) =>
      this.setState({ explainState })
    );
  }

  componentWillUnmount() {
    // I'm handling all the cleanup in one place so I don't need to worry about it on children
    console.log("Initiailizing service chart");
    EXPLAIN_SERVICE.cleanup();
  }

  recruitsToShow(): RecruitWithScore[] {
    const realNeeds = getRealNeeds(
      this.state.recruits.filter((r) => r.status === "Scheduled"),
      this.state.staffingNeeds
    );
    const sort = this.state.sort;
    return this.state.recruits
      .filter((r) => r.status === this.state.group)
      .map((r) => ({ ...r, score: scoreCrew(r, realNeeds) }))
      .sort(
        (r1, r2) =>
          (r1[sort] > r2[sort] ? 1 : -1) *
          // I want it descening instead of ascending when the sort value is score
          (sort === "score" ? -1 : 1)
      );
  }

  render() {
    // Defining functions as consts in here avoids issues with "this" being wrong when I pass it to children
    const { sort, group, recruits, staffingNeeds, explainState, done } =
      this.state;
    const moveRecruit = (id: number, status: Status) => {
      // If I haven't maxed out my schedueld recruits
      if (recruits.filter((r) => r.status === "Scheduled").length < MAX_CREW) {
        // Update the recruits list where the indicate recruit has the new status
        const newRecruits = [...recruits].map((r) =>
          r.id === id ? { ...r, status } : r
        );
        this.setState({
          recruits: newRecruits,
        });
        if (newRecruits.filter((r) => r.status === "Scheduled").length >= 10) {
          // I want people to see the successful complete for a couple seconds before bringing up the done overlay
          setTimeout(() => this.setState({ done: true }), 1000);
        }
      }
    };

    const updateGroup = (group: Status) => this.setState({ group });
    const updateSort = (sort: SortType) => this.setState({ sort });
    const recruitsToShow = this.recruitsToShow();
    const startOver = () =>
      this.setState({ recruits: makeRecruits(staffingNeeds), done: false });
    return (
      <div className={styles["StaffingSample"]}>
        {condContent(explainState, <ExplainOverlay></ExplainOverlay>)}
        {condContent(
          done,
          <div className={styles["ExplainOverlay"]}>
            <div className={styles["overlay-content"]}>
              {condContent(
                finished(
                  staffingNeeds,
                  recruits.filter((r) => r.status === "Scheduled")
                ),
                <Fragment>
                  <h2>Congratulations</h2>
                  <p>You successfully met all the staffing needs!</p>
                </Fragment>,
                <Fragment>
                  <h2>Thanks!</h2>
                </Fragment>
              )}
              <p>
                Thanks for checking out my react sample. Hopefully this gave you
                a good idea of what I can do when building a functional
                front-end application.
              </p>
              <button onClick={startOver}>Try Again</button>
            </div>
          </div>
        )}
        <h1>Staffing Sample</h1>
        <button
          className={styles["help-button"]}
          onClick={() => EXPLAIN_SERVICE.startOver()}
        >
          <HelpIcon />
        </button>
        <div className={styles["body"]}>
          <div
            className={styles["recruits"]}
            // I'm adding arrow key navigation, and I wanted to prevent the default action of
            // scrolling on arrow key
            onKeyDown={(e) => {
              if (e.key.includes("Arrow")) e.preventDefault();
            }}
          >
            <RecruitsHead
              sort={sort}
              group={group}
              updateGroup={updateGroup}
              updateSort={updateSort}
            ></RecruitsHead>
            {recruitsToShow.length ? (
              recruitsToShow.map((r, i) => (
                <RecruitShower
                  moveRecruit={moveRecruit}
                  key={i}
                  r={r}
                  listIndex={i}
                ></RecruitShower>
              ))
            ) : group === "Not Interested" ? (
              <div className={styles["empty-group"]}>
                You can sort bad recruits to this section with the{" "}
                <ThumbIcon className={styles["down"]} /> button
              </div>
            ) : (
              // group is "Scheduled at this point"
              <div className={styles["empty-group"]}>
                This is where recruits will be sorted when you click the{" "}
                <ThumbIcon /> button
              </div>
            )}
          </div>
          <StaffingChart
            recruited={recruits.filter((r) => r.status === "Scheduled")}
            needs={staffingNeeds}
          ></StaffingChart>
        </div>
      </div>
    );
  }
}
