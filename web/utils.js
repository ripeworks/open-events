export const getPhotoUrl = url => {
  const urlParts = url.split("/");
  const id = urlParts[urlParts.length - 2];

  return `http://drive.google.com/uc?export=view&id=${id}`;
};

export const sortEvents = (a, b) => {
  return new Date(a.start.dateTime) - new Date(b.end.dateTime);
};
