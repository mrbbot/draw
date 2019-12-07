package dev.mrbbot.draw;

// Static class for string constants related to sockets
public class SocketConstants {
  // Static class for event names sent/received by this Socket.IO server
  public static class Events {
    // Static class for event names received by this Socket.IO server
    public static class Received {
      // Event received when a host requests a game be created: receives nothing and sends a string
      // acknowledgement containing the newly created game's pin
      public static final String CREATE_GAME = "create-game";
      // Event received when a player joins a game: receives a protobuf JoinEvent and sends an
      // acknowledgement for whether the game was found
      public static final String JOIN_GAME = "join-game";
      // Event received when the host clicks the "Start Game" button in the lobby: receives a protobuf
      // StartGameEvent
      public static final String START_GAME = "start-game";
      // Event received when a player selects a word they want to draw: receives a string which is
      // the selected word
      public static final String SELECT_WORD = "select-word";
      // Event received when a player draws on the canvas: receives a protobuf DrawEvent that is then
      // forwarded onto the host to be displayed
      public static final String DRAW = "draw";
      // Event received when a player guesses what a drawing is: receives a protobuf GuessEvent
      public static final String GUESS = "guess";
    }

    // Static class for event names sent by this Socket.IO server
    public static class Sent {
      // Event sent to the host when a player joins the game: sends a protobuf JoinEvent
      public static final String PLAYER_JOINED = "player-joined";
      // Event sent to the host when a player leaves the game: sends a string containing the UUID of
      // the disconnecting player
      public static final String PLAYER_LEFT = "player-left";
      // Event sent to all players when a new (sub)round starts: sends a protobuf PlayerRoundStartEvent
      public static final String ROUND_START = "round-start";
      // Event sent to all players when a player selects a word to draw or they run out of time to
      // select: sends a string containing the selected word
      public static final String WORD_SELECTED = "word-selected";
      // Event sent to the host when a player draws on the canvas: sends a protobuf DrawEvent
      public static final String DRAW = "draw";
      // Event sent to the host when a player guesses what a drawing is (correct or incorrect): sends a
      // protobuf GuessEvent
      public static final String GUESS = "guess";
      // Event sent to the host and the relevant player when a player's score is updated: sends a
      // protobuf ScoreUpdateEvent
      public static final String SCORE_UPDATE = "score-update";
      // Event sent to all players when the game is over and all rounds have been completed: sends
      // nothing
      public static final String COMPLETE = "complete";
    }
  }

  // Static class for key names for data attached to sockets
  public static class Keys {
    // Pin of the game the socket is currently playing
    public static final String GAME = "game";
    // Whether the socket is the host of the game
    public static final String IS_HOST = "is-host";
  }
}
