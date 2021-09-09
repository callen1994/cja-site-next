export function onlyUnique<T>(v: T, i: number, arr: T[]): boolean {
  return arr.indexOf(v) === i;
}

export function logError(err: any) {
  console.log("");
  console.log("");
  console.log("********************** MONGO ERROR **********************");
  console.log("");
  console.log("");
  console.log(err.message || err);
  console.log("");
  console.log("");
}
