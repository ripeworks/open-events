import "antd/dist/antd.css";
import "../styles/app.css";
import fetch from "isomorphic-fetch";
import { Alert, message } from "antd";
import Header from "../components/Header";
import EventForm from "../components/EventForm";

export default class Page extends React.Component {
  static async getInitialProps({ query }) {
    const res = await fetch(`${process.env.API_URL}/api/list`);
    const { etag, syncToken, items } = await res.json();
    const event = items.find(event => event.id === query.id);

    if (!event) {
      const err = new Error();
      err.code = "ENOENT";
      throw err;
    }

    return { event };
  }

  state = {
    success: null
  };

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
    this.setState({ success });

    if (!success) {
      message.error("Failed to save");
    }
  };

  render() {
    const { event } = this.props;
    const { success } = this.state;

    return (
      <main>
        <Header />
        <section>
          <EventForm event={event} onSubmit={this.onSubmit} />
          {success === true && (
            <Alert
              closable
              message="Event Saved"
              description="Changes have been saved."
              type="success"
              showIcon
            />
          )}
        </section>
      </main>
    );
  }
}
