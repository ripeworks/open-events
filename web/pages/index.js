// @flow
import { useState } from "react";
import "antd/dist/antd.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/app.css";
import fetch from "isomorphic-fetch";
import { Button } from "antd";
import Link from "next/link";
import Router from "next/router";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import Modal from "react-responsive-modal";

import Header from "../components/Header";
import EventDetail from "../components/EventDetail";
import EventCard from "../components/EventCard";
import { sortEvents } from "../utils";

const ButtonGroup = Button.Group;
const localizer = BigCalendar.momentLocalizer(moment);

const Index = ({ events, id }) => {
  const [view, setView] = useState("list");

  return (
    <main>
      <Header />
      <section>
        <center style={{ padding: 40 }}>
          <Link href="/new">
            <Button size="large">Submit Event</Button>
          </Link>
        </center>
        <div>
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
        </div>
        {view === "list" && (
          <div className="event-list">
            {[...events].sort(sortEvents).map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
        {view === "calendar" && (
          <BigCalendar
            localizer={localizer}
            events={events}
            titleAccessor="summary"
            startAccessor={event => event.start.dateTime}
            endAccessor={event => event.end.dateTime}
            onSelectEvent={event => {
              Router.push(`/?id=${event.id}`, `/event/${event.id}`);
            }}
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
  const res = await fetch(`http://localhost:3000/api/list`);
  const { etag, syncToken, items } = await res.json();
  const { id } = ctx.query;

  return { events: items, id };
};

export default Index;
