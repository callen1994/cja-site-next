import React from "react";
import PaisleySwish from "../PaisleySwish/PaisleySwish";
import styles from "./CjaLogo.module.css";

export default function CjaLogo() {
  return (
    <div className={styles.CjaLogo}>
      <div className={`${styles.letter} ${styles.c}`}>C</div>
      <div className={`${styles.letter} ${styles.j}`}>J</div>
      <div className={`${styles.letter} ${styles.a}`}>A</div>
      <PaisleySwish></PaisleySwish>
    </div>
  );
}
