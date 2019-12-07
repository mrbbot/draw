<template>
  <FullHeight class="landing">
    <div class="container is-small">
      <div class="field has-text-centered for-icon has-secondary-rainbow is-hidden-mobile">
        <FontAwesomeIcon :icon="['fad', 'paint-brush']" style="font-size: 12rem"/>
      </div>

      <div class="field">
        <div class="control">
          <!--suppress HtmlFormInputWithoutLabel -->
          <input class="input is-medium has-text-centered" type="text" placeholder="123456" v-model="gamePin">
        </div>
      </div>
      <div class="field">
        <div class="control">
          <!--suppress HtmlFormInputWithoutLabel -->
          <input class="input is-medium has-text-centered" type="text" placeholder="Name" v-model="name">
        </div>
      </div>
      <div class="field">
        <div class="control">
          <a class="button is-dark has-background-rainbow is-fullwidth" :disabled="joinDisabled" @click="joinGame">
            Join Game
          </a>
        </div>
      </div>

      <div class="is-divider is-hidden-mobile" data-content="OR"></div>

      <div class="field is-hidden-mobile">
        <div class="control">
          <router-link class="button is-fullwidth" to="/host">Create Game</router-link>
        </div>
      </div>
    </div>
    <div class="message-wrapper">
      <transition name="message">
        <div class="container is-small has-background-rainbow has-text-white" v-if="messageText" @click="messageText = ''">
          <span v-if="messageIcon" class="for-icon"><FontAwesomeIcon :icon="['fas', messageIcon]" size="lg"/></span>
          <span>{{messageText}}</span>
        </div>
      </transition>
    </div>
  </FullHeight>
</template>

<script>
  import FullHeight from "../components/FullHeight";

  export default {
    name: "landing",
    components: {FullHeight},
    data() {
      return {
        gamePin: "",
        name: "",
        messageIcon: "",
        messageText: "",
        messageTimeoutHandle: -1
      }
    },
    created() {
      this.gamePin = window.gamePin || "";
      this.name = localStorage.getItem("draw-name") || "";
      this.messageIcon = window.landingMessageIcon || "";
      this.messageText = window.landingMessageText || "";
      window.landingMessageIcon = "";
      window.landingMessageText = "";
      if(this.messageText) {
        this.messageTimeoutHandle = setTimeout(() => {
          this.messageTimeoutHandle = -1;
          this.messageText = "";
        }, 5000);
      }
    },
    beforeDestroy() {
      if(this.messageTimeoutHandle !== -1) {
        clearTimeout(this.messageTimeoutHandle);
      }
    },
    computed: {
      joinDisabled() {
        return this.gamePin.length !== 6 || isNaN(parseInt(this.gamePin)) || this.name === "";
      }
    },
    methods: {
      joinGame() {
        if (!this.joinDisabled) {
          localStorage.setItem("draw-name", this.name);
          this.$router.push(`/game/${this.gamePin}`);
        }
      }
    }
  }
</script>

<style lang="sass">
  .landing
    .field.for-icon
      margin-bottom: 2rem

    .message-wrapper
      position: fixed
      left: 0
      bottom: 0
      right: 0

      .container
        cursor: pointer
        padding: 1rem
        margin-bottom: 1rem
        border-radius: 4px
        display: flex
        flex-direction: row
        transition: opacity 0.5s, transform 0.5s

        span.for-icon
          margin-right: 0.5rem

    .message-enter,
    .message-leave-to
      opacity: 0
      transform: translateY(30px)
</style>
