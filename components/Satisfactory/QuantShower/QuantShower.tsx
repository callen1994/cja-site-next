import { startCase } from "lodash";
import { Fragment } from "react";
import { condContent, getStyles } from "../../Utilities/utils";
import {
  FactoryProduct,
  getInputs,
  getRecipe,
  ProductQuant,
} from "../Satisfactory.types";
import MachineShower from "./MachineShower";
import styles from "./QuantShower.module.css";

interface Props {
  toShow: ProductQuant;
  // I want to show where this product is getting used, which I can determine by looking at the rest of the production line
  fullProdLine: ProductQuant[];
}

interface Use {
  used: number;
  making: FactoryProduct;
  machines: number;
}

interface ProductionDetails {
  // All the inputs, plus the number of machines
  from: { inputs: ProductQuant[]; machines: number };
  // 300 screws for reinforced plates, 250 for modular frames, 150 for rotors, etc.
  to: Use[];
}

export default function QuantShower({ toShow, fullProdLine }: Props) {
  const details: ProductionDetails = {
    from: { inputs: [], machines: 0 },
    to: [],
  };

  details.to = fullProdLine
    .map((outQuant) => {
      const recipe = getRecipe(outQuant[0]);
      // If there isn't a recipe or the recipe is irrelevant, return null
      if (!recipe) return null;
      const relevantInput = getInputs(recipe).find((i) => i[0] === toShow[0]);
      if (!relevantInput) return null;

      const toShowInRecipe = relevantInput[1];
      const outFromRecipe = recipe.outputs[0][1];

      // Return a ProductQuant that has the name of the output being produced (e.g. plates)
      // with the quantity of toshow input being used for that (e.g. screws)
      return {
        used: (outQuant[1] / outFromRecipe) * toShowInRecipe,
        making: outQuant[0],
        machines: outQuant[1] / outFromRecipe,
      } as Use;
    })
    // Filter out all the list elements that were nothing
    .filter((x) => x) as Use[];

  const myRecipe = getRecipe(toShow[0]);
  if (myRecipe) {
    // The machine count is essentially how many times I need to run the recipe
    const machCount = toShow[1] / myRecipe.outputs[0][1];
    details.from.inputs = (myRecipe.inputs as ProductQuant[]).map((i) => [
      i[0],
      i[1] * machCount,
    ]);
    details.from.machines = machCount;
  }

  const round = (x: number) => Math.ceil(x * 100) / 100;

  return (
    <div className={styles["QuantShower"]} tabIndex={0}>
      <div className={getStyles(styles, "row main")}>
        <label>{startCase(toShow[0])}</label>
        <div className={styles["quant"]}>{round(toShow[1])}</div>
      </div>
      <div className={styles["details"]}>
        {condContent(
          details.from.inputs.length,
          <>
            <label>Made By:</label>
            {details.from.inputs.map((input, i) => (
              <div className={styles["row"]} key={i}>
                {round(input[1])} {input[0]}
              </div>
            ))}
            {/* <div className="row">Machines {round(details.from.machines)}</div> */}
            <MachineShower totalMachs={details.from.machines} />
          </>
        )}
        {condContent(
          details.to.length,
          <>
            <label>Uses:</label>
            {details.to.map((use, i) => (
              <Fragment key={i}>
                <div className={styles["row"]}>
                  {round(use.used)} {"=>"} {use.making}
                </div>
                {/* <div className="row">Machines: {use.machines}</div> */}
                <MachineShower totalMachs={use.machines} />
              </Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
