import moment from "moment";
import { Icon } from "antd";
import EventDate from "./EventDate";
import EventDescription from "./EventDescription";
import Map from "./Map";
import { getPhotoUrl, getVolunteerText } from "../utils";

const Detail = ({ icon, children }) => (
  <div className="detail">
    <div className="icon">{icon && icon}</div>
    <div className="detail-content">{children}</div>
    <style jsx>{`
      .detail {
        display: flex;
        padding-left: 0.5rem;
      }

      .icon {
        flex-grow: 0;
        flex-shrink: 0;
        width: 40px;
        max-height: 52px;
        font-size: 24px;
      }

      .detail-content {
        flex: 1;
        padding: 6px 0;
      }
    `}</style>
  </div>
);

export default class EventDetail extends React.Component {
  render() {
    const { event } = this.props;
    const {
      attachments: [attachment] = [],
      start: { dateTime: startDateTime, date: allDayStart },
      end: { dateTime: endDateTime, date: allDayEnd },
      extendedProperties: {
        shared: { Cost: cost, Organizer: organizer }
      },
      source: { url: websiteUrl } = {}
    } = event;

    const start = moment(startDateTime || allDayStart);
    const end = moment(endDateTime || allDayEnd);
    const allDay = !!allDayStart;
    const volunteerText = getVolunteerText(event.description);

    console.log(event);

    return (
      <div>
        <div className="event-image">
          {attachment && (
            <div
              style={{
                backgroundImage: `url("${getPhotoUrl(attachment.fileUrl)}")`
              }}
            />
          )}
        </div>
        <Detail>
          <h1>{event.summary}</h1>
          {organizer && <div>{organizer}</div>}
          <EventDate start={start} end={end} allDay={allDay} />
        </Detail>
        <Detail icon={<Icon type="environment" />}>
          <span>{event.location}</span>
          <Map
            location={event.location}
            containerElement={<div className="map-container" />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </Detail>
        <Detail icon={<Icon type="info-circle" />}>
          <EventDescription description={event.description} />
        </Detail>
        {cost && (
          <Detail icon={<Icon type="dollar" />}>
            <p>{cost}</p>
          </Detail>
        )}
        {volunteerText && (
          <Detail icon={<Icon type="team" />}>
            <p>Volunteers needed</p>
          </Detail>
        )}
        {websiteUrl && (
          <Detail icon={<Icon type="global" />}>
            <p>
              <a href={websiteUrl} target="_blank">
                {websiteUrl}
              </a>
            </p>
          </Detail>
        )}
      </div>
    );
  }
}
