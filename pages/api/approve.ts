import { google } from "googleapis";
import { getAuth } from "../../google";

const calendarId = process.env.CALENDAR_ID;

async function main() {
  const auth = await getAuth();

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
      requestBody: resource,
    });

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

main();
