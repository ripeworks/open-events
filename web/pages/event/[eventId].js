import { Button } from "antd";
import React, { useEffect } from "react";
import Link from "next/link";
import EventDetail from "../../components/EventDetail";

import { useRouter } from "next/router";

const EventPage = ({ event }) => {
  const router = useRouter();
  useEffect(() => {
    router.prefetch("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return event ? (
    <main>
      <div className="button-overlay">
        <Link href="/">
          <Button>Back to Calendar</Button>
        </Link>
      </div>
      <EventDetail page event={event} />
    </main>
  ) : (
    <div />
  );
};

export default EventPage;

export async function getStaticProps(context) {
  const { eventId } = context.params;
  const res = await fetch(`${process.env.API_URL}/api/list?single=true`);
  const { items } = await res.json();
  const event = items.find((event) => event.id === eventId);

  return { props: { eventId, event }, notFound: !event };
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
