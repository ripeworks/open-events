const { google } = require("googleapis");
const { json } = require("micro");
const credentials = require("../credentials.json");

const calendarId = "m6vr4kp9epa15isbtbufi06cpk@group.calendar.google.com"; // Set to main calendar
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events"
];

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

  // for some reason we add 4 here (timezone?)
  dateTime.setHours(Math.floor(time) + 4, time % 1 === 0 ? 0 : 30);
  return dateTime.toISOString();
};

module.exports = async (req, res) => {
  const auth = await google.auth.getClient({
    credentials,
    scopes: SCOPES
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
      [dateKey]: getDateTime({
        date: body.startDate,
        time: body.startTime,
        allDay: body.allDay
      }),
      timeZone: "America/Detroit"
    },
    end: {
      [dateKey]: getDateTime({
        date: body.endDate,
        time: body.endTime,
        allDay: body.allDay
      }),
      timeZone: "America/Detroit"
    },
    extendedProperties: {
      private: {
        OrganizerEmail: body.organizerEmail,
        VolunteerContact: body.volunteerContact
      },
      shared: {
        Organizer: body.organizerName,
        Cost: body.isFree ? "Free" : body.cost
      }
    },
    source: {
      url: body.url
    },
    transparency: "transparent"
    // recurrence: [], // TODO
    // colorId: "" // TODO
  };

  if (body.photo) {
    resource.attachments = [{ fileUrl: body.photo }];
  }

  try {
    const res = await cal.events.patch({
      calendarId,
      eventId: body.eventId,
      supportsAttachments: true,
      resource
    });

    return {
      success: true
    };
  } catch (err) {
    console.log(err);
    return {
      success: false
    };
  }
};
