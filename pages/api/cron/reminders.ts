import { NextApiRequest, NextApiResponse } from "next";
import { loadEvents } from "../../../utils/server/loadEvents";
import formData from "form-data";
import Mailgun from "mailgun.js";

const mg = new Mailgun(formData);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const events = await loadEvents({ showDeleted: true });
  const minDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

  const pending = events.filter(
    (event) =>
      event.visibility === "public" &&
      event.status === "cancelled" &&
      new Date(event.created) >= minDate
  );

  if (pending.length < 1) {
    return res.status(201).end();
  }

  // send email
  const mailgun = mg.client({
    username: "api",
    key: process.env.MAILGUN_KEY,
  });
  await mailgun.messages.create(process.env.MAILGUN_DOMAIN, {
    from: `Northport Omena Calendar <info@${process.env.MAILGUN_DOMAIN}>`,
    to: "mike@ripeworks.com",
    subject: "Daily Event Summary - Northport Omena Calendar",
    template: "daily_summary",
    "h:X-Mailgun-Variables": JSON.stringify({
      count: pending.length,
      moderate_url: `${process.env.APP_URL}/moderate`,
    }),
  });

  return res.status(201).end();
}
