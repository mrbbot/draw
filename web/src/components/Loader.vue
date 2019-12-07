<template>
  <FullHeight>
    <div class="has-secondary-rainbow is-loader">
      <FontAwesomeIcon :icon="['fad', 'sync-alt']" style="font-size: 12rem" spin/>
    </div>
  </FullHeight>
</template>
<script>
  import FullHeight from "./FullHeight";

  export default {
    name: "loader",
    components: {FullHeight}
  }
</script>

<style lang="sass">
  .is-loader
    width: 100%
    text-align: center
</style>
