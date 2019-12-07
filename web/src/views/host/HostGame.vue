<template>
  <Loader v-if="loading"/>
  <Lobby v-else-if="waitingForPlayers" :game-pin="gamePin" :players="players" @start="startGame"/>
  <HostMain v-else ref="main" :players="players" :displayed-word="displayedWord" :current-round="roundNumber"
            :seconds-remaining="secondsRemaining"
            :guesses="guesses" :overlay-shown="overlayShown">
    <template slot="overlay">
      <div class="small-container">
        <h1 v-if="currentWord" class="title has-text-white">The word was {{currentWord}}!</h1>
        <h1 class="title has-text-white">{{currentDrawerName}} is choosing a word...</h1>
      </div>
    </template>
  </HostMain>
</template>

<script>
  import io from "socket.io-client";
  import {Events} from "../../socket/constants";
  import Lobby from "./HostLobby";
  import Loader from "../../components/Loader";
  import HostMain from "./HostMain";

  const {JoinEvent, StartGameEvent, PlayerRoundStartEvent, DrawEvent, ScoreUpdateEvent, GuessEvent} = require("../../socket/draw_pb");

  export default {
    name: "host-game",
    components: {HostMain, Loader, Lobby},
    data() {
      return {
        loading: true,
        waitingForPlayers: true,
        gamePin: "",
        players: [],
        currentDrawerUUID: "",
        currentWord: "",
        displayedWord: "",
        roundLength: 0,
        roundNumber: 0,
        secondsRemaining: 0,
        guesses: [],
        overlayShown: false,
        firstRound: true
      }
    },
    computed: {
      currentDrawerName() {
        return this.nameForUUID(this.currentDrawerUUID);
      }
    },
    created() {
      this.socket = io("http://localhost:9090");
      this.socket.on("connect", () => {
        this.socket.emit(Events.Sent.CREATE_GAME, (gamePin) => {
          this.gamePin = gamePin;
          this.loading = false;
        })
      });
      this.socket.on("disconnect", () => {
        window.landingMessageIcon = "wifi-slash";
        window.landingMessageText = "Disconnected from game!";
        this.$router.replace("/");
      });
      this.socket.on(Events.Received.PLAYER_JOINED, (rawJoinEvent) => {
        const joinEvent = JoinEvent.deserializeBinary(rawJoinEvent);
        console.log(Events.Received.PLAYER_JOINED, joinEvent.toObject());
        const newPlayers = [...this.players, {
          uuid: joinEvent.getUuid(),
          name: joinEvent.getName(),
          score: 0,
          guessedWord: false,
          currentDrawer: false
        }];
        newPlayers.sort((a, b) => a.uuid === b.uuid ? 0 : (a.uuid < b.uuid ? -1 : 1));
        this.players = newPlayers;
      });
      this.socket.on(Events.Received.PLAYER_LEFT, (disconnectingUuid) => {
        console.log(Events.Received.PLAYER_LEFT, disconnectingUuid);
        this.players = this.players.filter(player => player.uuid !== disconnectingUuid);
      });
      this.socket.on(Events.Received.ROUND_START, (rawRoundStartEvent) => {
        const roundStartEvent = PlayerRoundStartEvent.deserializeBinary(rawRoundStartEvent);
        console.log(Events.Received.ROUND_START, roundStartEvent.toObject());

        // Reset game for new round
        this.stopTimers();
        this.currentDrawerUUID = roundStartEvent.getUuid();
        this.displayedWord = this.currentWord;
        this.currentWord = "";
        this.roundLength = roundStartEvent.getRoundseconds();
        this.roundNumber = roundStartEvent.getRoundnumber();
        this.secondsRemaining = 10; // 10 seconds for selecting a word
        this.guesses = [];
        this.overlayShown = true;
        this.players = this.players.map(player => {
          player.guessedWord = false;
          player.currentDrawer = player.uuid === this.currentDrawerUUID;
          return player;
        });
        this.startTimeRemainingTimer();
      });
      this.socket.on(Events.Received.WORD_SELECTED, (selectedWord) => {
        console.log(Events.Received.WORD_SELECTED, selectedWord);
        this.$refs.main.$refs.canvas.clear();
        this.overlayShown = false;
        this.currentWord = selectedWord;
        this.displayedWord = this.maskWord(selectedWord);
        this.stopTimers();
        this.secondsRemaining = this.roundLength;
        this.startTimeRemainingTimer();
        this.startUnmaskLettersTimer();
      });
      this.socket.on(Events.Received.DRAW, (rawDrawEvent) => {
        const drawEvent = DrawEvent.deserializeBinary(rawDrawEvent);
        //console.log(Events.Received.DRAW, drawEvent.toObject());
        this.$refs.main.$refs.canvas.handleDrawEvent(drawEvent);
      });
      this.socket.on(Events.Received.GUESS, (rawGuessEvent) => {
        const guessEvent = GuessEvent.deserializeBinary(rawGuessEvent);
        console.log(Events.Received.GUESS, guessEvent.toObject());
        const uuid = guessEvent.getUuid();
        const guess = guessEvent.getGuess();
        const correct = guess === this.currentWord;
        this.guesses = [...this.guesses, {
          name: this.nameForUUID(uuid),
          guess: guess,
          correct: correct
        }];
        if (correct) {
          this.players = this.players.map(player => {
            if (player.uuid === uuid) {
              player.guessedWord = true;
            }
            return player;
          });
        }
      });
      this.socket.on(Events.Received.SCORE_UPDATE, (rawScoreUpdateEvent) => {
        const scoreUpdateEvent = ScoreUpdateEvent.deserializeBinary(rawScoreUpdateEvent);
        console.log(Events.Received.SCORE_UPDATE, scoreUpdateEvent.toObject());
        const uuid = scoreUpdateEvent.getUuid();
        const scoreChange = scoreUpdateEvent.getScorechange();
        this.players = this.players.map(player => {
          if (player.uuid === uuid) {
            player.score += scoreChange;
          }
          return player;
        });
      });
      this.socket.on(Events.Received.COMPLETE, () => {
        console.log(Events.Received.COMPLETE);
        //TODO: show top 5 players (this should be done anyways at the end of each round!) & stop timers
        alert("Complete!");
      });
    },
    beforeDestroy() {
      this.socket.disconnect();
    },
    methods: {
      startGame({totalRounds, roundLength}) {
        this.loading = true;
        this.waitingForPlayers = false;
        const startGameEvent = new StartGameEvent();
        startGameEvent.setNumberrounds(totalRounds);
        startGameEvent.setRoundseconds(roundLength);
        this.socket.binary(true).emit(Events.Sent.START_GAME, startGameEvent.serializeBinary(), () => {
          this.loading = false;
        });
      },
      startTimeRemainingTimer() {
        this.timeRemainingIntervalHandle = setInterval(() => {
          if (this.secondsRemaining > 0) {
            this.secondsRemaining--;
          }
        }, 1000);
      },
      startUnmaskLettersTimer() {
        // Try to unmask a new letter every 15 seconds
        this.unmaskLettersIntervalHandle = setInterval(() => {
          const differingCharacterIndices = [];
          for (let i = 0; i < this.displayedWord.length; i++) {
            if (this.displayedWord.charAt(i) !== this.currentWord.charAt(i)) {
              differingCharacterIndices.push(i);
            }
          }
          // Only unmask a character if it wouldn't reveal the entire word
          if (differingCharacterIndices.length >= 4) {
            const indexToChange = differingCharacterIndices[Math.floor(Math.random() * differingCharacterIndices.length)];
            let newMaskedWord = "";
            for (let i = 0; i < this.displayedWord.length; i++) {
              newMaskedWord += indexToChange === i ? this.currentWord.charAt(i) : this.displayedWord.charAt(i);
            }
            this.displayedWord = newMaskedWord;
          }
        }, 15000);
      },
      stopTimers() {
        if (this.timeRemainingIntervalHandle) {
          clearInterval(this.timeRemainingIntervalHandle);
          this.timeRemainingIntervalHandle = 0;
        }
        if (this.unmaskLettersIntervalHandle) {
          clearInterval(this.unmaskLettersIntervalHandle);
          this.unmaskLettersIntervalHandle = 0;
        }
      },
      nameForUUID(uuid) {
        const player = this.players.find(player => player.uuid === uuid);
        return player ? player.name : "Unknown";
      },
      maskWord(word) {
        let maskedWord = "";
        for (let i = 0; i < word.length; i++) {
          maskedWord += word.charAt(i) === " " ? " " : "_";
        }
        return maskedWord;
      }
    }
  }
</script>
