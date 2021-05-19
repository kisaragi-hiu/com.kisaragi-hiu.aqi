<script lang="ts">
  import Updated from "./components/Updated.svelte";
  import Location from "./components/Location.svelte";
  import OtherData from "./components/OtherData.svelte";
  let PublishTime = "2021/05/16 05:00:00";
  let site = {
    SiteName: "基隆",
    County: "基隆市",
    AQI: "47",
    Pollutant: "",
    Status: "良好",
    SO2: "1.1",
    CO: "0.24",
    CO_8hr: "0.3",
    O3: "6.5",
    O3_8hr: "14",
    PM10: "26",
    "PM2.5": "11",
    NO2: "9.5",
    NOx: "10.2",
    NO: "0.8",
    WindSpeed: "0.8",
    WindDirec: "267",
    PublishTime: "2021/05/20 02:00:00",
    "PM2.5_AVG": "15",
    PM10_AVG: "30",
    SO2_AVG: "3",
    Longitude: "121.760056",
    Latitude: "25.129167",
    SiteId: "1",
    ImportDate: "2021-05-20 03:02:08.050000",
  };
  $: county = site["County"];
  $: station = site["SiteName"];
</script>

<Location {county} {station} />
<span title="AQI" id="aqi">0</span>
<OtherData {site} />
<footer>
  <p>資料來自<a href="https://data.gov.tw/">政府資料開放平臺</a>。</p>
  <p>
    <a href="https://github.com/kisaragi-hiu/com.kisaragi-hiu.aqi">原始碼</a
    >以MIT條款釋出。
  </p>
  <Updated timestamp="{PublishTime}" />
</footer>
<div id="station-list">
  <ul id="station-list-ul">
    <li class="item">
      <span>測站</span><span>AQI</span><span>PM2.5</span><span>PM10</span>
    </li>
  </ul>
</div>
