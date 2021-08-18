import React, { useState } from "react";
import Image from "next/image";
import { condContent } from "../../../utils";
import { DanceEvent } from "../../data-types";
import { getStyles } from "../../../utils";
import styles from "./DanceEventComp.module.css";

interface Props {
  event: DanceEvent;
  index: number;
}

export default function DanceEventComp({ event, index }: Props) {
  const [open, setOpen] = useState(false);
  let linkFocus = false;
  const test = false && event.title === "Lindy in the Park";
  // const getStyles = (classes: string[]) =>
  //   classes.map((c) => styles[c] || "").join(" ");

  function getLinks() {
    const links = event.links.split(",");
    return links.map((l, i) => {
      const segs =
        l
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

  return (
    <div className={getStyles(styles, `space-saver ${open ? "open" : ""}`)}>
      <div
        className={getStyles(styles, `DanceEventBG ${open ? "open" : ""}`)}
        id={`DanceEventComp${index}`}
      >
        <button className={styles["hidden"]} id={"noFocus" + index}></button>
        <button
          className={styles["body"]}
          // If the event is open, I can cancel the propegation with the
          onKeyUp={(e) => {
            e.key === "Escape" ? setOpen(false) : setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          // If i'm clicking the link inside the overlay view, that normally triggers this thing's
          // blur function, but if it is the link that's being focused, that will be identified here
          // and I won't trigger the next blur execution.
          // I can't just use onFocusCaptur for opening , becuause if I do then the user can't
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
            onClick={() => document.getElementById("noFocus" + index)?.focus()}
            id={"DanceEventCompButton" + index}
          >
            X
          </div>
          <div className={styles["event-body"]}>
            <div className={styles["info-col"]}>
              <div>
                <label>Style:</label>{" "}
                <span className={styles["info-text"]}>{event.style}</span>
              </div>
              <div>
                <label>When:</label>{" "}
                <span className={styles["info-text"]}>
                  {event.dayOfWeek || "N/A"}
                  <span className={styles["details"]}>
                    {event.repetition ? ` - ${event.repetition}` : ""}{" "}
                    {event.time ? ` - ${event.time}` : ""}
                  </span>
                </span>
              </div>
              <div>
                <label>Where:</label> {event.city || "N/A"}
                <span className={styles["info-text"]}>
                  <span className={styles["details"]}>
                    {" "}
                    - {event.address || ""}
                  </span>
                </span>
              </div>
              <div>
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
                />
              </div>
            )}
          </div>
          {event.blurb.split("<br />").map((paragraph, i) => (
            <p key={i} className={getStyles(styles, "blurb details")}>
              {paragraph}
            </p>
          ))}
        </button>
      </div>
    </div>
  );
}
