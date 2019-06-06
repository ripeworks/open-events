import { Card } from "antd";
import Link from "next/link";
import EventDate from "./EventDate";
import EventDescription from "./EventDescription";
import moment from "moment";
import { getPhotoUrl } from "../utils";

const { Meta } = Card;

export default ({ actions, event, noLink = false }) => {
  const {
    attachments: [attachment] = [],
    start: { dateTime: startDateTime, date: allDayStart },
    end: { dateTime: endDateTime, date: allDayEnd }
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
      <Link href={`/?id=${event.id}`} as={`/event/${event.id}`}>
        <Card hoverable {...cardProps}>
          <Meta title={event.summary} />
          <EventDate block start={start} end={end} allDay={allDay} />
          <EventDescription summary description={event.description} />
        </Card>
      </Link>
    </div>
  );
};
