import React, { Fragment } from "react";
import { max, range } from "lodash";
import {
  DAY_LU,
  MAX_CREW,
  Recruit,
  StaffingNeeds,
} from "../staffing-data/staffing.data-types";
import CarIcon from "../Icons/CarIcon";
import StarIcon from "../Icons/StarIcon";
import CrewIcon from "../Icons/CrewIcon";
import ChevronIcon from "../Icons/ChevronIcon";
import {
  ExplainState,
  EXPLAIN_SERVICE,
} from "../ExplainOverlay/ExplainOverlay.service";
import { condContent, getStyles } from "../../utils";
import styles from "./StaffingChart.module.css";

interface Props {
  recruited: Recruit[];
  needs: StaffingNeeds;
}

interface State {
  explainState: ExplainState;
  highlighted: Recruit | null;
  expanded: boolean;
}

// Global *endpoint* that other elements can use to modify the state of the chart without
// passing a state change through the common ancestor (StaffingSample.tsx) thus avoiding unnecessary re-renders
// starts as a null function and gets assigned when the staffing chart is mounted.
export let SET_HIGHLIGHT: (r: Recruit | null) => void = () => null;

export default class StaffingChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      highlighted: null,
      expanded: true,
      explainState: EXPLAIN_SERVICE.explainState,
    };
  }

  componentDidMount() {
    console.log("Mountinng Staffing chart");
    // Expose this set state function to the world by assigning it to this global variable
    // this only works because I only have one instance of the chart. If there were multiple components doing this it would be an issue...
    SET_HIGHLIGHT = (highlighted) => this.setState({ highlighted });
    // Create the subscription
    EXPLAIN_SERVICE.toNotify.push((explainState: ExplainState) => {
      console.log("Notifying Chart of changes");
      this.setState({ explainState });
    });
  }
  // Clean it up when it's done like a good boy
  componentWillUnmount = () => (SET_HIGHLIGHT = () => null);

  render() {
    const { recruited, needs } = this.props;
    const { highlighted: hl, explainState: explain, expanded: ex } = this.state;
    const biggest = max(needs) || 1;
    // const crewCount = recruited.length;

    const getDayInfo = (day: number, i: number) => {
      const avail = recruited.filter((r) => r.availability[i]);
      // Test whether the highlighted crew is available this day
      const hlAvail = (hl?.availability || [])[i];
      // I don't want the number of crew on a day to go past the total needed
      const crewCount = Math.min(avail.length, day);
      return { avail, hlAvail, crewCount };
    };

    const makeLabel = (day: number, i: number) => {
      const { hlAvail, crewCount } = getDayInfo(day, i);
      return (
        <label key={i}>
          {DAY_LU[i]}
          {condContent(
            !ex,
            <div className={styles["alt-count"]}>
              <span
                className={getStyles(styles, "count " + (hlAvail ? "hl" : ""))}
              >
                {crewCount + (hlAvail ? 1 : 0)}
              </span>
              /{day}
            </div>
          )}
        </label>
      );
    };

    const makeIcon = (
      day: number,
      i: number,
      field: "canCarPool" | "specialSkill",
      Icon: (args: any) => JSX.Element
    ) => {
      const { hlAvail, avail } = getDayInfo(day, i);
      const schedTest = avail.some((r) => r[field]);
      const hlTest =
        (hl && hlAvail && hl[field] && !schedTest) ||
        // If I'm explaining the day display, I want to show the icons as if they're highlighted
        (explain === "explain-chart-day" && i === 0);
      return (
        <div
          key={i}
          className={getStyles(styles, "icon " + (hlTest ? "hl" : ""))}
        >
          {schedTest || hlTest ? <Icon></Icon> : "-"}
        </div>
      );
    };

    const makeBar = (day: number, i: number) => {
      const { hlAvail, crewCount } = getDayInfo(day, i);

      const getBarWidth = (barVal: number, outOf = biggest) => ({
        width: Math.ceil((barVal / outOf) * 100) + "%",
      });

      const getFocusBar = (alreadyScheduled: number, outOf = biggest) => ({
        // It's left value should be the same as the width of the sched-bar
        left: getBarWidth(alreadyScheduled, outOf).width,
        // It's width should be the width of having one person on this day
        width: !hlAvail ? "0" : Math.ceil((1 / outOf) * 100) + "%",
      });
      return (
        <div key={i} className={styles["bar-holder"]}>
          <div className={styles["need-bar"]} style={getBarWidth(day)}>
            <div
              className={styles["sched-bar"]}
              style={getBarWidth(crewCount, day)}
            ></div>
            <div
              className={styles["focus-bar"]}
              style={getFocusBar(crewCount, day)}
            ></div>
          </div>
        </div>
      );
    };

    ///////////////////////////////////////////////////////////////////////////////////
    // For the purpose of CSS animations I'm displaying the Staff Chart by column
    // rather than by row. So I have functions for each cell that I make

    return (
      <div className={getStyles(styles, "StaffingChart " + explain)}>
        <div className={styles["header"]}>
          <h2>Scheduled Staff</h2>
        </div>
        <div className={styles["slots-indicator"]}>
          <label>
            Crew Slots: {recruited.length} / {MAX_CREW}
          </label>
          {range(1, MAX_CREW + 1).map((i) => (
            <CrewIcon
              key={i}
              className={i <= recruited.length ? "filled" : ""}
            ></CrewIcon>
          ))}
        </div>
        {/* I refactored this to be in columns because I want to do some nifty stuff
            with animations to rotate things on the mobile view */}
        <div
          className={getStyles(
            styles,
            "chart-body " + (!ex ? "collapsed" : "")
          )}
        >
          <div className={styles["labels"]}>
            <div className={styles["toggleButton"]}>
              <button onClick={() => this.setState({ expanded: !ex })}>
                <ChevronIcon></ChevronIcon>
              </button>
            </div>
            {needs.map(makeLabel)}
          </div>
          <div className={getStyles(styles, "icons car")}>
            <label>Car</label>
            {needs.map((day, i) => makeIcon(day, i, "canCarPool", CarIcon))}
          </div>
          <div className={getStyles(styles, "icons star")}>
            <label>Lead</label>
            {needs.map((day, i) => makeIcon(day, i, "specialSkill", StarIcon))}
          </div>
          <div className={styles["bar-column"]}>
            <div className={styles["bar-holder"]}>
              {range(1, biggest + 1).map((i) => (
                <div className={styles["tick"]} key={i}>
                  {i}
                </div>
              ))}
            </div>
            {needs.map(makeBar)}
          </div>
          {/* {needs.map((day, i) => this.renderDay(day, i))} */}
        </div>
      </div>
    );
  }
}

// * Notes on global endpoint / service
// - Writing this to think through my own experience here
// I've gone back and forth on whether to format this as a service or as a gloal let variable or as a service
// I arrived at the global variable solution by thinking about this as a service. But then I realized the service
// doesn't even need to manage the state of who's focused, it's just an endpoint that exposes the setState of the chart
// out to other components. So in it's most terse form it should just be a let function variable
//
// The case where this would stop working (or stop behaving as expected) is when the staffing chart component is
// getting mounted in multiple instances In that case the update function would only refer to setSate of the
// component that was mounted last.
//
// If there were multiple instaces of char that care about the highlighted recruit, I would probably just manage the state
// globally as an rxjs subject and have every instance subscribe to it. If I don't want that I could have the service keep a list of
// setState functions that it calls whenever the gloal state is changed. At that point it has to be a real class.
