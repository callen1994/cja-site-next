// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { emailTest } from "../../private/email-nonsense";

type Data = {
  name: string;
};

export default function WiggleTime(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  emailTest().then(
    (suc) => {
      console.log("Email sent with no error");
      console.log(suc);
      res.status(200).send({ message: "email sent with no error", suc });
    },
    (err) => {
      console.log("Email sending errored :/");
      console.log(err);
      res.status(200).send({ message: "Email sending errored", err });
    }
  );
}
