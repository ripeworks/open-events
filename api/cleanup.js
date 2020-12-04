const { google } = require("googleapis");
const credentials = require("./credentials.json");
const data = require("/Users/mkruk/Desktop/northport_omena_calendar_backup.json");

const calendarId = "m6vr4kp9epa15isbtbufi06cpk@group.calendar.google.com";
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

const keepIds = [
  "l18bqbppkuljcv6vns7pbehb28",
  "rc44mfd0ij6sqq5pbnt4uh0nac",
  "u04aqe05bt9e8ado5h9k506mag",
  "58km8oteh97mt0i4n5f1vjd6e4",
  "f4cos5n9t08hpjb5f4isn4o5hg",
  "g6uhoqchf9pnq4uiiuh8et5ovc",
  "eo46oo02io1qivplperu0713qg",
  "87prh0vj2glnkc6ep4ekcftbhs",
  "k6i4sgqm9cih6ut6uah7djfrbk",
  "sjla649sgph8qnca69dh1hriag",
  "3tm111e508jhdi9ehqn1jgd2lc",
  "g6uhoqchf9pnq4uiiuh8et5ovc",
];

async function main() {
  console.log(calendarId);
  const auth = await google.auth.getClient({
    credentials,
    scopes: SCOPES,
  });
  const cal = google.calendar({ version: "v3", auth });

  // const toDisplay = data.items.filter((event) => keepIds.includes(event.id));
  // for (const event of toDisplay) {
  //   await cal.events.patch({
  //     calendarId,
  //     eventId: event.id,
  //     resource: {
  //       status: "confirmed",
  //     },
  //   });
  // }

  const toDelete = data.items.filter(
    (event) =>
      !keepIds.includes(event.recurringEventId) && !keepIds.includes(event.id)
  );
  for (const event of toDelete) {
    try {
      await cal.events.patch({
        calendarId,
        eventId: event.id,
        resource: {
          status: "cancelled",
          visibility: "private",
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  process.exit(0);
}

main();
