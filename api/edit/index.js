const { google } = require("googleapis");
const { json, send } = require("micro");
const credentials = require("../credentials.json");

const calendarId = process.env.CALENDAR_ID;
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

const volunteerText = ({ needsVolunteers, volunteerContact }) => {
  if (!needsVolunteers) return "";

  return `Interested in being a volunteer? Contact ${volunteerContact}.`;
};

const getDateTime = ({ date, time, allDay = false }) => {
  const dateTime = new Date(date);

  if (allDay) {
    const [day] = dateTime.toISOString().split("T");
    return {
      date: day,
      dateTime: null,
    };
  }

  dateTime.setHours(Math.floor(time), time % 1 === 0 ? 0 : 30);

  return {
    dateTime: dateTime.toISOString().replace(/Z$/, ""),
    date: null,
  };
};

module.exports = async (req, res) => {
  const auth = await google.auth.getClient({
    credentials,
    scopes: SCOPES,
  });

  const cal = google.calendar({ version: "v3", auth });
  const body = await json(req);
  const dateKey = body.allDay ? "date" : "dateTime";

  const resource = {
    guestsCanInviteOthers: false,
    guestsCanSeeOtherGuests: false,
    summary: body.title,
    location: body.location.address,
    description: `${body.description}

${volunteerText(body)}`,
    start: {
      ...getDateTime({
        date: body.startDate,
        time: body.startTime,
        allDay: body.allDay,
      }),
      timeZone: "America/Detroit",
    },
    end: {
      ...getDateTime({
        date: body.endDate,
        time: body.endTime,
        allDay: body.allDay,
      }),
      timeZone: "America/Detroit",
    },
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
    source: {
      url: body.url,
    },
    transparency: "transparent",
    recurrence: body.repeats ? [body.repeats] : null,
    // colorId: "" // TODO
  };

  if (body.status) {
    resource.status = body.status;
  }

  if (body.visibility) {
    resource.visibility = body.visibility;
  }

  if (body.photo) {
    resource.attachments = [{ fileUrl: body.photo }];
  }

  try {
    await cal.events.patch({
      calendarId,
      eventId: body.eventId,
      supportsAttachments: true,
      resource,
    });

    send(res, 200, { success: true });
  } catch (err) {
    console.log(err);
    send(res, 200, { success: false });
  }
};
