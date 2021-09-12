import Link from "next/link";
import styles from "./WorkSamples.module.css";

export default function WorkSamples() {
  return (
    <section className={styles.WorkSamples}>
      <h1>Work Samples</h1>
      <p>
        Here are a couple of projects built with React to show off what I can
        do. You can see the code for everything on this site at{" "}
        <a href="https://github.com/callen1994/cja-site">
          github.com/callen1994/cja-site
        </a>
      </p>

      <div className={styles["sample-links"]}>
        <Link href="dance">
          <a>
            <h2>Dance</h2>
            <p className={styles["link-content"]}>
              Info about dance events in the bay area. I created this so I can
              easily track and share that info. The front end is React with a
              server fetching data from a google sheets which is my super simple
              CMS
            </p>
          </a>
        </Link>
        <Link href="staffing-sample">
          <a href="">
            <h2>Staffing</h2>
            <p className={styles["link-content"]}>
              To show off what I can do building beautiful and functional
              web-tools, I{"'"}ve created a staffing tool for an imaginary
              summer camp.
            </p>
          </a>
        </Link>
        <Link href="virtual-whiteboard">
          <a>
            <h2>Virtual Whiteboard</h2>
            <p className={styles["link-content"]}>To show off capabilities</p>
          </a>
        </Link>
      </div>
    </section>
  );
}
