// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { thenArgs } from "../../private/server-utils";
import { testText } from "../../private/twilio";

export default function TextWBInvite(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user, room, to } = JSON.parse(req.body);
  const body = `${user} has invited you to collaborate on their whiteboard, join at https://connorjamesallen.com/virtual-whiteboard?room=${room}`;
  const [suc, err] = thenArgs(res, "Twilio Messaging");
  testText({ to, body }).then(suc, err);
}
