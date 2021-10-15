import Head from "next/head";
import React, { Fragment } from "react";
import DancePage, { DancePageProps } from "../components/DancePage/DancePage";
import { fetchDanceData } from "../components/DancePage/fetchDanceData";
import { nowString } from "../socket-server/src/utils";

// This is in seconds
// 10 second isr was getting me into an infinite reload loop when I deployed... It's weird that the last built value would be
// 10 seconds old by the time my browser load it. But I'm investigating whether that's actually a result of timezone weirdness right now
const ISR_PERIOD = 30;

// This adding the lastBuilt tag to manage ISR functionality at the page level
// (this doesn't need to go down to the page component)
interface PageProps extends DancePageProps {
  lastBuilt: number;
}

export default function Dance(props: PageProps) {
  // Window isn't defined on the server, but this shouldn't get executed on
  // the server because the server will always have the most recent lastBuilt
  if (Date.now() - props.lastBuilt > ISR_PERIOD * 1000)
    // console.log("This would trigger a reload for me");
    window?.location.reload();

  return (
    <Fragment>
      <Head>
        <title>Dance In the Bay!</title>
        <meta name="description" content="Dance events in the Bay Area" />
        <meta
          name="keywords"
          content="partner dance bay bay area events local info"
        />
        <link rel="icon" href="/CJA-ico.png" />
      </Head>

      {/* This: leads to weird react issues... so I shouldn't do this... */}
      {/* BAD: This lets me pass props in all at once instead of enumerating them in the html style */}
      {/* BAD: {DancePage(props)} */}
      <DancePage
        blurbs={props.blurbs}
        filterOptions={props.filterOptions}
        eventList={props.eventList}
      />
    </Fragment>
  );
}

export async function getStaticProps() {
  console.log("Rebuilding Dance Page");
  const props: PageProps = {
    // All the error handling is done in here
    ...(await fetchDanceData()),
    lastBuilt: Date.now(),
  };
  // In case I add asynchronous functions above here I want this timestamp to be set at the end of the props generation
  // so I don't count load time into whether I need to re-load
  props.lastBuilt = Date.now();
  console.log("Dance Page Built at: " + nowString());
  return { props, revalidate: ISR_PERIOD };
}
