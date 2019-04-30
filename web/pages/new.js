import "antd/dist/antd.css";
import "../styles/app.css";
import Header from "../components/Header";
import EventForm from "../components/EventForm";

export default class Page extends React.Component {
  onSubmit = async event => {
    const res = await fetch("/api/create", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...event,
        photo: photo && photo[0] && photo[0].response.webViewLink
      })
    })
    const resJson = await res.json();
    console.log(resJson);
  }

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
