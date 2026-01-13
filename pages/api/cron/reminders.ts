import { NextApiRequest, NextApiResponse } from "next";
import { loadEvents } from "../../../utils/server/loadEvents";
import { Resend } from "resend";

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
  const resend = new Resend(process.env.RESEND_KEY);
  await resend.emails.send({
    from: `Northport Omena Calendar <info@${process.env.MAILGUN_DOMAIN}>`,
    to: process.env.DAILY_SUMMARY_EMAILS,
    subject: "Daily Event Summary - Northport Omena Calendar",
    template: {
      id: "northport-omena-calendar-daily-summary",
      variables: {
        count: pending.length,
        moderateUrl: `${process.env.APP_URL}/moderate`,
      },
    },
  });

  return res.status(201).end();
}
