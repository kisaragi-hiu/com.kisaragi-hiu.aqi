// Calculate the distance on a sphere between points A and B.
// A and B are given as objects of eg. {longtitude: 0, latitude: 0}
// Ported from Wikipedia https://en.wikipedia.org/wiki/Geographical_distance
function distance(a, b) {
  // Convert degrees to radians.
  // Longtitudes and Latitudes are given in degrees, but this
  // formula works with radians.
  let lon1 = (a.longtitude * 2 * Math.PI) / 360;
  let lon2 = (b.longtitude * 2 * Math.PI) / 360;
  let lat1 = (a.latitude * 2 * Math.PI) / 360;
  let lat2 = (b.latitude * 2 * Math.PI) / 360;
  // In KM
  let radius = 6371.009;
  let Δλ = lon1 - lon2;
  let Δσ = Math.acos(
    Math.sin(lat1) * Math.sin(lat2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(Δλ)
  );
  return radius * Δσ;
}

navigator.geolocation.getCurrentPosition((position) => {
  let here = position.coords;
  coords.sort(function (a, b) {
    distance(a, here) < distance(b, here);
  });
  console.log(coords);
});
