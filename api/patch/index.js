const { google } = require("googleapis");
const { json } = require("micro");
const credentials = require("../credentials.json");

const calendarId = "m6vr4kp9epa15isbtbufi06cpk@group.calendar.google.com"; // Set to main calendar
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events"
];

module.exports = async (req, res) => {
  const auth = await google.auth.getClient({
    credentials,
    scopes: SCOPES
  });

  const cal = google.calendar({ version: "v3", auth });
  const body = await json(req);

  const resource = { ...body };

  try {
    const res = await cal.events.patch({
      calendarId,
      eventId: body.eventId,
      resource
    });

    return {
      success: true
    };
  } catch (err) {
    console.log(err);
    return {
      success: false
    };
  }
};
