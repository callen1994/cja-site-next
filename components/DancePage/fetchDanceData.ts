import { cloneDeep, mapKeys } from "lodash";
import { fetchSheetData } from "../../private/google-link";
import { BIG_Log } from "../../socket-server/src/utils";
import { onlyUnique } from "../Utilities/utils";
import { DancePageProps } from "./DancePage";
import { DanceEvent, FilterField, MT_FILTER_OPTS } from "./data-types";

export function fetchDanceData(): Promise<DancePageProps> {
  const ret: DancePageProps = DUMMY_DANCE_DATA;

  return Promise.all([
    fetchSheetData("Events!A2:Z"),
    fetchSheetData("Blurb!A:A"),
  ])
    .then(([danceData, blurbData]) => {
      if (!danceData.values || !blurbData.values) {
        console.log("Missing Data, returning default props");
        return ret;
      }

      const keyRow = danceData.values[0] as FilterField[];
      const body = danceData.values.slice(1);

      ret.eventList = body.map(
        // I know that the indexes line up so I have to use any for a second to get the typing correct
        (row) => mapKeys(row, (v, index) => keyRow[index]) as DanceEvent
      );

      // Set the filter options
      keyRow.map(
        (key, i) =>
          (ret.filterOptions[key] = body
            .map((row) => row[i] || null)
            // Filter so only real values are present
            .filter((x) => !!x)
            .filter(onlyUnique))
      );

      // Blurbs are all in column a. The values object is a list of row lists
      ret.blurbs = blurbData.values?.map((row) => row[0] || null);
      return ret;
    })
    .catch((err) => {
      BIG_Log("Error Fetching Dance Data");
      console.error(err);
      return ret;
    });
}

// Data That matches the props that dance page will take
const DUMMY_DANCE_DATA: DancePageProps = {
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
  filterOptions: cloneDeep(MT_FILTER_OPTS),
};
