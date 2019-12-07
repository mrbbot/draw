package dev.mrbbot.draw;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.google.protobuf.InvalidProtocolBufferException;
import dev.mrbbot.draw.DrawProtos.*;
import dev.mrbbot.draw.SocketConstants.*;

import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class DrawServer {
  // Numbers of random digits for game pins
  private static final int GAME_PIN_LENGTH = 6;

  private static final Logger LOGGER = LoggerFactory.getLogger(DrawServer.class);
  private final static Random RANDOM = new Random();

  private final SocketIOServer io;

  // Lock for games map
  private final ReadWriteLock gamesLock;
  // Map of game pins to games
  private final Map<String, Game> games;

  public DrawServer(Dotenv dotenv) {
    // Initialise Socket.IO server
    Configuration config = new Configuration();
    config.setHostname("localhost");
    config.setPort(Integer.parseInt(Objects.requireNonNull(dotenv.get("DRAW_PORT"))));
    config.setOrigin(dotenv.get("DRAW_ORIGIN"));
    config.setRandomSession(true);
    config.setMaxFramePayloadLength(1024 * 1024);
    config.setMaxHttpContentLength(1024 * 1024);

    io = new SocketIOServer(config);
    io.addConnectListener(this::onConnect);
    io.addDisconnectListener(this::onDisconnect);
    // See SocketConstants class for event descriptions
    io.addEventListener(Events.Received.CREATE_GAME, byte[].class, this::onCreateGame);
    io.addEventListener(Events.Received.JOIN_GAME, byte[].class, this::onJoinGame);
    io.addEventListener(Events.Received.START_GAME, byte[].class, this::onStartGame);
    io.addEventListener(Events.Received.SELECT_WORD, String.class, this::onSelectWord);
    io.addEventListener(Events.Received.DRAW, byte[].class, this::onDraw);
    io.addEventListener(Events.Received.GUESS, byte[].class, this::onGuess);

    // Initialise games map and lock
    gamesLock = new ReentrantReadWriteLock();
    games = new HashMap<>();
  }

  private void onConnect(SocketIOClient client) {
    LOGGER.info("Client {} connected!", client.getSessionId());
  }

  private void onDisconnect(SocketIOClient client) {
    LOGGER.info("Client {} disconnected!", client.getSessionId());

    // Check if this client is associated with a game, if they are, disconnect them from it
    String gamePin = client.get(Keys.GAME);
    gamesLock.writeLock().lock();
    try {
      if (gamePin != null && games.containsKey(gamePin)) {
        // On disconnect will return true if this client was the host, in that case, remove the game from
        // the list. Otherwise, remove the game if there are no longer any clients connected to it.
        if (games.get(gamePin).onDisconnect(client) || io.getRoomOperations(gamePin).getClients().size() == 0) {
          games.get(gamePin).stop();
          games.remove(gamePin);
          LOGGER.info("Removed \"{}\" from games map! ({} game(s) remaining)", gamePin, games.size());
        }
      }
    } finally {
      gamesLock.writeLock().unlock();
    }
  }

  // Generate a random GAME_PIN_LENGTH digit number
  private String generateRandomPin() {
    StringBuilder pinBuilder;
    do {
      pinBuilder = new StringBuilder(GAME_PIN_LENGTH);
      for (int i = 0; i < GAME_PIN_LENGTH; i++) {
        // 48 is the ASCII code for '0'
        pinBuilder.append((char) (RANDOM.nextInt(10) + 48));
      }
    } while (games.containsKey(pinBuilder.toString()));
    return pinBuilder.toString();
  }

  // Handler for game creation request
  private void onCreateGame(SocketIOClient client, byte[] data, AckRequest ackRequest) {
    String pin;
    gamesLock.writeLock().lock();
    try {
      // Generate a random pin for the game
      pin = generateRandomPin();
      // Create the game (associating the creating client as the host) and store it in the games map
      Game game = new Game(io, pin, client);
      games.put(pin, game);
    } finally {
      gamesLock.writeLock().unlock();
    }
    // Send the pin in the ack request
    ackRequest.sendAckData(pin);
  }

  // Get the game associated with the specified pin or null if there isn't one or the pin is null
  private Game getGameForPin(String pin) {
    if (pin == null) {
      return null;
    }
    gamesLock.readLock().lock();
    try {
      return games.get(pin);
    } finally {
      gamesLock.readLock().unlock();
    }
  }

  // Handler for players joining a game
  private void onJoinGame(SocketIOClient client, byte[] data, AckRequest ackRequest) throws InvalidProtocolBufferException {
    // Decode raw protobuf data into event
    JoinEvent e = JoinEvent.parseFrom(data);
    // Try and get the associated game, if there is one, join it
    Game game = getGameForPin(e.getPin());
    if (game != null) {
      game.onJoin(client, e);
      ackRequest.sendAckData(true);
    } else {
      ackRequest.sendAckData(false);
    }
  }

  // Handler for the host clicking the start game button on the lobby screen
  private void onStartGame(SocketIOClient client, byte[] data, AckRequest ackRequest) throws InvalidProtocolBufferException {
    // Try and get the associated game, if there is one, start it
    Game game = getGameForPin(client.get(Keys.GAME));
    if (game != null) {
      StartGameEvent e = StartGameEvent.parseFrom(data);
      game.onStart(e);
    }
    ackRequest.sendAckData(true);
  }

  // Handler for a player selecting a word to draw
  private void onSelectWord(SocketIOClient client, String word, AckRequest ackRequest) {
    // Try and get the associated game, if there is one, mark this as the selected word
    Game game = getGameForPin(client.get(Keys.GAME));
    if (game != null) {
      game.onSelectWord(client, word);
    }
  }

  // Handler for a player drawing on the canvas
  private void onDraw(SocketIOClient client, byte[] data, AckRequest ackRequest) {
    // Even though this function takes protobuf data, decoding it is skipped as this function needs to be
    // as efficient as possible given how frequently it may be called (up to every 25 milliseconds)

    // Try and get the associated game, if there is one, forward on the draw data
    Game game = getGameForPin(client.get(Keys.GAME));
    if (game != null) {
      game.onDraw(data);
    }
  }

  // Handler for a player entering a guess
  private void onGuess(SocketIOClient client, byte[] data, AckRequest ackRequest) throws InvalidProtocolBufferException {
    // Try and get the associated game, if there is one, check if the guess was correct
    Game game = getGameForPin(client.get(Keys.GAME));
    if (game != null) {
      GuessEvent e = GuessEvent.parseFrom(data);
      game.onGuess(client, e);
    }
  }

  // Start the Socket.IO server (this method is blocking)
  public void start() {
    io.startAsync();
  }

  // Main entry point for the program
  public static void main(String[] args) {
    // Create a new server and start it
    new DrawServer(Dotenv.load()).start();
  }
}
