import PaisleySwirl from "../FancyAssets/PaisleySwirl/PaisleySwirl";
import styles from "./HomeSplash.module.css";

export default function HomeSplash() {
  return (
    <section className={styles["HomeSplash"]}>
      <div className={styles["left-paisley"]}>
        <PaisleySwirl speedIndex={0.4}></PaisleySwirl>
      </div>
      <div className={styles["right-paisley"]}>
        <PaisleySwirl speedIndex={0.4} globalDelay={1}></PaisleySwirl>
      </div>
      {/* Making these spans helps with my css selectors, don't change it */}
      <span className={`${styles.name} ${styles.connor}`}>Connor</span>
      <span className={`${styles.name} ${styles.james}`}>James</span>
      <span className={`${styles.name} ${styles.allen}`}>Allen</span>
      <span className={styles["welcome"]}>Welcome to my site!</span>
    </section>
  );
}
