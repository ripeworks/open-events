import React, { useState } from "react";
import { Icon, message, Empty } from "antd";
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

const onApprove = async (event) => {
  try {
    await apiPatchEvent({
      eventId: event.id,
      status: "confirmed",
      visibility: "public",
    });
    message.success("Event Approved!");
    Router.replace("/moderate");
  } catch (err) {
    message.error(err.message || "Unexpected Error");
  }
};

const onReject = async (event) => {
  try {
    await apiPatchEvent({
      eventId: event.id,
      status: "cancelled",
      visibility: "private",
    });
    message.success("Event Rejected!");
    Router.replace("/moderate");
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

function ModeratePage({ events }: Props) {
  const router = useRouter();
  const { id } = router.query;
  const [view, setView] = useState("unapproved");
  const [previewId, setPreviewId] = useState(null);
  const [search, onSearch] = useState("");

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
                  "border-blue-500 text-blue-600"
                )}
              >
                Unapproved
                <span
                  className={cn(
                    "ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block",
                    "bg-blue-100 text-blue-600"
                  )}
                >
                  {events.length}
                </span>
              </a>
              <a
                href="/moderate/all"
                className={cn(
                  "flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
                  "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                )}
              >
                All Events
              </a>
            </nav>
          </div>
        </div>
        <div className="moderate-events">
          {events.map((event) => (
            <EventCard
              noLink
              key={event.id}
              event={event}
              actions={[
                <a onClick={() => onApprove(event)}>
                  <span className="flex items-center gap-2">
                    <Icon type="check" /> Approve
                  </span>
                </a>,
                <a onClick={() => onReject(event)}>
                  <span className="flex items-center gap-2">
                    <Icon type="stop" /> Reject
                  </span>
                </a>,
                <a onClick={() => setPreviewId(event.id)}>
                  <span className="flex items-center gap-2">
                    <Icon type="eye" /> View
                  </span>
                </a>,
                <Link href={`/moderate?id=${event.id}`}>
                  <span className="flex items-center gap-2">
                    <Icon type="edit" /> Edit
                  </span>
                </Link>,
              ]}
            />
          ))}
          {events.length < 1 && (
            <div className="flex justify-center">
              <Empty description="No events in the queue. Nice job!" />
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
          onClose={() => router.push("/moderate")}
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

export default withAuth(ModeratePage);

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
