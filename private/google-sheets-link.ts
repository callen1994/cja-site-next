import { google, sheets_v4 } from "googleapis";
import DancePage from "../components/DancePage/DancePage";
import { promErrWrapper } from "./server-utils";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

async function startupSheets() {
  console.log("\n\n ********* Starting Up Sheets ********* \n\n");
  const auth = await google.auth.getClient({
    scopes: SCOPES,
  });
  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

const sheetsPROM = promErrWrapper(startupSheets);
const errMessage = "Google Sheets connection failed to initiate!";

export function fetchData(range: string): Promise<sheets_v4.Schema$ValueRange> {
  const spreadsheetId = process.env.SHEET_ID;
  console.log(`Fetching Data range ${range}`);
  return sheetsPROM.then(([sheets, err]) => {
    if (sheets)
      return sheets.spreadsheets.values
        .get({
          spreadsheetId,
          range,
        })
        .then((sheetResult) => sheetResult.data);
    return new Promise((res, rej) => rej({ errMessage, err }));
  });
}

// data That matches the props that dance page will take
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
