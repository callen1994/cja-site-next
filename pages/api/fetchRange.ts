import type { NextApiRequest, NextApiResponse } from "next";
import { fetchData } from "../../private/google-sheets-link";
import { makeErrHandler } from "../../private/server-utils";

export default async function fetchRange(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Fetch range api endpoint hit");
  // It doesn't change the functionality at all, but if I add the await keyword, next.js doesn't
  // throw a warning about there ebing no resonse value
  // Becaue it checks at the end of execution and without await, I end execution with this promise unresolved, where with the await, it only checks after it's been resolved
  await fetchData(req.query.range as string).then(
    (sheetRes) => res.send(sheetRes),
    makeErrHandler(res, "fetch failed!")
  );
}
