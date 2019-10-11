// @flow
import "antd/dist/antd.css";
import "../styles/app.css";
import Router from "next/router";
import Modal from "react-responsive-modal";
import { Base64 } from "js-base64";

import Header from "../components/Header";
import EventEdit from "../components/EventEdit";

const Edit = ({ event }) => {
  return (
    <main>
      <Header />
      <section>
        <Modal
          open={typeof window !== "undefined" && !!event}
          classNames={{
            overlay: "push-overlay",
            modal: "push-modal",
            closeButton: "push-closeButton"
          }}
          onClose={() => Router.push("/")}
        >
          {!!event && <EventEdit event={event} />}
        </Modal>
      </section>
    </main>
  );
};

Edit.getInitialProps = async ctx => {
  if (!ctx.req) {
    const err = new Error();
    err.code = "ENOENT";
    throw err;
  }

  // verify token
  const { token } = ctx.query;
  const [eventId, email, seed] = Base64.decode(token || "").split(":");

  if (!eventId || seed !== "$%^&") {
    ctx.res.end("Invalid token");
  }

  const res = await fetch(`${process.env.API_URL}/api/list?deleted=true`);
  const { items } = await res.json();
  const event = items.find(event => event.id === eventId);

  if (!event) {
    const err = new Error();
    err.code = "ENOENT";
    throw err;
  }

  return { event };
};

export default Edit;
