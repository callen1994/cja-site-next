import { Request, Response } from "express";

export function onlyUnique<T>(v: T, i: number, arr: T[]): boolean {
  return arr.indexOf(v) === i;
}

export function BIG_Log(msg: string) {
  console.log("");
  console.log("");
  console.log("");
  console.log(`********************** ${msg} **********************`);
  console.log("");
  console.log("");
  console.log("");
}

export function logError(err: any) {
  BIG_Log("MONGO ERROR");
  console.log(err.message || err);
  console.log("");
  console.log("");
}

export function nowString() {
  const date = new Date();
  return `Date: ${date.toLocaleDateString()} Time: ${date.toLocaleTimeString()}`;
}

export function apiTest(req: Request, res: Response) {
  console.log(`Is this some sort of test??`);
  // refactored to work on windows with backslash syntax on the path
  // also my windows setup uses "cja-site-next" (the github name) rather than "cja-site"
  // and configuring this regex was easier than messing with github stuff
  const desiredRoot = __dirname.match(
    /cja-site[^\\,\/]*[\/,\\]socket-server[\/,\\]/g
  );
  if (!desiredRoot || !desiredRoot[0]) {
    res.status(503).send({ message: "Root path not configured properly" });
    return console.log("Root Not Found");
  }
  const root =
    __dirname.slice(0, __dirname.indexOf(desiredRoot[0])) + desiredRoot[0];
  res.sendFile("./public/test.html", { root });
}
