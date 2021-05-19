<script lang="ts">
  import type Site from "../site.ts";
  export let site: Site;
  let PM2_5 = site["PM2.5"] + "μg/m³";
  let PM10 = site["PM10"] + "μg/m³";
  let CO = site["CO"] + "ppm";
  let NO = site["NO"] + "ppb";
  let NO2 = site["NO2"] + "ppb";
  let SO2 = site["SO2"] + "ppb";
  let O3 = site["O3"] + "ppb";
  let NOx = site["NOx"] + "ppb";
  let WindSpeed = site["WindSpeed"] + "m/s";
  let WindDirec = site["WindDirec"] + "°";
</script>

<h2 id="other-title">其他監測資料</h2>
<table id="other-meta">
  <tbody>
    <tr>
      <td>PM2.5</td>
      <td>{PM2_5}</td>
    </tr>
    <tr>
      <td>PM10</td>
      <td>{PM10}</td>
    </tr>
    <tr>
      <td>一氧化碳</td>
      <td>{CO}</td>
    </tr>
    <tr>
      <td>一氧化氮</td>
      <td>{NO}</td>
    </tr>
    <tr>
      <td>二氧化氮</td>
      <td>{NO2}</td>
    </tr>
    <tr>
      <td>二氧化硫</td>
      <td>{SO2}</td>
    </tr>
    <tr>
      <td>臭氧</td>
      <td>{O3}</td>
    </tr>
    <tr>
      <td>氮氧化物</td>
      <td>{NOx}</td>
    </tr>
    <tr>
      <td>風速</td>
      <td>{WindSpeed}</td>
    </tr>
    <tr>
      <td>風向</td>
      <td>{WindDirec}</td>
    </tr>
  </tbody>
</table>
