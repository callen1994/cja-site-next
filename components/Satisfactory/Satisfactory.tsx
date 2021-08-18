import React from "react";
import { getRecipe, primeFactorMany, ProductQuant } from "./Satisfactory.types";
import QuantShower from "./QuantShower/QuantShower";
import styles from "./Satisfactory.module.css";

interface Props {}
interface State {}

export default class Satisfactory extends React.Component<Props, State> {
  // constructor(props: Props) {
  //   super(props);
  // }

  render() {
    // const outputs: ProductQuant[] = [
    //   ['steel beam', 26.29],
    //   ['encased industrial beam', 25],
    //   ['steel pipe', 75]
    // ];
    // const outputs: ProductQuant[] = [['steel beam', 39.11 - 26.29]];
    const outputs: ProductQuant[] = [
      ["computer", 5],
      // ['heavy modular frame', 5],
      // ['high-speed connector', 5],
      // ['quickwire', 20],
      // ['a.i. limiter', 5]
    ];
    const fullProdLine = primeFactorMany(outputs);

    // Since an output might also be an intermediary I want to get the count that is calculated in the full Prod line for these products
    // I know that the output will always be in the output list so find won't be false
    const foundOutput = outputs.map(
      (outpq) => fullProdLine.find((pq) => pq[0] === outpq[0]) as ProductQuant
    );

    // all the products that aren't the output but do have a recipe
    const intermediaries = fullProdLine.filter(
      (pq) => !outputs.map((out) => out[0]).includes(pq[0]) && getRecipe(pq[0])
    );

    const raw = fullProdLine.filter((pq) => !getRecipe(pq[0]));

    const showQuant = (toShow: ProductQuant) => (
      <QuantShower toShow={toShow} fullProdLine={fullProdLine}></QuantShower>
    );
    return (
      <section className={styles.Satisfactory}>
        <div>
          <h2>Outputs</h2>
          {foundOutput.map(showQuant)}
        </div>
        <div>
          <h2>Intermediaries</h2>
          {intermediaries.map(showQuant)}
        </div>
        <div>
          <h2>Raw</h2>
          {raw.map(showQuant)}
        </div>
      </section>
    );
  }
}
