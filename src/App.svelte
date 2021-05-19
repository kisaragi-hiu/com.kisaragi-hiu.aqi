<script lang="ts">
  import Updated from "./components/Updated.svelte";
  import Location from "./components/Location.svelte";
  let PublishTime = "2021/05/16 05:00:00";
  let county = "高雄市";
  let station = "楠梓";
</script>

<Location {county} {station} />
<span title="AQI" id="aqi">0</span>
<h2 id="other-title">其他監測資料</h2>
<table id="other-meta"></table>
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
