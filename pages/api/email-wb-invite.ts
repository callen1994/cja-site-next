import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "../../private/email-transporter";
import { thenArgs } from "../../private/server-utils";

export default async function WiggleTime(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  console.log("Doing Email Invite");
  const { to, room, user } = JSON.parse(req.body);
  if (!to || !room || !user)
    return res
      .status(500)
      .send({ message: `some data was missing`, to, room, user });

  const url = `https://connorjamesallen.com/virtual-whiteboard?room=${room}`;
  const [suc, err] = thenArgs(res, "Mailgun Messaging");

  await sendEmail(
    to,
    "Whiteboard Invite",
    `<p>Hi There,</p>
     <p>You have been invited by ${user} to join their virtual whiteboard. Just follow this link:</p>
     <p><a href="${url}">Invite Link</a></p>
     <p style="color: #555; font-size: 0.8em">If the link doesn't work, copy and past this into your browser: (${url})</p>`
  ).then(suc, err);
}
