<script lang="ts">
  import Refresh from "@svicons/ionicons-outline/refresh.svelte";
  export let county: string;
  export let siteName: string;
</script>

<style>
  button {
    font-size: 100%;
    font-family: inherit;
    border: 0;
    padding: 0;
    background: unset;
  }
</style>

<h2 id="location">
  <span id="county">{county}</span>
  <span>/</span>
  <span id="siteName">{siteName}</span>
  <button><Refresh width="1em" /></button>
</h2>
