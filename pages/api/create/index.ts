import {google} from "googleapis";
import { getAuth } from "../../../google";
import formData from "form-data";
import Mailgun from "mailgun.js";

const mg = new Mailgun(formData);
const calendarId = process.env.CALENDAR_ID;

const volunteerText = ({ needsVolunteers, volunteerContact }) => {
  if (!needsVolunteers) return "";

  return `Interested in being a volunteer? Contact ${volunteerContact}.`;
};

const getDateTime = ({ date, time, allDay = false }) => {
  const dateTime = new Date(date);

  if (allDay) {
    const [day] = dateTime.toISOString().split("T");
    return day;
  }

  dateTime.setHours(Math.floor(time), time % 1 === 0 ? 0 : 30);
  return dateTime.toISOString().replace(/Z$/, "");
};

export default async function(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();

  const auth = await getAuth();
  const cal = google.calendar({ version: "v3", auth });
  const body = req.body;
  const dateKey = body.allDay ? "date" : "dateTime";

  try {
    const newEvent = await cal.events.insert({
      calendarId,
      supportsAttachments: true,
      // conferenceDataVersion: 1,
      requestBody: {
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: false,
        summary: body.title,
        location: body.location ? body.location.address : "",
        description: `${body.description}

${volunteerText(body)}`,
        start: {
          [dateKey]: getDateTime({
            date: body.startDate,
            time: body.startTime,
            allDay: body.allDay,
          }),
          timeZone: "America/Detroit",
        },
        end: {
          [dateKey]: getDateTime({
            date: body.endDate,
            time: body.endTime,
            allDay: body.allDay,
          }),
          timeZone: "America/Detroit",
        },
        attachments: body.photo ? [{ fileUrl: body.photo }] : null,
        extendedProperties: {
          private: {
            OrganizerEmail: body.organizerEmail,
            VolunteerContact: body.volunteerContact,
          },
          shared: {
            Organizer: body.organizerName,
            Cost: body.isFree ? "Free" : body.cost,
            MeetingUrl: body.meetingUrl,
            MeetingPassword: body.meetingPassword,
          },
        },
        ...(body.url ? { source: { url: body.url } } : {}),
        transparency: "transparent",
        // Default state is (cancelled, public)
        status: "cancelled",
        visibility: "public",
        recurrence: body.repeats ? [body.repeats] : null,
        // colorId: "" // TODO
      },
    });

    const editToken = Buffer.from(`${newEvent.data.id}::$%^&`).toString(
      "base64"
    );
    const editUrl = `${process.env.APP_URL}/edit?token=${editToken}`;

    // send email with edit link
    if (body.organizerEmail && process.env.MAILGUN_KEY) {
      const mailgun = mg.client({
        username: "api",
        key: process.env.MAILGUN_KEY,
      });
      await mailgun.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `Northport Omena Calendar <info@${process.env.MAILGUN_DOMAIN}>`,
        to: body.organizerEmail,
        subject: "New Event Submission - Northport Omena Calendar",
        template: "new_event_submission",
        "h:X-Mailgun-Variables": JSON.stringify({
          event_name: body.title,
          edit_url: editUrl,
        }),
      });
    }

    return res.json({ id: newEvent.data.id, editUrl, success: true });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
}
