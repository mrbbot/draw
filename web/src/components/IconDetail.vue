<template>
  <div class="icon-detail container">
    <div class="columns is-vcentered">
      <div class="column is-narrow has-text-centered has-text-rainbow">
        <FontAwesomeIcon :icon="['fas', icon]" style="font-size: 12rem"/>
      </div>
      <div class="column has-text-centered-mobile">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "icon-detail",
    props: {
      icon: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang="sass">
  .icon-detail
    max-width: 600px
    .title
      margin-bottom: 1rem
</style>
