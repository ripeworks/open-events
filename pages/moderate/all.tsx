import React, { useMemo, useState } from "react";
import { Icon, message, Empty, Input } from "antd";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import Modal from "react-responsive-modal";
import cn from "classnames";

import Header from "../../components/Header";
import EventEdit from "../../components/EventEdit";
import EventDetail from "../../components/EventDetail";
import EventCard from "../../components/EventCard";
import { sortEventsDescending } from "../../utils/event";
import withAuth from "../../components/withAuth";
import { loadEvents } from "../../utils/server/loadEvents";
import { useQuery } from "react-query";
import Loading from "../../components/Loading";

const Search = Input.Search;

type Props = {
  events: any[];
  // events: EventType[];
};

const apiPatchEvent = async (body) => {
  const res = await fetch("/api/patch", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const { success } = await res.json();
  if (!success) throw new Error("Failed to modify event");
};

const onReject = async (event) => {
  try {
    await apiPatchEvent({
      eventId: event.id,
      status: "cancelled",
      visibility: "private",
    });
    message.success("Event Removed!");
    Router.replace("/moderate/all");
  } catch (err) {
    message.error(err.message || "Unexpected Error");
  }
};

const filterFields = ["summary", "description"];
const filterEvents = (filter, { data }) => {
  const reg = new RegExp(filter, "gi");
  return data.filter((row) => {
    const fieldValues = filterFields;
    const matches = fieldValues.filter(
      (field) => !!String(row[field]).match(reg)
    );
    return matches.length > 0;
  });
};

function ModerateAllPage({ events }: Props) {
  const router = useRouter();
  const { id } = router.query;
  const [previewId, setPreviewId] = useState(null);
  const [search, onSearch] = useState("");

  const { data: allEvents, isLoading } = useQuery({
    queryKey: ["allEvents"],
    queryFn: () => fetch("/api/list?deleted=true").then((res) => res.json()),
  });

  const eventList = useMemo(
    () =>
      filterEvents(search, { data: allEvents?.items ?? [] })
        .filter((event) => event.status === "confirmed")
        .sort(sortEventsDescending),
    [allEvents, search]
  );

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-6xl bg-white -mt-20 py-8 px-4 sm:px-12">
        <div className="mb-10">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 items-center">
              <a
                href="/moderate"
                className={cn(
                  "flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
                  "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                )}
              >
                Unapproved
                <span
                  className={cn(
                    "ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block",
                    "bg-gray-100 text-gray-900"
                  )}
                >
                  {events?.length ?? 0}
                </span>
              </a>
              <a
                href="/moderate/all"
                className={cn(
                  "flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
                  "border-blue-500 text-blue-600"
                )}
              >
                All Events
              </a>
              <div className="search-bar justify-self-end">
                <Search
                  allowClear
                  placeholder="Search events"
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </nav>
          </div>
        </div>
        <div className="moderate-events">
          {isLoading && (
            <div className="flex justify-center">
              <Loading large fill="fill-gray-500" />
            </div>
          )}
          {eventList.map((event) => (
            <EventCard
              noLink
              key={event.id}
              event={event}
              actions={[
                <a onClick={() => onReject(event)}>
                  <span className="flex items-center gap-2">
                    <Icon type="stop" /> Remove
                  </span>
                </a>,
                <a onClick={() => setPreviewId(event.id)}>
                  <span className="flex items-center gap-2">
                    <Icon type="eye" /> View
                  </span>
                </a>,
                <Link href={`/moderate/all?id=${event.id}`}>
                  <span className="flex items-center gap-2">
                    <Icon type="edit" /> Edit
                  </span>
                </Link>,
              ]}
            />
          ))}
          {!isLoading && eventList.length < 1 && (
            <div className="flex justify-center">
              <Empty description="No events found." />
            </div>
          )}
        </div>
        <Modal
          open={typeof window !== "undefined" && !!id}
          classNames={{
            overlay: "push-overlay",
            modal: "push-modal",
            closeButton: "push-closeButton",
          }}
          onClose={() => router.push("/moderate/all")}
        >
          {id && <EventEdit event={events.find((event) => event.id === id)} />}
        </Modal>
        <Modal
          open={typeof window !== "undefined" && !!previewId}
          classNames={{
            overlay: "push-overlay",
            modal: "push-modal",
            closeButton: "push-closeButton",
          }}
          onClose={() => setPreviewId(null)}
        >
          {previewId && (
            <EventDetail
              event={events.find((event) => event.id === previewId)}
            />
          )}
        </Modal>
      </section>
    </main>
  );
}

export default withAuth(ModerateAllPage);

export async function getStaticProps() {
  const items = await loadEvents({ showDeleted: true });

  return {
    props: {
      events:
        items
          ?.filter(
            (event) =>
              event.visibility === "public" && event.status === "cancelled"
          )
          .sort(sortEventsDescending) ?? [],
    },
    revalidate: 300,
  };
}
