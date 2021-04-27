export const getPhotoUrl = (url) => {
  const urlParts = url.split("/");
  const id = urlParts[urlParts.length - 2];

  return `/api/photo/${id}`;
  // return `http://drive.google.com/uc?export=view&id=${id}`;
};

export const sortEvents = (a, b) => {
  return (
    new Date(a.start.dateTime || a.start.date) -
    new Date(b.start.dateTime || b.start.date)
  );
};

export const sortEventsDesceding = (a, b) => {
  return (
    new Date(b.start.dateTime || b.start.date) -
    new Date(a.start.dateTime || a.start.date)
  );
};

export const getVolunteerText = (description, full = false) => {
  const [text, volunteer = ""] =
    description.match(/Interested in being a volunteer\? Contact (.*)/) || [];

  return full ? text : volunteer;
};

export const geocodeByAddress = (address) => {
  const geocoder = new window.google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status !== window.google.maps.GeocoderStatus.OK) {
        reject(
          new Error(
            `Geocoding query for '${address}' failed - response status: ${status}`
          )
        );

        return;
      }

      resolve(results);
    });
  });
};

export const getLatLng = ([result]) => {
  const { geometry } = result;
  return {
    lat: geometry.location.lat(),
    lng: geometry.location.lng(),
  };
};
