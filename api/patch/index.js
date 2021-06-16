const { google } = require("googleapis");
const { json, send } = require("micro");
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);

const calendarId = process.env.CALENDAR_ID;
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

module.exports = async (req, res) => {
  const auth = await google.auth.getClient({
    credentials,
    scopes: SCOPES,
  });

  const cal = google.calendar({ version: "v3", auth });
  const body = await json(req);

  const resource = { ...body };

  try {
    await cal.events.patch({
      calendarId,
      eventId: body.eventId,
      resource,
    });

    send(res, 200, { success: true });
  } catch (err) {
    console.log(err);
    send(res, 200, { success: false });
  }
};
