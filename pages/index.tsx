import type { NextPage } from "next";
import Head from "next/head";
import React, { Fragment } from "react";
import HomeSplash from "../components/HomeSplash/HomeSplash";
import WorkSamples from "../components/WorkSamples/WorkSamples";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <Fragment>
      <Head>
        <title>Connor James Allen - Portfolio site</title>
        <meta
          name="description"
          content="Portfolio site for Connor James Allen"
        />
        <meta
          name="keywords"
          content="developer san francisco frontend fullstack front end full stack"
        />
        <link rel="icon" href="/CJA-ico.png" />
      </Head>
      <main className={styles.App}>
        <HomeSplash></HomeSplash>
        <WorkSamples></WorkSamples>
      </main>
    </Fragment>
  );
}
