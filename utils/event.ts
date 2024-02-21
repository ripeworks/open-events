export function getPhotoUrl(url: string) {
  const urlParts = url.split("/");
  const id = urlParts[urlParts.length - 2];

  return `/api/photo/${id}`;
  // return `http://drive.google.com/uc?export=view&id=${id}`;
}

export function sortEvents(a: any, b: any) {
  return (
    new Date(a.start.dateTime || a.start.date).getTime() -
    new Date(b.start.dateTime || b.start.date).getTime()
  );
}

export function sortEventsDescending(a: any, b: any) {
  return (
    new Date(b.start.dateTime || b.start.date).getTime() -
    new Date(a.start.dateTime || a.start.date).getTime()
  );
}

export function getVolunteerText(description: string, full = false) {
  const [text, volunteer = ""] =
    description.match(/Interested in being a volunteer\? Contact (.*)/) || [];

  return full ? text : volunteer;
}
