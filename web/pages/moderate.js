// @flow
import { useState } from "react";
import "antd/dist/antd.css";
import "../styles/app.css";
import fetch from "isomorphic-fetch";
import readAuth from "basic-auth";
import { Button, Icon, message } from "antd";
import Link from "next/link";
import Router from "next/router";
import moment from "moment";
import Modal from "react-responsive-modal";

import Header from "../components/Header";
import EventEdit from "../components/EventEdit";
import EventCard from "../components/EventCard";
import { sortEvents } from "../utils";

const ButtonGroup = Button.Group;

const apiPatchEvent = async body => {
  const res = await fetch("/api/patch", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const { success } = await res.json();
  if (!success) throw new Error("Failed to modify event");
};

const onApprove = async event => {
  try {
    await apiPatchEvent({
      eventId: event.id,
      status: "confirmed",
      visibility: "public"
    });
    message.success("Event Approved!");
  } catch (err) {
    message.error(err.message || "Unexpected Error");
  }
};

const onReject = async event => {
  try {
    await apiPatchEvent({
      eventId: event.id,
      status: "cancelled",
      visibility: "private"
    });
    message.success("Event Rejected!");
  } catch (err) {
    message.error(err.message || "Unexpected Error");
  }
};

const Moderate = ({ events, id }) => {
  const [view, setView] = useState("unapproved");

  return (
    <main>
      <Header />
      <section>
        <div className="toolbar">
          <ButtonGroup>
            <Button
              size="large"
              type={view === "unapproved" ? "primary" : "default"}
              onClick={() => setView("unapproved")}
            >
              Unapproved
            </Button>
            <Button
              size="large"
              type={view === "approved" ? "primary" : "default"}
              onClick={() => setView("approved")}
            >
              Approved
            </Button>
          </ButtonGroup>
        </div>
        <div className="moderate-events">
          {[...events]
            .filter(event =>
              view === "approved"
                ? event.visibility === "public"
                : event.visibility === "private" && event.status === "confirmed"
            )
            .sort(sortEvents)
            .map(event => (
              <EventCard
                noLink
                key={event.id}
                event={event}
                actions={[
                  <a onClick={() => onApprove(event)}>
                    <Icon type="check" />
                  </a>,
                  <a onClick={() => onReject(event)}>
                    <Icon type="stop" />
                  </a>,
                  <Link href={`/moderate?id=${event.id}`}>
                    <Icon type="edit" />
                  </Link>
                ]}
              />
            ))}
        </div>
        <Modal
          open={typeof window !== "undefined" && !!id}
          classNames={{
            overlay: "push-overlay",
            modal: "push-modal",
            closeButton: "push-closeButton"
          }}
          onClose={() => Router.push("/moderate")}
        >
          {id && <EventEdit event={events.find(event => event.id === id)} />}
        </Modal>
      </section>
    </main>
  );
};

Moderate.getInitialProps = async ctx => {
  if (ctx.req) {
    const credentials = readAuth(ctx.req);

    if (
      !credentials ||
      (credentials.name !== "admin" && credentials.pass !== "admin")
    ) {
      ctx.res.writeHead(401, {
        "WWW-Authenticate": 'Basic realm="now-basic-auth-node"'
      });
      ctx.res.end("Restricted area. Please login.");
    }
  }

  const res = await fetch(`${process.env.API_URL}/api/list`);
  const { etag, syncToken, items } = await res.json();
  const { id } = ctx.query;

  return { events: items, id };
};

export default Moderate;
