import fetch from "isomorphic-fetch";
import { Alert, message } from "antd";
import EventForm from "./EventForm";

export default class EventEdit extends React.Component {
  onSubmit = async event => {
    const res = await fetch("/api/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...event,
        eventId: this.props.event.id,
        photo:
          event.photo && event.photo[0] && event.photo[0].response.webViewLink
      })
    });
    const { success } = await res.json();

    if (success) {
      message.success("Event saved!");
    } else {
      message.error("Failed to save");
    }
  };

  render() {
    const { event } = this.props;

    return <EventForm event={event} onSubmit={this.onSubmit} />;
  }
}
