import React, { useState } from "react";
import { Alert, Button, Icon, message } from "antd";
import Link from "next/link";
import Router from "next/router";
import Header from "../components/Header";
import EventForm from "../components/EventForm";

export default function NewPage() {
  const [newEditUrl, setNewEditUrl] = useState("");
  const [success, setSuccess] = useState(false);

  async function onSubmit(event) {
    const res = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...event,
        photo:
          event.photo && event.photo[0] && event.photo[0].response.webViewLink,
      }),
    });
    const { id, editUrl, success } = await res.json();
    setNewEditUrl(editUrl);
    setSuccess(success);

    if (!success) {
      message.error("Failed to submit event");
    }
  }

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-6xl bg-white -mt-20 py-8 px-5 sm:px-12">
        <p className="mb-4">
          <Link href="/">
            <Button size="large">
              <Icon type="left" />
              Back to Calendar
            </Button>
          </Link>
        </p>
        <p className="mb-4">
          Please fill out the form below to submit an event to the Northport
          Omena Calendar. Events require approval before they will be visible on
          the calendar, so please allow up to 72 hours for approval.
        </p>
        <p className="mb-4">
          All events must meet the following criteria to be eligible for
          posting:
        </p>
        <ul className="list-disc list-inside pl-6 mb-4">
          <li>Available to public (no membership only or private events)</li>
          <li>Take place in Leelanau Township</li>
        </ul>
        <p className="mb-4">
          For questions, help, or requests please contact:{" "}
          <a href="mailto:leelanaucommunitycalendar@gmail.com">
            leelanaucommunitycalendar@gmail.com
          </a>
        </p>
        <EventForm onSubmit={onSubmit} />
        {success === true && (
          <Alert
            closable
            message="Thank you!"
            description={
              <>
                <p>Your event has been submitted for review.</p>
                {!!newEditUrl && (
                  <p>
                    Need to make changes? Use this link to go back and edit your
                    submission:{" "}
                    <a href={newEditUrl} target="_blank">
                      {newEditUrl}
                    </a>
                  </p>
                )}
              </>
            }
            type="success"
            showIcon
          />
        )}
      </section>
    </main>
  );
}
