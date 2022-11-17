import { google } from "googleapis";
import { getAuth } from "../../../google";

const calendarId = process.env.CALENDAR_ID;

module.exports = async (req, res) => {
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

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
};
