<script lang="ts">
  import {
    govTimestampToISO8601,
    govTimestampToFullDisplay,
    govTimestampToShortDisplay,
  } from "../govtimestamp";

  export let timestamp: string;

  $: datetime = govTimestampToISO8601(timestamp);
  $: title = govTimestampToFullDisplay(timestamp);
  $: shortDisplay = govTimestampToShortDisplay(timestamp);
</script>

<p>更新時間：<time id="updated" {datetime} {title}>{shortDisplay}</time></p>
