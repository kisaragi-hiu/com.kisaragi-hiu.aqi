"use strict";

// Make `element` visible
function show(element) {
  element.style.opacity = 1;
}

function govTimestampToISO8601(timestamp) {
  // We can expect the format to stay constant, I think.
  return (
    timestamp
      // "2021/04/13" -> "2021-04-13"
      .replace(/\//g, "-")
      // Use "T" as date/time separator
      .replace(" ", "T")
      // Explicit timezone
      .concat("+08:00")
  );
}

function renderUpdated(timestamp) {
  let updated = document.getElementById("updated");
  updated.setAttribute("datetime", govTimestampToISO8601(timestamp));
  updated.setAttribute("title", govTimestampToISO8601(timestamp));
  updated.innerText = timestamp;
}

// Map from key to display name
// Key: key in API response
// Value: array of [Display, Unit]
const extra_fields = {
  "PM2.5": ["PM2.5", "μg/m³"],
  PM10: ["PM10", "μg/m³"],
  CO: ["一氧化碳", "ppm"],
  NO: ["一氧化氮", "ppb"],
  NO2: ["二氧化氮", "ppb"],
  SO2: ["二氧化硫", "ppb"],
  O3: ["臭氧", "ppb"],
  NOx: ["氮氧化物", "ppb"],
  WindSpeed: ["風速", "m/s"],
  WindDirec: ["風向", "°"],
};

function renderData(site) {
  let table = document.getElementById("other-meta");
  let main_display = document.getElementById("aqi");
  main_display.innerText = site.AQI;
  for (const key in extra_fields) {
    let row = table.insertRow(-1);
    // Insert the field's display name
    row
      .insertCell(-1)
      .appendChild(document.createTextNode(extra_fields[key][0]));
    // Insert the field's value plus its unit
    row
      .insertCell(-1)
      .appendChild(document.createTextNode(site[key] + extra_fields[key][1]));
  }
}

function renderLocation(county, sitename) {
  document.getElementById("county").innerText = county;
  document.getElementById("station").innerText = sitename;
}

function renderMainView(site) {
  renderUpdated(site["PublishTime"]);
  renderData(site);
  renderLocation(site["County"], site["SiteName"]);
  show(document.getElementsByTagName("body")[0]);
}

let current_station = "楠梓";

function refresh() {
  let oReq = new XMLHttpRequest();
  oReq.addEventListener("load", function () {
    let aqi_parsed = JSON.parse(this.responseText);
    let current_site = aqi_parsed.records.filter(
      (site) => site.SiteName == current_station
    )[0];
    renderMainView(current_site);
  });
  // oReq.addEventListener("error", function () {
  // Switch to a failed view
  // });
  oReq.open(
    "GET",
    "https://data.epa.gov.tw/api/v1/aqx_p_432?limit=1000&api_key=9be7b239-557b-4c10-9775-78cadfc555e9&format=json"
  );
  oReq.send();
}

refresh();
