// Calculate the distance on Earth between points A and B, as kilometers.
//
// A and B are given as objects of eg. {Longitude: 0, Latitude: 0}.
// This allows records from the API to be compared directly. (Note the
// keys are capitalized.)
//
// Ported from Wikipedia https://en.wikipedia.org/wiki/Geographical_distance
function distance(a, b) {
  // Convert degrees to radians.
  // Longitude and Latitudes are given in degrees, but this
  // formula works with radians.
  let lon1 = (Number(a.longitude) * 2 * Math.PI) / 360;
  let lon2 = (Number(b.longitude) * 2 * Math.PI) / 360;
  let lat1 = (Number(a.latitude) * 2 * Math.PI) / 360;
  let lat2 = (Number(b.latitude) * 2 * Math.PI) / 360;
  // In KM
  let radius = 6371.009;
  let Δλ = lon1 - lon2;
  let Δσ = Math.acos(
    Math.sin(lat1) * Math.sin(lat2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(Δλ)
  );
  return radius * Δσ;
}

// navigator.geolocation.getCurrentPosition((position) => {
//   let here = {
//     Longitude: position.coords.longitude,
//     Latitude: position.coords.latitude,
//   };
// });

export { distance };
