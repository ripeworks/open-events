const { google } = require('googleapis');

const calendarId = 'primary'; // Set to main calendar
const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events']

async function main() {
  const auth = await google.auth.getClient({
    keyFile: '../credentials.json',
    scopes: SCOPES
  });

  const cal = google.calendar({version: 'v3', auth});

  try {
    const res = await cal.events.insert({
      calendarId,
      resource: {
        summary: "Test Event",
        location: "208 S. Shabwasung St, Northport, MI 49670",
        description: "Test description",
        start: {
          dateTime: '2019-04-22T10:30:00-04:00',
          timeZone: 'America/Detroit'
        },
        end: {
          dateTime: '2019-04-22T11:30:00-04:00',
          timeZone: 'America/Detroit'
        }
      }
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}

main()
  .then(() => console.log("DONE"))
  .catch(err => console.log(err))

// GET

// POST
