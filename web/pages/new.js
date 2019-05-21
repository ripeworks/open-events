import "antd/dist/antd.css";
import "../styles/app.css";
import fetch from "unfetch";
import { Alert, message } from "antd";
import Header from "../components/Header";
import EventForm from "../components/EventForm";

export default class Page extends React.Component {
  state = {
    success: null
  };

  onSubmit = async event => {
    const res = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...event,
        photo:
          event.photo && event.photo[0] && event.photo[0].response.webViewLink
      })
    });
    const { success } = await res.json();
    this.setState({ success });

    if (!success) {
      message.error("Failed to submit event");
    }
  };

  render() {
    const { success } = this.state;

    return (
      <main>
        <Header />
        <section>
          <p>Please fill out the form below to submit an event to the Northport Omena Calendar. Events require approval before they will be visible on the calendar, so please allow up to 72 hours for approval.</p>
          <p>All events must meet the following criteria to be eligible for posting:</p>
          <ul>
            <li>Available to public (no membership only or private events)</li>
            <li>Take place in Leelanau Township</li>
          </ul>
          <EventForm onSubmit={this.onSubmit} />
          {success === true && (
            <Alert
              closable
              message="Thank you!"
              description="Your event has been submitted for review."
              type="success"
              showIcon
            />
          )}
        </section>
      </main>
    );
  }
}
