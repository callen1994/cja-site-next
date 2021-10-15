import type { NextApiResponse } from "next";
import { BIG_Log } from "../socket-server/src/utils";

export const PORT = process.env.PORT || 5000;

export function timeStamp() {
  const now = new Date();
  return now.toLocaleString("en-us", { timeZone: "" });
}

// If I have an async call that might fail, this switches it from failing with an error to failing by returning null
// for the main value and an error value as a second value
export async function promErrWrapper<T>(
  toWrap: () => Promise<T>
): Promise<[T | null, any]> {
  try {
    const ret = await toWrap();
    return [ret, null];
  } catch (err) {
    return [null, err];
  }
}

// Service should explain what service is being called here
export function thenArgs(res: NextApiResponse, service: string) {
  return [
    (suc: any) => {
      const ret = { service, message: `Successfully reached ${service}`, suc };
      console.log(ret);
      res.status(200).send(ret);
    },
    makeErrHandler(res, service),
  ];
}

export function makeErrHandler(
  res: NextApiResponse,
  service?: string
): (err: any) => void {
  return (err: any) => {
    const ret = { service, message: `Error with ${service}`, err };
    console.error(ret);
    res.status(500).send(err);
  };
}

// Service should explain what service is being called here
export function testThenArgs(res: NextApiResponse, service: string) {
  return [
    (API_RESPONSE: any) => {
      console.log(API_RESPONSE);
      const ret = {
        service,
        message: `Successfully reached ${service}`,
        API_RESPONSE,
      };
      // console.log(ret);
      res.status(200).send(ret);
    },
    makeErrHandler(res, service),
  ];
}

// When writing test stuff I can sometimes break working code with a bad test (like trying to log)
// a non-existing property. So wrapping any test stuff I write like this should help
export function testWrapper(fun: any) {
  try {
    fun();
  } catch (e) {
    BIG_Log(`Your test code is stupid`);
    console.error(e);
  }
}
