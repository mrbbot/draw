<template>
  <TwoSidebars class="host-main" :middle-aspect-ratio="4/3" :middle-horizontal-padding="280"
               :middle-vertical-padding="60">
    <template slot="left">
      <h2 class="subtitle">Players</h2>
      <div class="player" v-for="player in players" :key="player.uuid"
           :class="{'is-drawer': player.currentDrawer, 'has-guessed': player.guessedWord}">
        <span class="name">{{player.name}}</span>
        <span class="score">{{player.score}}</span>
      </div>
    </template>
    <template v-slot:default="{dimensions}">
      <h1 class="displayed-word title is-2">{{displayedWord}}</h1>
      <DrawCanvas ref="canvas" :dimensions="dimensions"/>
      <!--TODO: slide/fade in overlay-->
      <div v-if="overlayShown" class="overlay">
        <div class="overlay-content">
          <slot name="overlay"/>
        </div>
      </div>
    </template>
    <template slot="right">
      <h2 class="subtitle for-round-number">Round {{currentRound}}</h2>
      <h1 class="title for-time-remaining">{{secondsRemaining}}</h1>
      <h2 class="subtitle for-time-remaining">second{{secondsRemaining === 1 ? '' : 's'}} remaining</h2>
      <h2 class="subtitle">Guesses</h2>
      <div class="guesses" ref="guesses">
        <p v-for="guess in guesses" :class="{'is-correct': guess.correct}">
          <span v-if="guess.correct">{{guess.name}} guessed the word!</span>
          <span v-else>{{guess.name}}> {{guess.guess}}</span>
        </p>
      </div>
    </template>
  </TwoSidebars>
</template>

<script>
  import TwoSidebars from "../../components/TwoSidebars";
  import DrawCanvas from "../../components/DrawCanvas";

  export default {
    name: "host-main",
    components: {DrawCanvas, TwoSidebars},
    props: {
      players: {
        type: Array,
        required: true,
      },
      displayedWord: {
        type: String,
        default: ""
      },
      currentRound: {
        type: Number,
        default: 0
      },
      secondsRemaining: {
        type: Number,
        default: 0
      },
      guesses: {
        type: Array,
        required: true,
      },
      overlayShown: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this.$watch("guesses", this.scrollGuessToBottom, {immediate: true});
    },
    methods: {
      scrollGuessToBottom() {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            this.$refs.guesses.scrollTop = this.$refs.guesses.scrollHeight;
          });
        });
      }
    }
  }
</script>

<style lang="sass">
  $sidebar-border: 1px solid #DDDDDD

  .host-main
    .sidebar
      width: 270px

      .subtitle
        margin-bottom: 1rem

      &.for-left
        .player
          width: 100%
          padding: 0.35rem
          border-top: $sidebar-border
          display: flex

          &.is-drawer
            background-color: #b5fffd

          &.has-guessed
            background-color: #A7FFA7

          .name
            flex-grow: 1
            overflow: hidden
            white-space: nowrap
            text-overflow: ellipsis

          .score
            margin-left: 0.35rem

      &.for-right
        .for-time-remaining
          width: 100%
          text-align: center

        .subtitle.for-round-number
          margin-bottom: 0

        .title.for-time-remaining
          font-size: 3.5rem
          margin: 0 0 0.5rem 0

        .subtitle.for-time-remaining
          padding: 1rem
          border-bottom: $sidebar-border

        .guesses
          padding: 0 1rem
          margin-bottom: 1rem
          width: 100%
          flex-grow: 1
          display: flex
          flex-direction: column
          overflow-y: scroll

          p
            width: 100%

            &.is-correct
              font-weight: bold
              color: #5BAF5B

    .overlay
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      background-color: rgba(0, 0, 0, 0.75)
      z-index: 50
      display: flex
      align-items: center
      justify-content: center

      .overlay-content
        padding: 2rem
</style>
