import type { NextApiResponse } from "next";

export const PORT = process.env.PORT || 5000;

export function makeErrHandler(
  res: NextApiResponse,
  message?: string
): (err: any) => void {
  return (err: any) => {
    if (message) console.log(message);
    console.error(err);
    res.send({ message, err: (err || "").toString() });
  };
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

export function testThenArgs(res: NextApiResponse, message: string) {
  return [
    (suc: any) => {
      console.log("Success! ");
      if (message) console.log(message);
      console.log(suc);
      res.status(200).send(suc);
    },
    makeErrHandler(res, message),
  ];
}
