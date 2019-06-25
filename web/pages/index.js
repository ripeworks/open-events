// @flow
import { useState } from "react";
import "antd/dist/antd.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/app.css";
import fetch from "isomorphic-fetch";
import { Button, Icon } from "antd";
import Link from "next/link";
import Router from "next/router";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import Modal from "react-responsive-modal";
import MagicGrid from "magic-grid-react";

import Header from "../components/Header";
import EventDetail from "../components/EventDetail";
import EventCard from "../components/EventCard";
import { sortEvents } from "../utils";

const ButtonGroup = Button.Group;
const localizer = BigCalendar.momentLocalizer(moment);

const setMonth = (date, value) => {
  const nextDate = new Date(date);
  if (nextDate.getMonth() == 11 && value > 0) {
    return new Date(nextDate.getFullYear() + 1, 0, 1);
  } else if (nextDate.getMonth() === 0 && value < 0) {
    return new Date(nextDate.getFullYear() - 1, 11, 1);
  } else {
    return new Date(nextDate.getFullYear(), nextDate.getMonth() + value, 1);
  }
};

const Index = ({ events, id }) => {
  const [view, setView] = useState("list");
  const [calendarDate, setDate] = useState(new Date());

  return (
    <main>
      <Header intro />
      <section>
        <div className="toolbar">
          {view === "calendar" && (
            <ButtonGroup>
              <Button
                onClick={() => setDate(setMonth(calendarDate, -1))}
                size="large"
              >
                <Icon type="left" />
              </Button>
              <span className="current-month">
                {moment(calendarDate).format("MMMM YYYY")}
              </span>
              <Button
                onClick={() => setDate(setMonth(calendarDate, 1))}
                size="large"
              >
                <Icon type="right" />
              </Button>
            </ButtonGroup>
          )}
          <div className="view-controls">
            <ButtonGroup>
              <Button
                size="large"
                type={view === "list" ? "primary" : "default"}
                onClick={() => setView("list")}
              >
                List
              </Button>
              <Button
                size="large"
                type={view === "calendar" ? "primary" : "default"}
                onClick={() => setView("calendar")}
              >
                Calendar
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Link href="/new">
                <Button size="large">Submit Event</Button>
              </Link>
            </ButtonGroup>
          </div>
        </div>
        {view === "list" && (
          <MagicGrid gutter={0}>
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </MagicGrid>
        )}
        {view === "calendar" && (
          <BigCalendar
            localizer={localizer}
            events={events}
            titleAccessor="summary"
            startAccessor={event =>
              new Date(event.start.dateTime || `${event.start.date}T00:00:00`)
            }
            endAccessor={event =>
              new Date(event.end.dateTime || `${event.end.date}T23:59:59`)
            }
            allDayAccessor={event => !!event.start.date}
            onSelectEvent={event => {
              Router.push(`/?id=${event.id}`, `/event/${event.id}`);
            }}
            date={calendarDate}
            popup
            toolbar={false}
          />
        )}
        <Modal
          open={typeof window !== "undefined" && !!id}
          classNames={{
            overlay: "push-overlay",
            modal: "push-modal",
            closeButton: "push-closeButton"
          }}
          onClose={() => Router.push("/")}
        >
          {id && <EventDetail event={events.find(event => event.id === id)} />}
        </Modal>
      </section>
    </main>
  );
};

Index.getInitialProps = async ctx => {
  const res = await fetch(`${process.env.API_URL}/api/list`);
  const { etag, syncToken, items } = await res.json();
  const { id } = ctx.query;

  return {
    events: items
      .filter(event => {
        return new Date(event.end.dateTime || event.end.date) >= new Date();
      })
      .sort(sortEvents),
    id
  };
};

export default Index;
