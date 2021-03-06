import React from "react";
import { Alert, Button, Icon, message } from "antd";
import Link from "next/link";
import Router from "next/router";
import Header from "../components/Header";
import EventForm from "../components/EventForm";
import { Base64 } from "js-base64";

Router.events.on("routeChangeComplete", (url) => {
  process.env.GA_ID &&
    window.gtag &&
    window.gtag("config", process.env.GA_ID, {
      page_location: url,
    });
});

export default class Page extends React.Component {
  state = {
    newEventId: null,
    newEditUrl: null,
    success: null,
  };

  onSubmit = async (event) => {
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
    this.setState({ newEventId: id, newEditUrl: editUrl, success });

    if (!success) {
      message.error("Failed to submit event");
    }
  };

  render() {
    const { newEventId, newEditUrl, success } = this.state;

    return (
      <main>
        <Header />
        <section>
          <p>
            <Link href="/">
              <Button size="large">
                <Icon type="left" />
                Back to Calendar
              </Button>
            </Link>
          </p>
          <p>
            Please fill out the form below to submit an event to the Northport
            Omena Calendar. Events require approval before they will be visible
            on the calendar, so please allow up to 72 hours for approval.
          </p>
          <p>
            All events must meet the following criteria to be eligible for
            posting:
          </p>
          <ul>
            <li>Available to public (no membership only or private events)</li>
            <li>Take place in Leelanau Township</li>
          </ul>
          <p>
            For questions, help, or requests please contact:{" "}
            <a href="mailto:leelanaucommunitycalendar@gmail.com">
              leelanaucommunitycalendar@gmail.com
            </a>
          </p>
          <EventForm onSubmit={this.onSubmit} />
          {success === true && (
            <Alert
              closable
              message="Thank you!"
              description={
                <>
                  <p>Your event has been submitted for review.</p>
                  {!!newEditUrl && (
                    <p>
                      Need to make changes? Use this link to go back and edit your submission:{" "}
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
}
