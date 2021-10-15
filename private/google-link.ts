import { google, sheets_v4 } from "googleapis";
import { testWrapper } from "./server-utils";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

const errData: any = {
  message: "Google Sheets connection failed to initiate!",
};

export const connectGoogle = () => {
  console.log("\n\n************ Stating Up Google Connection ************n\n");
  // Set up the auth Promise to write any error data into the error object
  const auth$ = google.auth.getClient({ scopes: SCOPES }).then(
    (auth) => auth,
    (err) => (errData["err"] = err)
  );
  // Create each google feature as a transformation of the auth promise
  return [auth$.then((auth) => google.sheets({ version: "v4", auth }))];
};

// Setting this up as a promise so I can set the constant synchronously when this module is loaded
// I can access the authenticated sheets (or email) endpoints using "then" which will wait when it needs to wait
// or resolve immediately if it's already been resolved, or give an error directly to the caller when they call
const [sheets$] = connectGoogle();

export function fetchSheetData(
  range: string
): Promise<sheets_v4.Schema$ValueRange> {
  const spreadsheetId = process.env.SHEET_ID;
  return sheets$.then(
    (sheets) =>
      sheets.spreadsheets.values
        .get({ spreadsheetId, range })
        .then((sheetResult) => sheetResult.data),
    () => new Promise((res, rej) => rej(errData))
  );
}
