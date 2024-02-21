export function geocodeByAddress(address: string) {
  // @ts-ignore
  const geocoder = new window.google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      // @ts-ignore
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
}

export function getLatLng([result]) {
  const { geometry } = result;
  return {
    lat: geometry.location.lat(),
    lng: geometry.location.lng(),
  };
}
