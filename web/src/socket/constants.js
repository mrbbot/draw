// See SocketConstants.java for event descriptions
export const Events = {
  Sent: {
    CREATE_GAME: "create-game",
    JOIN_GAME: "join-game",
    START_GAME: "start-game",
    SELECT_WORD: "select-word",
    DRAW: "draw",
    GUESS: "guess"
  },
  Received: {
    PLAYER_JOINED: "player-joined",
    PLAYER_LEFT: "player-left",
    ROUND_START: "round-start",
    WORD_SELECTED: "word-selected",
    DRAW: "draw",
    GUESS: "guess",
    SCORE_UPDATE: "score-update",
    COMPLETE: "complete"
  }
};

export const SOCKET_URI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:9090"
    : "https://draw.server.mrbbot.dev";
