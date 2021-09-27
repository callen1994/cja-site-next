import type { NextApiResponse } from "next";

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
