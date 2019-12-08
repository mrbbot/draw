<template>
  <div class="lobby">
    <section class="hero is-light has-background-rainbow has-elevation has-text-centered">
      <div class="hero-body">
        <div class="game-pin has-elevation"><span class="base">{{host}}/</span><span class="pin">{{gamePin}}</span>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns is-multiline has-text-centered">
          <div v-for="player in players" :key="player.uuid" class="column is-4">
            <h2 class="subtitle is-4">{{player.name}}</h2>
          </div>
        </div>
      </div>
    </section>
    <div class="host-options has-elevation">
      <!--suppress HtmlFormInputWithoutLabel -->
      <input step="1" min="1" max="10" v-model="rawRounds" type="range">
      <span style="width: 71px">{{rounds}} round{{rounds === 1 ? '' : 's'}}</span>
      <!--suppress HtmlFormInputWithoutLabel -->
      <input step="5" min="5" max="90" v-model="rawRoundLength" type="range">
      <span>{{roundLength}} second rounds</span>
      <span class="spacer"/>
      <a class="button is-dark has-background-rainbow" :disabled="startDisabled" @click="startGame">Start Game</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "host-lobby",
    data() {
      return {
        rawRounds: "3",
        rawRoundLength: "60"
      }
    },
    props: {
      gamePin: {
        type: String,
        required: true
      },
      players: {
        type: Array,
        required: true
      }
    },
    computed: {
      host() {
        return window.location.host;
      },
      rounds() {
        return parseInt(this.rawRounds);
      },
      roundLength() {
        return parseInt(this.rawRoundLength);
      },
      startDisabled() {
        return this.players.length < 2;
      }
    },
    methods: {
      startGame() {
        if (!this.startDisabled) {
          this.$emit("start", {
            totalRounds: this.rounds,
            roundLength: this.roundLength
          });
        }
      }
    }
  }
</script>

<style lang="sass">
  .lobby
    .hero
      .game-pin
        display: inline-block
        background-color: white
        font-size: 3rem
        font-weight: bold
        padding: 1rem 2rem

        .base
          opacity: 0.6

    .host-options
      position: fixed
      left: 0
      bottom: 0
      right: 0
      display: flex
      flex-direction: row
      align-items: center

      .spacer
        flex-grow: 1

      > *
        margin: 0.5rem

      input
        margin-left: 1rem
</style>
