import "antd/dist/antd.css";
import "../styles/app.css";
import Header from "../components/Header";
import EventForm from "../components/EventForm";

export default class Page extends React.Component {
  onSubmit = event => {
    console.log(event)
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
