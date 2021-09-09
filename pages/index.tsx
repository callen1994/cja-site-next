import type { NextPage } from "next";
import Head from "next/head";
import React, { Fragment } from "react";
import HomeSplash from "../components/HomeSplash/HomeSplash";
import WorkSamples from "../components/WorkSamples/WorkSamples";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <Fragment>
      <Head>
        <title>Connor James Allen ~ Portfolio site</title>
        <meta
          name="description"
          content="Portfolio site for Connor James Allen"
        />
        <link rel="icon" href="/CJA-ico.png" />
      </Head>
      <main className={styles.App}>
        <HomeSplash></HomeSplash>
        <WorkSamples></WorkSamples>
      </main>
    </Fragment>
  );
};

export default Home;
