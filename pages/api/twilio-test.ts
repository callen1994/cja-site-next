// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { testThenArgs } from "../../private/server-utils";
import { testText } from "../../private/twilio";

export default function WiggleTime(req: NextApiRequest, res: NextApiResponse) {
  const body = "Testing this text setup";
  const to = "+18315669108";
  testText({ body, to }).then(...testThenArgs(res, "testing twilio"));
}
