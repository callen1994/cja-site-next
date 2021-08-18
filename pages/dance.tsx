import Head from "next/head";
import { cloneDeep, mapKeys } from "lodash";
import React, { Fragment } from "react";
import DancePage from "../components/DancePage/DancePage";
import {
  DanceEvent,
  FilterField,
  FilterOptions,
  MT_FITLER_OPTS,
} from "../components/DancePage/data-types";
import { fetchData } from "../private/google-sheets-link";
import { onlyUnique } from "../components/utils";

type Props = Parameters<typeof DancePage>[0];

export default function Dance(props: Props) {
  return (
    <Fragment>
      <Head>
        <title>Dance In the Bay!</title>
        <meta name="description" content="Dance events in the Bay Area" />
        <link rel="icon" href="/CJA-ico.png" />
      </Head>
      {/* This lets me pass props in all at once instead of enumerating them in the html style */}
      {DancePage(props)}
    </Fragment>
    // <DancePage></DancePage>
  );
}

export async function getStaticProps() {
  const danceData = await fetchData("Events!A2:Z");
  const blurbData = await fetchData("Blurb!A:A");

  if (!danceData.values) return { props: DUMMY_DATA };

  const keyRow = danceData.values[0] as FilterField[];
  const body = danceData.values.slice(1);
  const eventList = body.map(
    // I know that the indexes line up so I have to use any for a second to get the typing correct
    (row) => mapKeys(row, (v, index) => keyRow[index]) as DanceEvent
  );
  // const filterOptions =
  const filterOptions: FilterOptions = cloneDeep(MT_FITLER_OPTS);
  keyRow.map(
    (key, i) =>
      (filterOptions[key] = body.map((row) => row[i]).filter(onlyUnique))
  );

  return {
    props: {
      // Blurbs are all in column a. The valeus object is a list of row lists
      blurbs: blurbData.values?.map((row) => row[0]),
      eventList,
      filterOptions,
    },
    revalidate: 10,
  };
}

const DUMMY_DATA: Props = {
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