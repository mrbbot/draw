<template>
  <FullHeight class="player-guess">
    <div class="container is-small">
      <div class="field has-addons">
        <p class="control is-expanded">
          <!--suppress HtmlFormInputWithoutLabel -->
          <input
            class="input"
            type="text"
            placeholder="Guess"
            v-model="guess"
            @input="onChange"
            @keypress="onKeyPress"
          />
        </p>
        <p class="control">
          <a
            class="button is-dark has-background-rainbow"
            :disabled="guess === ''"
            @click="onGuess"
          >
            Guess
          </a>
        </p>
      </div>
    </div>
  </FullHeight>
</template>

<script>
import FullHeight from "../../components/FullHeight";

export default {
  name: "player-guess",
  components: { FullHeight },
  data() {
    return {
      guess: ""
    };
  },
  methods: {
    onGuess() {
      if (this.guess !== "") {
        this.$emit("guess", this.guess);
        this.guess = "";
      }
    },
    onChange(e) {
      this.guess = e.target.value;
    },
    onKeyPress(e) {
      if (e.keyCode === 13) {
        this.onGuess();
      }
    }
  }
};
</script>

<style lang="sass">
.player-guess
  .hero-body
    justify-content: center

  .field
    width: 100%
</style>
