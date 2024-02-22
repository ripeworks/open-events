import React from "react";
import Head from "next/head";
import Router from "next/router";
import Link from "next/link";

Router.events.on("routeChangeComplete", (url) => {
  process.env.NEXT_PUBLIC_GA_ID &&
    // @ts-ignore
    window.gtag &&
    // @ts-ignore
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
      page_location: url,
    });
});

export default function Header({ intro = false }) {
  return (
    <header>
      <Head>
        <title>Northport Omena Calendar</title>
        <meta
          name="description"
          content="Come discover Northport and Omena events, places to visit, and
            things to do in Leelanau Township. The event calendar is a one-stop place to connect you -- our
            community of longtime residents, newcomers and visitors -- with
            all our local events. Find meeting times for Leelanau Township and
            Northport Village. Get connected with local civic organization and
            volunteer opportunities in Northport and Omena. It's an all-in-one
            guide to fun and community connections in these two historic Lake
            Michigan towns at the north end of Leelanau Peninsula."
        />
      </Head>
      <hgroup className="mx-auto max-w-6xl flex-shrink-0 pt-24 px-4 pb-40">
        <h1 className="text-4xl font-bold leading-9 tracking-tight text-white">
          <Link href="/" className="cursor-default hover:text-white">
            Northport Omena Calendar
          </Link>
        </h1>
        {intro && (
          <>
            <p className="mt-2 mb-6 text-lg leading-8 text-white">
              Come discover Northport and Omena events, places to visit, and
              things to do in Leelanau Township.
            </p>
            <details>
              <summary className="text-lg font-semibold leading-6 text-blue-300 cursor-pointer hover:text-blue-200">
                <span>Learn More</span>
              </summary>
              <p className="mt-6 text-lg leading-8 text-white">
                The event calendar is a one-stop place to connect you -- our
                community of longtime residents, newcomers and visitors -- with
                all our local events. Find meeting times for Leelanau Township
                and Northport Village. Get connected with local civic
                organization and volunteer opportunities in Northport and Omena.
                It's an all-in-one guide to fun and community connections in
                these two historic Lake Michigan towns at the north end of
                Leelanau Peninsula.
              </p>
              <p className="mt-6 text-lg leading-8 text-white">
                Click on a calendar item for additional information.
              </p>
            </details>
          </>
        )}
      </hgroup>
    </header>
  );
}
