import { flatten, sum } from 'lodash';
import { onlyUnique } from '../utils';
import { RECIPES } from './Recipes';

// An enum type for all the components that can be made or used in Satisfactory
export type FactoryProduct =
  | 'computer'
  | 'heavy modular frame'
  | 'modular frame'
  | 'screw'
  | 'iron plate'
  | 'iron rod'
  | 'steel beam'
  | 'iron ingot'
  | 'reinforced iron plate'
  | 'steel pipe'
  | 'encased industrial beam'
  | 'crystal oscillator'
  | 'concrete'
  | 'limestone'
  | 'water'
  | 'iron ore'
  | 'copper ore'
  | 'wire'
  | 'cable'
  | 'circuit board'
  | 'quartz crystal'
  | 'raw quartz'
  | 'silica'
  | 'a.i. limiter'
  | 'high-speed connector'
  | 'coal'
  | 'steel ingot'
  | 'copper ingot'
  | 'copper sheet'
  | 'quickwire'
  | 'caterium ore'
  | 'caterium ingot';

export type ProductQuant = [FactoryProduct, number];
// Using per minute numbers everywhere because including time and then dividing is one extra step I don't want
export interface Recipe {
  inputs: [ProductQuant, ProductQuant?, ProductQuant?, ProductQuant?];
  // I'll include the possibility for byproducts... because refactoring later would be annoying
  outputs: [ProductQuant, ProductQuant?];
  name?: string;
}

export const prodQuantTimes = (p: ProductQuant, x: number): ProductQuant => {
  return [p[0], p[1] * x];
};

export const mainOutput = (r: Recipe): FactoryProduct => {
  return r.outputs[0][0];
};

export const getRecipe = (prod: FactoryProduct): Recipe | undefined =>
  RECIPES.find((r) => mainOutput(r) === prod);

// the type system gets mad that the list could include undefined, but it actually doesnt...
export const getInputs = (r: Recipe) => r.inputs as ProductQuant[];

export function primeFactors(product: ProductQuant): ProductQuant[] {
  const myRecipe = getRecipe(product[0]);
  // if you can't find a recipe for this product (i.e. it's an ore)
  if (!myRecipe) return [product];

  const myQuant = product[1];
  // I need to divide the ammount being produce (the input to this function) by the speed
  // that it gets produced in the recipe
  const myRecipeSpeed = myRecipe?.outputs[0][1] as number;

  const inputFactors = (myRecipe.inputs as ProductQuant[]).map((i) =>
    prodQuantTimes(i, myQuant / myRecipeSpeed)
  );
  return foldProdQuants([product, ...primeFactorMany(inputFactors)]);
}

export function primeFactorMany(prods: ProductQuant[]): ProductQuant[] {
  return foldProdQuants(flatten(prods.map((p) => primeFactors(p))));
}

function foldProdQuants(toFold: ProductQuant[]): ProductQuant[] {
  const uniqueProds = toFold.map((p) => p[0]).filter(onlyUnique);
  return uniqueProds.map((unique) => [
    unique,
    toFold
      .filter((p) => p[0] === unique)
      .map((p) => p[1])
      .reduce((a, b) => a + b)
  ]);
}
