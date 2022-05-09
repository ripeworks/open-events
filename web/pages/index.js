// @flow
import React, { useState } from "react";
import { Alert, Button, Icon } from "antd";
import Link from "next/link";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import Modal from "react-responsive-modal";
import MagicGrid from "magic-grid-react";
import { useContextualRouting } from "next-use-contextual-routing";

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

Router.events.on("routeChangeComplete", (url) => {
  process.env.GA_ID &&
    window.gtag &&
    window.gtag("config", process.env.GA_ID, {
      page_location: url,
    });
});

const Index = ({ events, id }) => {
  const router = useRouter();
  const { eventId } = router.query;
  const { makeContextualHref, returnHref } = useContextualRouting();

  const [view, setView] = useState("list");
  const [calendarDate, setDate] = useState(new Date());

  return (
    <main>
      <Header intro />
      {!id && (
        <Head>
          <link rel="canonical" href="https://northportomenacalendar.com" />
        </Head>
      )}
      <section>
        <div className="flush">
          <Alert
            banner
            message="COVID-19 UPDATE 2022"
            description={
              <div>
                <p>
                  Dear neighbors, visitors, calendar partners and interested
                  parties:
                </p>
                <p>
                  Celebrating with family and friends is an important and
                  treasured time, and we hope everyone will remain vigilant when
                  gathering. The health and safety of our community is a top
                  priority, and while restrictions have been lifted, we
                  encourage residents and visitors alike to utilize the tools to
                  stay safe and lower the risk of COVID-19 infection and severe
                  illness--wear a well-fitting mask indoors, get tested before
                  attending indoor gatherings, and get vaccinated and boosted.
                  Please be kind, gracious, respectful and attentive to the
                  safety of others.
                </p>
                <p>&nbsp;</p>
                <p>
                  Inquiries, suggestions and comments related to improving the
                  usefulness of the Northport Omena Calendar may be sent to
                  leelanaucommunitycalendar@gmail.com.
                </p>
              </div>
            }
            type="warning"
          />
        </div>
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
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </MagicGrid>
        )}
        {view === "calendar" && (
          <BigCalendar
            localizer={localizer}
            events={events}
            titleAccessor="summary"
            startAccessor={(event) =>
              new Date(event.start.dateTime || `${event.start.date}T00:00:00`)
            }
            endAccessor={(event) =>
              new Date(event.end.dateTime || `${event.end.date}T23:59:59`)
            }
            allDayAccessor={(event) => !!event.start.date}
            onSelectEvent={(event) => {
              router.push(
                makeContextualHref({ eventId: event.id }),
                `/event/${event.id}`,
                { scroll: false }
              );
            }}
            date={calendarDate}
            popup
            toolbar={false}
          />
        )}
        <Modal
          open={!!eventId}
          classNames={{
            overlay: "push-overlay",
            modal: "push-modal",
            closeButton: "push-closeButton",
          }}
          onClose={() => router.push(returnHref)}
        >
          {!!eventId && (
            <EventDetail event={events.find((event) => event.id === eventId)} />
          )}
        </Modal>
      </section>
    </main>
  );
};

export async function getStaticProps() {
  const res = await fetch(`${process.env.API_URL}/api/list?single=true`);
  const { etag, syncToken, items } = await res.json();

  return {
    props: {
      events: items
        .filter((event) => {
          return new Date(event.end.dateTime || event.end.date) >= new Date();
        })
        .sort(sortEvents),
    },
    revalidate: 300,
  };
}

export default Index;
