import Link from "next/link";
import React from "react";
import PaisleySwirl from "../Utilities/FancyAssets/PaisleySwirl/PaisleySwirl";
import { getStyles } from "../Utilities/utils";
import nameStyles from "./Name.module.css";
import paisleyStyles from "./Paisleys.module.css";
import mainStyles from "./HomeSplash.module.css";

const styles = {...nameStyles, ...paisleyStyles, ...mainStyles}

export default function HomeSplash() {
  return (
    <section className={styles["HomeSplash"] +' '+ styles['PaisleyContainer']}>
      <div className={styles["left-paisley"]}>
        <PaisleySwirl speedIndex={0.4}></PaisleySwirl>
      </div>
      <div className={styles["right-paisley"]}>
        <PaisleySwirl speedIndex={0.4} globalDelay={1}></PaisleySwirl>
      </div>
      <div className={`${styles["center-box"]}`}>
        <div className={styles["contrast-cover-bar"]}></div>
      </div>
      <div className={styles["center-box"]}>
        <span className={getStyles(styles, "name connor")}>Connor</span>
        <span className={getStyles(styles, "name james")}>James</span>
        <span className={getStyles(styles, "name allen")}>Allen</span>
        <span className={styles["welcome"]}>
          For Dance Info, <Link href="/dance">go here</Link>
        </span>
      </div>
    </section>
  );
}
