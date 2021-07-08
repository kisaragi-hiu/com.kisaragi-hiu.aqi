"use strict";

import {
  govTimestampToISO8601,
  govTimestampToFullDisplay,
  govTimestampToShortDisplay,
} from "./govtimestamp";

import { distance } from "./location";

function renderLocateBtn(aqi_parsed) {
  // Make a copy
  let stations = aqi_parsed.records.slice();
  document.getElementById("locate").addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let here = {
        Longitude: position.coords.longitude,
        Latitude: position.coords.latitude,
      };
      let closest = stations.sort((a, b) => {
        return distance(a, here) > distance(b, here);
      })[0];
      refresh({ station: closest.SiteName });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function renderUpdated(timestamp) {
  let updated = document.getElementById("updated");
  updated.setAttribute("datetime", govTimestampToISO8601(timestamp));
  updated.setAttribute("title", govTimestampToFullDisplay(timestamp));
  updated.innerText = govTimestampToShortDisplay(timestamp);
}

// Doing this to get a local scope.
//
// This is an Immediately Invoked Function Expression. I can't just
// use a block scope because there'd be no way to get the function
// itself outside.
//
// You can say this should be in its own class. Or its own module, even.
const renderStationList = (() => {
  // * Object state: stations
  let stations = null;
  function sortStations(field, asc) {
    // Sort `stations` based on station[field].
    // If `asc`, compare with >, otherwise with <.
    //
    // Special case: I hard code some fields to be numeric.
    // The type information in aqi_parsed.fields[index].type is
    // inaccurate; it's "text" for everything.
    let numeric = false;
    // Do this check once outside the comparison function
    if (["AQI", "PM2.5", "PM10", "Longitude", "Latitude"].includes(field)) {
      numeric = true;
    }
    stations = stations.sort((a, b) => {
      let a_val = a[field];
      let b_val = b[field];
      if (numeric) {
        a_val = Number(a_val);
        b_val = Number(b_val);
      }
      if (asc) {
        return a_val > b_val;
      } else {
        return a_val < b_val;
      }
    });
  }

  // * Creating the buttons in the head row
  let head_row = document
    .getElementById("station-list")
    .getElementsByTagName("thead")[0]
    .getElementsByTagName("tr")[0];
  function renderTableHead() {
    function createBtn({
      innerText,
      field,
      title,
      className,
      asc = true,
    } = {}) {
      let th = document.createElement("th");
      let btn = document.createElement("button");
      if (title) {
        btn.title = title;
      }
      if (className) {
        btn.className = className;
      }
      btn.innerText = innerText;
      btn.addEventListener("click", () => {
        asc = !asc;
        for (let other of head_row.getElementsByTagName("button")) {
          other.classList.remove("sorting", "asc", "desc");
        }
        sortStations(field, asc);
        renderStations(stations, true);
        btn.classList.add("sorting", asc ? "asc" : "desc");
      });
      th.appendChild(btn);
      return th;
    }
    const sortStationBtnTh = createBtn({
      innerText: "測站",
      field: "Latitude",
      title: "依緯度排序",
      className: "sorting desc",
      asc: false,
    });
    const sortAQIBtnTh = createBtn({
      innerText: "AQI",
      field: "AQI",
      title: "依目前AQI排序",
    });
    const sort2_5BtnTh = createBtn({
      innerText: "PM2.5",
      field: "PM2.5",
      title: "依PM2.5懸浮微粒量排序",
    });
    const sort10BtnTh = createBtn({
      innerText: "PM10",
      field: "PM10",
      title: "依PM10懸浮微粒量排序",
    });
    head_row.appendChild(sortStationBtnTh);
    head_row.appendChild(sortAQIBtnTh);
    head_row.appendChild(sort2_5BtnTh);
    head_row.appendChild(sort10BtnTh);
  }
  renderTableHead();

  // * Rendering out to the tbody
  let tbody = document
    .getElementById("station-list")
    .getElementsByTagName("tbody")[0];
  function clearRenderedStations() {
    tbody.innerHTML = "";
  }
  function renderStations(stations, clear) {
    if (clear) {
      clearRenderedStations();
    }
    for (let station of stations) {
      let row = document.createElement("tr");
      row.innerHTML = `
<th class="station" title="測站"><button>${station.County}/${station.SiteName}</button></th>
<td class="aqi" title="AQI">${station.AQI}</td>
<td class="pm2-5" title="PM2.5 (μg/m³)">${station["PM2.5"]}</td>
<td class="pm10" title="PM10 (μg/m³)">${station["PM10"]}</td>
`.trim();
      let stationBtn = row.getElementsByTagName("button")[0];
      stationBtn.addEventListener("click", () => {
        refresh({ station: station.SiteName });
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      attachStatusClass(
        station.Status,
        row.getElementsByClassName("station")[0]
      );
      // li.appendChild(a);
      tbody.appendChild(row);
    }
  }
  // function makeTestStations() {
  //   return [
  //     "良好",
  //     "普通",
  //     "對敏感族群不健康",
  //     "對所有族群不健康",
  //     "非常不健康",
  //     "危害",
  //   ].map((testStatus) => ({
  //     County: "Test",
  //     Status: testStatus,
  //     SiteName: testStatus,
  //     AQI: 10,
  //     "PM2.5": 10,
  //     PM10: 10,
  //   }));
  // }

  // * The init code that gets run the first time it's rendered
  return (aqi_parsed) => {
    stations = aqi_parsed.records;
    // stations = [...makeTestStations(), ...stations];
    // Only insert on first run
    sortStations("Latitude", false);
    if (tbody.childElementCount == 0) {
      renderStations(stations);
    }
  };
})();
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

function renderAQI(site) {
  let aqi = document.getElementById("aqi");
  attachStatusClass(site.Status, aqi);
  aqi.innerText = site.AQI;
  document.getElementById("county").innerText = site.County;
  document.getElementById("station").innerText = site.SiteName;
}

function renderMetas(site) {
  let table = document.getElementById("other-meta");
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

// Change ELEMENT based on STATUS.
// ELEMENT is the main body by default.
function attachStatusClass(status, element) {
  // TODO: calculate from numeric value ourselves
  let class_map = {
    良好: "good",
    普通: "okay",
    對敏感族群不健康: "meh",
    對所有族群不健康: "bad",
    非常不健康: "verybad",
    危害: "dangerous",
  };
  element.classList.remove(...Object.values(class_map), "status");
  element.classList.add(class_map[status], "status");
}

function renderMainView(site, aqi_parsed) {
  // Render the main view for SITE.
  // AQI_PARSED is used for extra info.
  let body = document.getElementsByTagName("body")[0];
  renderLocateBtn(aqi_parsed);
  renderUpdated(site["PublishTime"]);
  renderAQI(site);
  renderMetas(site);
  renderStationList(aqi_parsed);
  // attachStatusClass(site["Status"], body);
  body.classList.remove("notready");
}

function renderFailedView(station) {
  let body = document.getElementsByTagName("body")[0];
  body.innerHTML = `<div>
<p>取得資料失敗。</p>
<button id="retry">重試</button>
</div>`.trim();
  let refreshBtn = document.getElementById("retry");
  refreshBtn.addEventListener("click", () => {
    window.localStorage.clear();
    // preserve station if it's passed in
    if (station) {
      window.localStorage.setItem("station", station);
    }
    // We have to actually do a browser reload as FailedView destroys
    // the HTML and MainView relies on existing HTML. MainView doesn't
    // create nodes.
    window.location.reload();
  });
  body.classList.remove("notready");
}

function render(aqi_parsed, station) {
  // Get the site object
  let current_site = aqi_parsed.records.find(
    (site) => site.SiteName == station
  );
  // If it doesn't exist, go back to the default
  if (!current_site) {
    station = "楠梓";
    aqi_parsed.records.find((site) => site.SiteName == "楠梓");
  }
  if (current_site) {
    renderMainView(current_site, aqi_parsed);
  } else {
    renderFailedView(station);
  }
}

// Caching
let localStorage = window.localStorage;

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

function refresh({
  url = "https://data.epa.gov.tw/api/v1/aqx_p_432?limit=1000&api_key=a7e5a2b7-4e2a-4fd2-8ec8-db5e4dcfe72b",
  fallback = "https://raw.githubusercontent.com/kisaragi-hiu/aqi-mirror/main/data/latest.json",
  station,
  use_cache = true,
} = {}) {
  let current_station = station || localStorage.getItem("station") || "楠梓";
  // getItem returns null if it doesn't exist, and JSON.parse(null) -> null
  // This is "strongly discouraged", but as its value is always an ISO
  // 8601 timestamp I think it's reliable enough.
  let last_retrieved = new Date(localStorage.getItem("last_retrieved"));
  localStorage.setItem("station", current_station);
  // Retrieve from cache if we should
  if (use_cache && shouldUseCache(last_retrieved, new Date())) {
    console.log("using cache");
    try {
      let aqi_parsed = JSON.parse(localStorage.getItem("response_cache"));
      render(aqi_parsed, current_station);
    } catch (e) {
      renderFailedView(current_station);
    }
  } else {
    // Make a request otherwise
    let oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function () {
      try {
        // This errors out if the response is not JSON (eg. a 404 page)
        let aqi_parsed = JSON.parse(this.responseText);
        // This errors out if the data is not in the right shape
        // (eg. when the data is being updated and `records` is empty)
        let publishTime = aqi_parsed.records[0].PublishTime;
        // Save into cache
        // Allow for invalidation later
        localStorage.setItem("version", "0");
        localStorage.setItem("response_cache", this.responseText);
        localStorage.setItem(
          "last_retrieved",
          govTimestampToISO8601(publishTime)
        );
        render(aqi_parsed, current_station);
      } catch (e) {
        // Try again with the fallback URL
        if (fallback) {
          refresh({
            url: fallback,
            fallback: null,
            station: station,
            use_cache: use_cache,
          });
        } else {
          renderFailedView(current_station);
        }
      }
    });
    oReq.open("GET", url);
    oReq.send();
  }
}

refresh();
