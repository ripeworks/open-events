import React from "react";
import { Card } from "antd";
import Link from "next/link";
import EventDate from "./EventDate";
import EventDescription from "./EventDescription";
import moment from "moment";
import { getPhotoUrl } from "../utils/event";
import { useContextualRouting } from "next-use-contextual-routing";

const { Meta } = Card;

export default function EventCard({
  actions = undefined,
  event,
  noLink = false,
}) {
  const { makeContextualHref } = useContextualRouting();

  const {
    attachments: [attachment] = [],
    start: { dateTime: startDateTime, date: allDayStart },
    end: { dateTime: endDateTime, date: allDayEnd },
  } = event;

  const start = moment(startDateTime || allDayStart);
  const end = moment(endDateTime || allDayEnd);
  const allDay = !!allDayStart;
  const cardProps = { actions };

  if (attachment && attachment.fileUrl) {
    cardProps.cover = (
      <div
        style={{ backgroundImage: `url(${getPhotoUrl(attachment.fileUrl)})` }}
      />
    );
  }

  if (noLink) {
    return (
      <div>
        <Card {...cardProps}>
          <Meta title={event.summary} />
          <EventDate block start={start} end={end} allDay={allDay} />
          <EventDescription summary description={event.description} />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={makeContextualHref({ eventId: event.id })}
        as={`/event/${event.id}`}
        scroll={false}
      >
        <Card hoverable {...cardProps}>
          <Meta title={event.summary} />
          <EventDate block start={start} end={end} allDay={allDay} />
          <EventDescription summary description={event.description} />
        </Card>
      </Link>
    </div>
  );
}
