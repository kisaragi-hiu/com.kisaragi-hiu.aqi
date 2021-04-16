"use strict";

import {
  govTimestampToISO8601,
  govTimestampToFullDisplay,
  govTimestampToShortDisplay,
} from "./govtimestamp";

// Make `element` visible
function show(element) {
  element.style.opacity = 1;
}

function renderUpdated(timestamp) {
  let updated = document.getElementById("updated");
  updated.setAttribute("datetime", govTimestampToISO8601(timestamp));
  updated.setAttribute("title", govTimestampToFullDisplay(timestamp));
  updated.innerText = govTimestampToShortDisplay(timestamp);
}

function createStation(station) {
  let tmp = document.createElement("div");
  tmp.innerHTML = `
<li>
  <a class="station" href="#" onclick="refresh({station:'${station.SiteName}'})">
<div>
    <span title="測站">${station.County}/${station.SiteName}</span>
    <span title="AQI">${station.AQI}</span>
    <span title="PM10 (μg/m³)">${station["PM2.5"]}</span>
    <span title="PM2.5 (μg/m³)">${station["PM10"]}</span>
</div>
  </a>
</li>
`.trim();
  return tmp.firstChild;
}

function renderStationList(aqi_parsed) {
  let station_list = document.getElementById("station-list-ul");
  // Only insert on first run
  if (station_list.childElementCount == 0) {
    for (let station of aqi_parsed.records) {
      station_list.appendChild(createStation(station));
    }
  }
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
  // Clear the table
  // TODO: populate with data instead, keep keys in HTML
  table.innerText = "";
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

function renderMainView(site, aqi_parsed) {
  // Render the main view for SITE.
  // AQI_PARSED is used for extra info.
  renderUpdated(site["PublishTime"]);
  renderData(site);
  renderLocation(site["County"], site["SiteName"]);
  renderStationList(aqi_parsed);
  document.getElementById("refresh").onclick = "refresh({use_cache:false});";
  show(document.getElementsByTagName("body")[0]);
}

function renderFailedView() {
  document.getElementsByTagName("body")[0].innerText = "Data is invalid";
}

function render(aqi_parsed, station) {
  let current_site = aqi_parsed.records.filter(
    (site) => site.SiteName == station
  )[0];
  if (current_site) {
    renderMainView(current_site, aqi_parsed);
  } else {
    renderFailedView();
  }
}

// Caching
let localStorage = window.localStorage;
let response_cache = localStorage.getItem("response_cache");
// getItem returns null if it doesn't exist, and JSON.parse(null) -> null
// This is "strongly discouraged", but as its value is always an ISO
// 8601 timestamp I think it's reliable enough.
let last_retrieved = new Date(localStorage.getItem("last_retrieved"));

function shouldUseCache(cached_date, access_date) {
  // Should the cache be used?
  // Goals:
  // cache 18:05, access 19:05: no cache
  // cache 18:05, access 19:00: no cache
  // cache 18:30, access 19:05: no cache
  // cache 04/01 18:30, access 04/02 18:40: no cache
  // cache 18:05, access 18:55: use cache
  // cache 18:30, access 18:55: use cache
  return (
    // Utilize the fact that it updates each hour
    access_date.getUTCHours() == cached_date?.getUTCHours() &&
    access_date.getTime() - cached_date?.getTime() < 3600000
  );
}

function refresh({ station, use_cache = true } = {}) {
  let current_station = station || localStorage.getItem("station") || "楠梓";
  localStorage.setItem("station", current_station);
  // Retrieve from cache if we should
  if (use_cache && shouldUseCache(last_retrieved, new Date())) {
    render(JSON.parse(localStorage.getItem("response_cache")), current_station);
  } else {
    // Make a request otherwise
    let oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function () {
      let aqi_parsed = JSON.parse(this.responseText);
      // Save into cache
      // Allow for invalidation later
      localStorage.setItem("version", "0");
      localStorage.setItem("response_cache", this.responseText);
      localStorage.setItem(
        "last_retrieved",
        govTimestampToISO8601(aqi_parsed.records[0].PublishTime)
      );
      render(aqi_parsed, current_station);
    });
    // oReq.addEventListener("error", function () {
    // Switch to a failed view
    // });
    oReq.open(
      "GET",
      "https://data.epa.gov.tw/api/v1/aqx_p_432?limit=1000&api_key=a7e5a2b7-4e2a-4fd2-8ec8-db5e4dcfe72b"
    );
    oReq.send();
  }
}

refresh();
