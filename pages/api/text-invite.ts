// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { testThenArgs } from "../../private/server-utils";
import { testText } from "../../private/twilio";

export default function WiggleTime(req: NextApiRequest, res: NextApiResponse) {
  const { user, room, to } = JSON.parse(req.body);
  const body = `${user} has invited you to collaborate on their whiteboard, join at https://connorjamesallen.com/whiteboards?room=${room}`;
  testText({ to, body }).then(...testThenArgs(res, "testing twilio"));
}
