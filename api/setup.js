const { google } = require("googleapis");
const credentials = require("./credentials.json");

const calendarId = "primary"; // Set to main calendar
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


  const calendars = await cal.calendarList.list();
  return calendars;
};
