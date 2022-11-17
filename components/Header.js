import React from "react";
import Head from "next/head";

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
      <hgroup>
        <h1>Northport Omena Calendar</h1>
        {intro && (
          <>
            <p>
              Come discover Northport and Omena events, places to visit, and
              things to do in Leelanau Township.
            </p>
            <details>
              <summary className="ant-btn-link">
                <span>Learn More</span>
              </summary>
              <p>
                The event calendar is a one-stop place to connect you -- our
                community of longtime residents, newcomers and visitors -- with
                all our local events. Find meeting times for Leelanau Township
                and Northport Village. Get connected with local civic
                organization and volunteer opportunities in Northport and Omena.
                It's an all-in-one guide to fun and community connections in
                these two historic Lake Michigan towns at the north end of
                Leelanau Peninsula.
              </p>
              <p>Click on a calendar item for additional information.</p>
            </details>
          </>
        )}
      </hgroup>
    </header>
  );
}
