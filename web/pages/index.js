// @flow
import "antd/dist/antd.css";
import "../styles/app.css";
import { Button } from "antd";
import Link from "next/link";
import Header from "../components/Header";

const Index = () => (
  <main>
    <Header />
    <section>
      <center style={{ padding: 40 }}>
        <Link href="/new">
          <Button size="large">Submit Event</Button>
        </Link>
      </center>
    </section>
  </main>
);

export default Index;
