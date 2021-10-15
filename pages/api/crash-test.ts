// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createReadStream } from "fs";

export default function WiggleTime(req: NextApiRequest, res: NextApiResponse) {
  // This should crash the node app
  createReadStream("crash test dummy");
  res.status(503).json({ message: "You crashed me!" });
}
