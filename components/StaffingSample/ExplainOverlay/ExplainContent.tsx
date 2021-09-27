import React, { Fragment } from "react";
import CarIcon from "../../Utilities/Icons/CarIcon";
import ChevronIcon from "../../Utilities/Icons/ChevronIcon";
import CrewIcon from "../../Utilities/Icons/CrewIcon";
import StarIcon from "../../Utilities/Icons/StarIcon";
import ThumbIcon from "../../Utilities/Icons/ThumbIcon";
import { RealExplainState } from "./ExplainOverlay.service";
import styles from "./ExplainOverlay.module.css";

export const EXPLAIN_CONTENT: {
  [key in RealExplainState]: JSX.Element;
} = {
  start: (
    <Fragment>
      <h2>Welcome to my Staffing Tool</h2>
      <p>
        To show off what I can do building beautiful and functional web-tools,
        {"I've"} created a staffing tool for an imaginary summer camp.
      </p>
      <p>{"Here's"} the use case:</p>
      <ul>
        <li>You are a running a summer camp and you need camp counselors.</li>
        <li>You need more staff on certain days and less on others.</li>
        <li>
          On every day you need at least one staff member available who is a
          team lead, and one who can carpool
        </li>
        <li>
          You only have capacity to schedule 10 different staff members for the
          week.
        </li>
      </ul>
    </Fragment>
  ),
  "explain-recruits-groups": (
    <p>
      New applicants are listed in the {`"Applicants"`} group. You can use the{" "}
      <span className={styles["noWrap"]}>
        <ChevronIcon className="rotate" /> and <ChevronIcon />
      </span>{" "}
      buttons to view scheduled recruits or recruits you marked as
      {` "Not interested"`}
    </p>
  ),
  "explain-crew-display": (
    <Fragment>
      <p>
        This is someone {"who's"} applied to be a camp counselor. You can see
        info about them here, such as their name, whether they can carpool{" "}
        <CarIcon /> and whther they can be a team lead <StarIcon />{" "}
      </p>
      <p>
        When an applicant is selected {"you'll"} see their availability listed
        below. This recruit is available Every day except Tuesday and Wednesday
      </p>
    </Fragment>
  ),
  "explain-crew-buttons": (
    <Fragment>
      <p>
        Use the <ThumbIcon /> button if you want to schedule the applicant and
        the <ThumbIcon className="rotate" /> if they are a bad candidate.
      </p>
      <p>
        To help with your organizing, this tool has calculated a fitness score
        for each applicant based on how well they meet the remaining needs for
        the season. This recruits score is <strong>76</strong>.
      </p>
      <p>
        Being available on more days, ability to drive, and ability to lead a
        team increase score to a maximum of 100.
      </p>
    </Fragment>
  ),
  "explain-chart-slots": (
    <Fragment>
      <p>
        The Staffing chart will show how close you are to meeting your needs for
        the season.
      </p>
      <p>
        At the top, the <CrewIcon /> icons show how many people have been
        recruited out of the 10 total. As more people are recruited these will
        be filled in
      </p>
    </Fragment>
  ),

  "explain-recruits-sort": (
    <p>You can sort crew members by their ID, Name, or their Fitness score</p>
  ),
  "explain-chart-day": (
    <Fragment>
      <p>
        Each day of the week needs at least one recruit who can carpool and
        someone who is a team lead. These are identified in the{" "}
        <strong>{`"Car"`}</strong> and <strong>{`"Lead"`}</strong>
        columns.
      </p>
      <p>
        There is a progress bar showing how many available recruits have been
        scheduled for that day out of the total needed.
      </p>
    </Fragment>
  ),
};
