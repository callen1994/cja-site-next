import React, { Fragment, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { condContent } from "../../../Utilities/utils";
import { DanceEvent } from "../../data-types";
import { getStyles } from "../../../Utilities/utils";
import styles from "./DanceEventComp.module.css";
import CloseIcon from "../../../Utilities/Icons/CloseIcon";

interface Props {
  event: DanceEvent;
  index: number;
}

export default function DanceEventComp({ event, index }: Props) {
  const [open, setOpen] = useState(false);
  // I can some lines by using the && here
  const unfocusMe = useCallback(
    () => document.getElementById("noFocus" + index)?.focus() && setOpen(false),
    [index]
  );

  useEffect(() => {
    window.addEventListener("focus", unfocusMe);
    return () => window.removeEventListener("focus", unfocusMe);
  }, [unfocusMe]);

  let linkFocus = false;

  function getLinks() {
    const links = event.links.split(",");
    return links.map((l, i) => {
      const segs =
        l
          // Everything after :// and before any other /'s
          .split("/")[2]
          ?.split(".")
          // all the segments that aren't the 'www' part
          .filter((seg) => seg.toLowerCase() !== "www") || [];

      return (
        <a
          key={i}
          className={styles[`${links.length > 1 ? "links" : "link"}`]}
          href={l}
          target="_blank"
          rel="noreferrer"
          onFocus={(e) => {
            if (!open) {
              e.stopPropagation();
              // For whatever reason this is needed to make it work
              linkFocus = true;
            }
          }}
        >{`${segs[0]}.${segs[1]}`}</a>
      );
    });
  }

  // Take a lit of details (that may or may not be defined) and show them in a span
  // with the correct styling (better than repeating myself down below)
  const showDetails = (deets: (string | undefined)[]) => (
    <>
      {deets.map((d, i) =>
        condContent(
          d,
          // Putting the whitespace outside the nowrap is needed to get the wrapping to work right
          <Fragment key={i}>
            {" "}
            <span className={styles["noWrap"]}>{`- ${d}`}</span>
          </Fragment>
        )
      )}
    </>
  );

  return (
    <div className={getStyles(styles, `space-saver ${open ? "open" : ""}`)}>
      <div
        className={getStyles(styles, `DanceEventBG ${open ? "open" : ""}`)}
        id={`DanceEventComp${index}`}
      >
        <button className={styles["hidden"]} id={"noFocus" + index}></button>
        <button
          className={styles["body"]}
          onKeyUp={(e) => (e.key === "Escape" ? unfocusMe() : setOpen(true))}
          onFocus={() => setOpen(true)}
          // If i'm clicking the link inside the overlay view, that normally triggers this thing's
          // blur function, but if it is the link that's being focused, that will be identified here
          // and I won't trigger the next blur execution.
          // I can't just use onFocusCapture for opening, because if I do then the user can't click the link
          // on the un-focused view
          onFocusCapture={() => (linkFocus = true)}
          onBlurCapture={() =>
            // I'm setting this as a timeout to ensure that it executes after the onFocusCapture
            // this might not be necessary, but I don't feel like double checking the specs for every browser...
            setTimeout(() => {
              setOpen(false || linkFocus);
              linkFocus = false;
            }, 0)
          }
        >
          <h2>{event.title}</h2>
          <div
            className={styles["close"]}
            onClick={unfocusMe}
            id={"DanceEventCompButton" + index}
          >
            <CloseIcon></CloseIcon>
          </div>
          <div className={styles["event-body"]}>
            <div className={styles["info-col"]}>
              <div className={styles["info-row"]}>
                <label>Style:</label>{" "}
                <span className={styles["info-text"]}>{event.style}</span>
              </div>
              <div className={styles["info-row"]}>
                <label>When:</label>{" "}
                <span className={styles["info-text"]}>
                  {event.dayOfWeek || "N/A"}
                  <span className={styles["details"]}>
                    {showDetails([event.repetition, event.time])}
                  </span>
                </span>
              </div>
              <div className={styles["info-row"]}>
                <label>Where:</label> {event.city || "N/A"}
                <span className={styles["info-text"]}>
                  <span className={styles["details"]}>
                    {showDetails([event.address])}
                  </span>
                </span>
              </div>
              <div className={styles["info-row"]}>
                <label>Info:</label> {getLinks()}
              </div>
            </div>
            {condContent(
              event.img,
              <div className={styles["image"]}>
                <Image
                  src={event.img}
                  alt={event.title}
                  height="150"
                  width="200"
                  objectFit="cover"
                  layout="responsive"
                />
              </div>
            )}
          </div>
          <div className={getStyles(styles, "blurb details")}>
            {event.blurb.split("<br />").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </button>
      </div>
    </div>
  );
}
