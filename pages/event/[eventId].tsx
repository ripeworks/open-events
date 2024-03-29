import { Button } from "antd";
import React, { useEffect } from "react";
import Link from "next/link";
import EventDetail from "../../components/EventDetail";

import { useRouter } from "next/router";
import { GetStaticPropsContext } from "next";
import { loadEvent } from "../../utils/server/loadEvents";

type Props = {
  event: any;
};

export default function EventPage({ event }: Props) {
  const router = useRouter();
  useEffect(() => {
    router.prefetch("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return event ? (
    <main>
      <div className="button-overlay z-10">
        <Link href="/">
          <Button>Back to Calendar</Button>
        </Link>
      </div>
      <EventDetail page event={event} />
    </main>
  ) : (
    <div />
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const { eventId } = context.params;

  try {
    const event = await loadEvent(String(eventId));
    return { props: { eventId, event }, revalidate: 3600 };
  } catch (err) {
    return { notFound: true, revalidate: 3600 };
  }
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
