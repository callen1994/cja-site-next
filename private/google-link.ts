import { google, sheets_v4 } from "googleapis";
import DancePage from "../components/DancePage/DancePage";

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
  console.log(`Fetching Data range ${range}`);
  return sheets$.then(
    (sheets) =>
      sheets.spreadsheets.values
        .get({ spreadsheetId, range })
        .then((sheetResult) => sheetResult.data),
    () => new Promise((res, rej) => rej(errData))
  );
}

// Data That matches the props that dance page will take
export const DUMMY_DANCE_DATA: Parameters<typeof DancePage>[0] = {
  blurbs: ["Couldn't connect to database", "bar", "wiggle"],
  eventList: [
    {
      title: "test",
      style: "test",
      inPerson: "Yes",
      dayOfWeek: "test",
      repetition: "test",
      time: "test",
      city: "test",
      address: "test",
      links: "test",
      blurb: "test",
      img: "",
    },
    {
      title: "test2",
      style: "test2",
      inPerson: "No",
      dayOfWeek: "test2",
      repetition: "test2",
      time: "test2",
      city: "test2",
      address: "test2",
      links: "test2",
      blurb: "test2",
      img: "",
    },
  ],
  filterOptions: {
    dayOfWeek: ["test", "test2"],
    city: ["test", "test2"],
    inPerson: ["test", "test2"],
    style: ["test", "test2"],
  },
};
