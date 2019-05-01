import "antd/dist/antd.css";
import "../styles/app.css";
import { message } from "antd";
import Header from "../components/Header";
import EventForm from "../components/EventForm";

export default class Page extends React.Component {
  onSubmit = async event => {
    const res = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...event,
        photo: event.photo && event.photo[0] && event.photo[0].response.webViewLink
      })
    });
    const { success } = await res.json();
    if (success) {
      message.success("Thank you! Event submitted for review");
    } else {
      message.error("Failed to submit event");
    }
  };

  render() {
    return (
      <main>
        <Header />
        <section>
          <EventForm onSubmit={this.onSubmit} />
        </section>
      </main>
    );
  }
}
