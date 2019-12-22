<template>
  <Loader v-if="loading" />
  <PlayerWaiting v-else-if="waitingMessage" :message="waitingMessage" />
  <PlayerWordChoice
    v-else-if="choosingWord"
    :words="wordsToChooseFrom"
    @select="onSelectWord"
  />
  <PlayerGuess v-else-if="guessingWord" @guess="onGuess" />
  <InteractiveDrawCanvas v-else-if="drawingWord" @draw="onDraw">
    <template slot="canvas-overlay">
      <h1 class="displayed-word title is-2">{{ wordToDraw }}</h1>
    </template>
  </InteractiveDrawCanvas>
  <div v-else></div>
</template>

<!--suppress JSUnresolvedVariable -->
<script>
import io from "socket.io-client";
import { Events, SOCKET_URI } from "../../socket/constants";
import Loader from "../../components/Loader";
import PlayerWaiting from "./PlayerWaiting";
import PlayerWordChoice from "./PlayerWordChoice";
import InteractiveDrawCanvas from "../../components/InteractiveDrawCanvas";
import PlayerGuess from "./PlayerGuess";

import { draw } from "../../socket/proto";
const {
  JoinEvent,
  PlayerRoundStartEvent,
  ScoreUpdateEvent,
  GuessEvent,
  DrawEvent
} = draw;

const State = {
  WAITING_FOR_PLAYERS: 0,
  WAITING_FOR_WORD_CHOICE: 1,
  CHOOSING_WORD: 2,
  GUESSING_WORD: 3,
  GUESSED_WORD: 4,
  DRAWING_WORD: 5
};

export default {
  name: "player-game",
  components: {
    PlayerGuess,
    InteractiveDrawCanvas,
    PlayerWordChoice,
    PlayerWaiting,
    Loader
  },
  data() {
    return {
      state: State.WAITING_FOR_PLAYERS,
      loading: true,
      name: "",
      score: 0,
      wordsToChooseFrom: [],
      wordToDraw: ""
    };
  },
  computed: {
    gamePin() {
      return this.$route.params.id;
    },
    waitingMessage() {
      if (this.state === State.WAITING_FOR_PLAYERS) {
        return "You're in!";
      } else if (this.state === State.WAITING_FOR_WORD_CHOICE) {
        return "Waiting for player to pick word...";
      } else if (this.state === State.GUESSED_WORD) {
        return "Correct!";
      }
      return "";
    },
    choosingWord() {
      return this.state === State.CHOOSING_WORD;
    },
    guessingWord() {
      return this.state === State.GUESSING_WORD;
    },
    drawingWord() {
      return this.state === State.DRAWING_WORD;
    }
  },
  created() {
    this.name = localStorage.getItem("draw-name");

    this.socket = io(SOCKET_URI);
    this.socket.on("connect", () => {
      const joinEvent = new JoinEvent();
      joinEvent.name = this.name;
      joinEvent.pin = this.gamePin;
      this.socket
        .binary(true)
        .emit(
          Events.Sent.JOIN_GAME,
          JoinEvent.encode(joinEvent).finish(),
          gameFound => {
            if (gameFound) {
              this.loading = false;
            } else {
              window.landingMessageIcon = "times";
              window.landingMessageText = "Game not found!";
              this.$router.replace("/");
            }
          }
        );
    });
    this.socket.on("disconnect", () => {
      window.landingMessageIcon = "wifi-slash";
      window.landingMessageText = "Disconnected from game!";
      this.$router.replace("/");
    });
    this.socket.on(Events.Received.ROUND_START, rawRoundStartEvent => {
      const roundStartEvent = PlayerRoundStartEvent.decode(
        new Uint8Array(rawRoundStartEvent)
      );
      // console.log(Events.Received.ROUND_START, roundStartEvent.toJSON());
      this.wordsToChooseFrom = roundStartEvent.words;
      if (roundStartEvent.uuid === this.socket.id) {
        this.state = State.CHOOSING_WORD;
        this.vibrate([200, 200]);
      } else {
        this.state = State.WAITING_FOR_WORD_CHOICE;
      }
    });
    this.socket.on(Events.Received.WORD_SELECTED, selectedWord => {
      // console.log(Events.Received.WORD_SELECTED, selectedWord);
      this.wordToDraw = selectedWord;
      if (this.state === State.CHOOSING_WORD) {
        this.state = State.DRAWING_WORD;
      } else {
        this.state = State.GUESSING_WORD;
        this.vibrate(200);
      }
    });
    this.socket.on(Events.Received.SCORE_UPDATE, rawScoreUpdateEvent => {
      const scoreUpdateEvent = ScoreUpdateEvent.decode(
        new Uint8Array(rawScoreUpdateEvent)
      );
      // console.log(Events.Received.SCORE_UPDATE, scoreUpdateEvent.toJSON());
      if (scoreUpdateEvent.uuid === this.socket.id) {
        this.score += scoreUpdateEvent.scoreChange;
      }
    });
    this.socket.on(Events.Received.COMPLETE, () => {
      // console.log(Events.Received.COMPLETE);
      window.landingMessageIcon = "check";
      window.landingMessageText = "Game finished!";
      this.$router.replace("/");
    });
  },
  beforeDestroy() {
    this.socket.disconnect();
  },
  methods: {
    onSelectWord(word) {
      // console.log("onSelectWord", word);
      this.socket.emit(Events.Sent.SELECT_WORD, word);
    },
    onGuess(guess) {
      // console.log("onGuess", guess);
      const guessEvent = new GuessEvent();
      guessEvent.uuid = this.socket.id;
      guessEvent.guess = guess;
      if (guess === this.wordToDraw) {
        this.state = State.GUESSED_WORD;
      }
      this.socket
        .binary(true)
        .emit(Events.Sent.GUESS, GuessEvent.encode(guessEvent).finish());
    },
    onDraw(drawEvent) {
      // console.log("onDraw", drawEvent.toObject());
      this.socket
        .binary(true)
        .emit(Events.Sent.DRAW, DrawEvent.encode(drawEvent).finish());
    },
    vibrate(pattern) {
      if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    }
  }
};
</script>

<style lang="sass">
.button.for-fullscreen
  display: inline-block
  margin-top: 1rem
</style>
