import { parse } from "url";
import { loadEvents } from "../../../utils/server/loadEvents";

export default async function (req, res) {
  // pageToken (for pagination)
  // q (for searching)
  // timeMin, timeMax for date range (use when querying via month?)
  // singleEvents: true (the remove recurrence field)
  // format: 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z
  const { deleted, single } = parse(req.url, true).query;

  const items = await loadEvents({
    singleEvents: single === "true",
    showDeleted: deleted === "true",
  });

  return res.json({ items });
}
