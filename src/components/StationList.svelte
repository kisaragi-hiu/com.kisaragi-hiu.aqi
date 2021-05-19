<script lang="ts">
  import type { Site } from "../Site";
  export let sites: Site[];

  /* import { createEventDispatcher } from "svelte";
   * const dispatch = createEventDispatcher();
   */
  function switchSite(site: Site) {
    /* dispatch("switchSite", { site: site }); */
    console.log(site);
  }
</script>
<style>
  ul {
    list-style: none;
    padding: 0 1rem;
    border-radius: 4px;
    box-shadow: 0 0 2rem #0000002b;
    border: solid 1px #0000002b;
  }
  /* Station list separators: border-bottom on all elements except last */
  ul li:nth-last-child(1) .item {
    border: unset;
  }
  li.item {
    font-weight: 700;
    color: var(--dark-color);
  }
  a.item {
    color: inherit;
    border-bottom: solid 1px #0000002b;
    text-decoration: none;
  }
  .item {
    display: flex;
    justify-content: space-between;
    line-height: 2.4;
    margin: 0;
  }
  .item :nth-child(2),
  .item :nth-child(3),
  .item :nth-child(4) {
    text-align: center;
  }
  .item :nth-child(3),
  .item :nth-child(4) {
    display: none;
  }
  @media (min-width: 650px) {
    #station-list {
      grid-column: 1/3;
    }
    .item :nth-child(1) {
      width: 60%;
    }
    .item :nth-child(2),
    .item :nth-child(3),
    .item :nth-child(4) {
      width: 3rem;
    }
    .item :nth-child(3),
    .item :nth-child(4) {
      display: unset;
    }
  }
</style>

<div id="station-list">
  <ul id="station-list-ul">
    <li class="item">
      <span>測站</span><span>AQI</span><span>PM2.5</span><span>PM10</span>
    </li>
    {#each sites as site, _i}
    <li>
      <a on:click="{() => {switchSite(site)}}" class="item" href="#">
        <span title="測站">{site.County}/{site.SiteName}</span>
        <span title="AQI">{site.AQI}</span>
        <span title="PM2.5 (μg/m³)">{site["PM2.5"]}</span>
        <span title="PM10 (μg/m³)">{site["PM10"]}</span>
      </a>
    </li>
    {/each}
  </ul>
</div>
