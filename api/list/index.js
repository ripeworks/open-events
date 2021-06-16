const { google } = require("googleapis");
const { parse } = require("url");
const { send } = require("micro");
const credentials = require("../credentials");

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

  // pageToken (for pagination)
  // q (for searching)
  // timeMin, timeMax for date range (use when querying via month?)
  // singleEvents: true (the remove recurrence field)
  // format: 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z
  const { deleted, single } = parse(req.url, true).query;

  // https://developers.google.com/calendar/v3/reference/events/list
  const cal = google.calendar({ version: "v3", auth });
  const params = {
    calendarId,
    maxResults: 2500,
    singleEvents: single === "true",
    showDeleted: deleted === "true",
  };

  // only show next 6 months of events
  if (single === "true") {
    const timeMax = new Date();
    timeMax.setMonth(timeMax.getMonth() + 6);
    params.timeMax = timeMax.toISOString();
  }

  const fetchPage = async (pageToken = undefined) => {
    const events = await cal.events.list({ ...params, pageToken });
    if (events.data.nextPageToken) {
      return [
        ...events.data.items,
        ...(await fetchPage(events.data.nextPageToken)),
      ];
    } else {
      return events.data.items;
    }
  };
  const items = await fetchPage();

  send(res, 200, { items });
};
