import React, { CSSProperties } from "react";
import styles from "./BorderVine.module.css";
interface Props {
  style?: CSSProperties;
}
export default function BorderVine({ style }: Props) {
  return (
    // Wrapping this in a block element seems to help it display better
    <div className={styles["BorderVine"]} style={style}>
      <svg
        width="188"
        height="271"
        viewBox="0 0 188 271"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Border Vine">
          <path
            id="swish"
            d="M48.1883 43.894C51.1767 13.3937 21.4999 8.5 12.6888 32.894C9.6889 -3.60594 61.8405 -0.380338 58.6888 43.8941C46.3378 217.394 19.6887 257.894 186.188 257.894C5.18871 289.394 31.1887 217.394 48.1883 43.894Z"
            fill="#3C4329"
          />
          <path
            id="cover"
            d="M10 33C17.5 -1.5 57.8812 11.5 53.5 41.5C23.9999 243.5 39.5 270 187 257.5"
            stroke="black"
            strokeWidth="19"
          />
          <circle
            id="dot"
            r="11"
            transform="matrix(0.999936 0.011322 -0.0117841 -0.999931 31.6474 33.9078)"
            fill="#90A064"
          />
        </g>
      </svg>
    </div>
  );
}
