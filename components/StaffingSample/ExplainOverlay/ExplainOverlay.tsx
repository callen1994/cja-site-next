import React, { useEffect, useState } from "react";
import {
  EXPLAIN_SERVICE,
  ExplainState,
  RealExplainState,
} from "./ExplainOverlay.service";
import { condContent, getStyles } from "../../utils";
import { EXPLAIN_CONTENT } from "./ExplainContent";
import styles from "./ExplainOverlay.module.css";

export default function ExplainOverlay() {
  const [explainState, setExplainState] = useState<ExplainState>(
    EXPLAIN_SERVICE.explainState
  );

  // Use Effect with an empty dependencies array is only called when the component mounts
  useEffect(() => {
    // When nextState is called EXPLAIN_SERVICE will notify all it's toNotify members
    EXPLAIN_SERVICE.toNotify.push(setExplainState);
  }, []);
  const content = EXPLAIN_CONTENT[explainState as RealExplainState];
  return (
    // I want to be able to style each explain state (mostly just changing the position so the overlay text doesn't cover the thing I'm trying to explain)
    <div className={`${styles.ExplainOverlay} ${explainState}`}>
      <div className={getStyles(styles, `main spacer`)}>
        <div className={styles["overlay-content"]}>
          {/* I can cast it as such as long as I don't render the explain overlay when notify state is undefined */}
          {content}
          <button onClick={() => EXPLAIN_SERVICE.nextState()}>Got it</button>
        </div>
      </div>
      {condContent(
        EXPLAIN_SERVICE.explainState !== "start",
        <div className={styles["spacer"]}></div>
      )}
    </div>
  );
}
