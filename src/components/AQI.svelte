<script lang="ts">
  export let AQI: string;
</script>
<style>
  #aqi {
    color: var(--dark-color);
    font-size: 8rem;
    font-weight: 700;
    line-height: 1;
    margin: 0;
  }
</style>
<span title="AQI" id="aqi">{AQI}</span>
