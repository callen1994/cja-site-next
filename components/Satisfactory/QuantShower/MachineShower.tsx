import { useState } from "react";
import { getStyles } from "../../Utilities/utils";
import styles from "./QuantShower.module.css";

interface Props {
  totalMachs: number;
}
export default function MachineShower({ totalMachs }: Props) {
  const [arbMachs, setArbMachs] = useState(Math.ceil(totalMachs));

  const percentRound = (x: number) => Math.ceil(x * 10000) / 100;

  return (
    //I want it to inherit the row styles
    <div className={getStyles(styles, "row MachineShower")}>
      Machines:{" "}
      <input
        type="number"
        value={arbMachs}
        onChange={(e) => setArbMachs(parseInt(e.target.value))}
      />{" "}
      at {percentRound(totalMachs / arbMachs)}%
    </div>
  );
}
