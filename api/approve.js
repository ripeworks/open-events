const { google } = require("googleapis");
const credentials = require("./credentials");

const calendarId = process.env.CALENDAR_ID;
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

async function main() {
  const auth = await google.auth.getClient({
    credentials,
    scopes: SCOPES,
  });

  const cal = google.calendar({ version: "v3", auth });
  const eventId = process.argv[2];
  if (!eventId) {
    throw new Error("Missing eventId");
  }

  const resource = {
    eventId,
    status: "confirmed",
    visibility: "public",
  };

  try {
    await cal.events.patch({
      calendarId,
      eventId,
      resource,
    });

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

main();
