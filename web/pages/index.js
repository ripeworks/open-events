// @flow
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

const localizer = BigCalendar.momentLocalizer(moment);

const Index = ({ events, id }) => (
  <main>
    <Header />
    <section>
      <center style={{ padding: 40 }}>
        <Link href="/new">
          <Button size="large">Submit Event</Button>
        </Link>
      </center>
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
      <Modal open={!!id} onClose={() => Router.push("/")}>
        {id && <EventDetail event={events.find(event => event.id === id)} />}
      </Modal>
    </section>
  </main>
);

Index.getInitialProps = async ctx => {
  const res = await fetch(`http://localhost:3000/api/list`);
  const { etag, syncToken, items } = await res.json();
  const { id } = ctx.query;

  return { events: items, id };
};

export default Index;
