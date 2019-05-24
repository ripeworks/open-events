import { Card } from "antd";
import Link from "next/link";
import EventDate from "./EventDate";
import EventDescription from "./EventDescription";
import moment from "moment";
import { getPhotoUrl } from "../utils";

const { Meta } = Card;

export default ({ event }) => {
  const {
    attachments: [attachment] = [],
    start: { dateTime: startDateTime },
    end: { dateTime: endDateTime }
  } = event;

  const start = moment(startDateTime);
  const end = moment(endDateTime);
  const cardProps = {};

  if (attachment) {
    cardProps.cover = (
      <div
        style={{ backgroundImage: `url("${getPhotoUrl(attachment.fileUrl)}")` }}
      />
    );
  }

  return (
    <div>
      <Link href={`/?id=${event.id}`} as={`/event/${event.id}`}>
        <Card hoverable {...cardProps}>
          <Meta title={event.summary} />
          <EventDate start={start} end={end} allDay={false} />
          <EventDescription summary description={event.description} />
        </Card>
      </Link>
    </div>
  );
};
