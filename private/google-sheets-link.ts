import { google, sheets_v4 } from "googleapis";
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
