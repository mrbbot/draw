<template>
  <FullHeight class="player-word-choice has-text-centered">
    <div class="container is-small">
      <p>Please pick a word to draw...</p>
      <div class="buttons">
        <a v-for="word in words" :key="word" class="button" @click="$emit('select', word)">{{word}}</a>
      </div>
    </div>
  </FullHeight>
</template>

<script>
  import FullHeight from "../../components/FullHeight";

  export default {
    name: "player-word-choice",
    components: {FullHeight},
    props: {
      words: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style lang="sass">
  .player-word-choice
    .hero-body
      justify-content: center
      p
        margin-bottom: 0.5rem
      .buttons
        justify-content: center
</style>
