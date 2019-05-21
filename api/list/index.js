const { google } = require("googleapis");
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

  // pageToken (for pagination)
  // q (for searching)
  // timeMin, timeMax for date range (use when querying via month?)
  // format: 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z

  // https://developers.google.com/calendar/v3/reference/events/list
  const cal = google.calendar({ version: "v3", auth });
  const events = await cal.events.list({
    calendarId
  });

  return events.data;
};
