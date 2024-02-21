import { google } from "googleapis";
import { getAuth } from "../../google";

const calendarId = process.env.CALENDAR_ID;

type LoadParams = {
  // show events that have been deleted/rejected
  showDeleted?: boolean;
  // remove recurrence field and display all instances of events
  singleEvents?: boolean;
};

export async function loadEvents({
  showDeleted,
  singleEvents,
}: LoadParams = {}) {
  const auth = await getAuth();

  // https://developers.google.com/calendar/v3/reference/events/list
  const cal = google.calendar({ version: "v3", auth });
  const params = {
    calendarId,
    maxResults: 2500,
    singleEvents,
    showDeleted,
  };

  if (singleEvents) {
    // only show next 6 months of events
    const timeMax = new Date();
    timeMax.setMonth(timeMax.getMonth() + 6);
    // @ts-ignore
    params.timeMax = timeMax.toISOString();
  }

  async function fetchPage(pageToken = undefined) {
    const events = await cal.events.list({ ...params, pageToken });
    if (events.data.nextPageToken) {
      return [
        ...events.data.items,
        ...(await fetchPage(events.data.nextPageToken)),
      ];
    } else {
      return events.data.items;
    }
  }

  const items = await fetchPage();

  return items;
}

export async function loadEvent(eventId: string) {
  const auth = await getAuth();
  const cal = google.calendar({ version: "v3", auth });

  const res = await cal.events.get({ eventId, calendarId });

  return res.data;
}
