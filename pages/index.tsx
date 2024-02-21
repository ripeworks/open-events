import React, { useState } from "react";
import { Icon } from "antd";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import Modal from "react-responsive-modal";
import MagicGrid from "magic-grid-react";
import { useContextualRouting } from "next-use-contextual-routing";
import cn from "classnames";

import Header from "../components/Header";
import EventDetail from "../components/EventDetail";
import EventCard from "../components/EventCard";
import { sortEvents } from "../utils/event";
import { loadEvents } from "../utils/server/loadEvents";

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

export default function IndexPage({ events }) {
  const router = useRouter();
  const { eventId } = router.query;
  const { makeContextualHref, returnHref } = useContextualRouting();

  const [view, setView] = useState("list");
  const [calendarDate, setDate] = useState(new Date());

  return (
    <main>
      <Header intro />
      {!eventId && (
        <Head>
          <link rel="canonical" href="https://northportomenacalendar.com" />
        </Head>
      )}
      <section className="mx-auto max-w-6xl bg-white -mt-20 py-8 px-4 sm:px-12">
        <div className="toolbar">
          {view === "calendar" && (
            <div className="isolate inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className={cn(
                  "relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                )}
                onClick={() => setDate(setMonth(calendarDate, -1))}
              >
                <Icon type="left" />
              </button>
              <span className="relative -ml-px px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                {moment(calendarDate).format("MMMM YYYY")}
              </span>
              <button
                type="button"
                className={cn(
                  "relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                )}
                onClick={() => setDate(setMonth(calendarDate, 1))}
              >
                <Icon type="right" />
              </button>
            </div>
          )}
          <div className="view-controls">
            <div className="isolate inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className={cn(
                  "relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10",
                  view === "list" ? "bg-blue-50" : "bg-white"
                )}
                onClick={() => setView("list")}
              >
                List
              </button>
              <button
                type="button"
                className={cn(
                  "relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10",
                  view === "calendar" ? "bg-blue-50" : "bg-white"
                )}
                onClick={() => setView("calendar")}
              >
                Calendar
              </button>
            </div>
            <div className="inline-flex ml-8">
              <Link
                href="/new"
                className="shadow-sm items-center rounded-md px-3 py-2 text-sm font-semibold bg-gray-500 text-white ring-offset-0 ring-gray-100 hover:bg-gray-400 hover:text-white focus-visible:outline focus:ring-4"
              >
                Submit Event
              </Link>
            </div>
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
}

export async function getStaticProps() {
  const items = await loadEvents({ singleEvents: true });

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
