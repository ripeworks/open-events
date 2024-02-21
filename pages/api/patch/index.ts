import { google } from "googleapis";
import { getAuth } from "../../../google";
import { NextApiRequest, NextApiResponse } from "next";

const calendarId = process.env.CALENDAR_ID;

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "OPTIONS") return res.status(200).end();

  const auth = await getAuth();

  const cal = google.calendar({ version: "v3", auth });
  const body = req.body;

  const resource = { ...body };

  try {
    await cal.events.patch({
      calendarId,
      eventId: body.eventId,
      requestBody: resource,
    });
    await Promise.all([
      res.revalidate("/moderate"),
      res.revalidate("/moderate/all"),
      res.revalidate("/"),
      res.revalidate(`/event/${body.eventId}`),
    ]);

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
}
