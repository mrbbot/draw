package dev.mrbbot.draw;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import dev.mrbbot.draw.DrawProtos.*;
import dev.mrbbot.draw.SocketConstants.Events;
import dev.mrbbot.draw.SocketConstants.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;
import java.util.function.Predicate;

@SuppressWarnings("RedundantCast")
public class Game implements Runnable {
  // Maximum possible score increase per round
  private final static double MAX_ROUND_SCORE = 500;
  // Maximum number of seconds someone can take to select a word before it is done automatically
  private final static int MAX_WORD_SELECT_SECONDS = 10;

  // Logger for this game (prefixed with game pin)
  private final Logger logger;
  // Reference to Socket.IO server from DrawServer
  private final SocketIOServer server;
  // "ID" of this game, used to connect to the game
  private final String pin;
  // Client associated with the host of this game
  private final SocketIOClient host;
  // Queue of clients associated with players who are yet to draw this round (sorted lexicographically by UUID)
  private final PriorityQueue<SocketIOClient> roundNextPlayerQueue;

  // Thread used to run this game
  private Thread thread;

  // Current round index out of totalRounds (1-indexed)
  private int currentRound;
  // Total rounds for this game
  private int totalRounds;
  // Maximum number of seconds someone has to draw their word and allow people to guess it
  private int roundLengthSeconds;
  // Whether the game has been completed
  private boolean gameComplete = false;

  // Client associated with the player currently drawing
  private SocketIOClient currentDrawer;

  // Future to be completed when the current drawer selects a word to draw
  private CompletableFuture<String> wordSelectionFuture;
  // Future to be completed when all players have guessed the word
  private CompletableFuture<Boolean> allPlayersGuessedFuture;

  // Instant when the current drawer started drawing
  private Instant drawingStartInstant;
  // Word that is currently being guessed
  private String currentWord;
  // Number of players that were able to guess at the start of the round
  private AtomicInteger guessingPlayersAtRoundStart;
  // Number of players that have so far guessed correctly this round
  private AtomicInteger playersGuessedCorrectly;

  public Game(SocketIOServer server, String pin, SocketIOClient host) {
    // Create logger for this game
    this.logger = LoggerFactory.getLogger(getClass().getName() + "[" + pin + "]");
    this.server = server;
    this.pin = pin;
    this.host = host;

    // Create priority queue sorting lexicographically by UUID
    //noinspection Convert2Diamond
    this.roundNextPlayerQueue = new PriorityQueue<SocketIOClient>(Comparator.comparing(client -> client.getSessionId().toString())) {
      @Override
      public boolean add(SocketIOClient client) {
        // Only allow unique clients to be added that aren't the host
        if (super.contains(client) || client.<Boolean>get(Keys.IS_HOST)) {
          return false;
        }
        // Otherwise, defer to normal add
        return super.add(client);
      }
    };

    // Mark the instantiating client as the host and join the game's Socket.IO room
    this.host.set(Keys.GAME, pin);
    this.host.set(Keys.IS_HOST, true);
    this.host.joinRoom(pin);

    // Initialise counters
    this.guessingPlayersAtRoundStart = new AtomicInteger();
    this.playersGuessedCorrectly = new AtomicInteger();

    logger.info("{} created", host.getSessionId());
  }

  // Helper function for iterating over a collection only consuming elements that match a filter
  private static <T> void forEach(Iterable<T> collection, Predicate<T> filter, Consumer<T> consumer) {
    for (T item : collection) {
      if (filter.test(item)) {
        consumer.accept(item);
      }
    }
  }

  // Helper function for iterating over a collection of clients only consuming those that aren't the host
  private static void forEachPlayer(Iterable<SocketIOClient> clients, Consumer<SocketIOClient> consumer) {
    forEach(clients, client -> !client.<Boolean>get(Keys.IS_HOST), consumer);
  }

  // Get the number of players in the game capable of guessing (not the host/current drawer)
  private int getNumberOfGuessingPlayers() {
    int count = 0;
    for (SocketIOClient client : server.getRoomOperations(pin).getClients()) {
      // Ignore if host/current drawer
      if (!client.equals(host) && !client.equals(currentDrawer)) {
        count++;
      }
    }
    return count;
  }

  // Updates the score of a specified client by a given amount
  private void updateScore(SocketIOClient client, double scoreChange) {
    // Make sure score change doesn't exceed the maximum per round
    scoreChange = Math.round(Math.min(MAX_ROUND_SCORE, scoreChange));

    // Build the score update event
    ScoreUpdateEvent updateEvent = ScoreUpdateEvent.newBuilder()
      .setUuid(client.getSessionId().toString())
      .setScoreChange((int) scoreChange)
      .build();

    // Sent it to the host and the player who's score is being updated
    byte[] rawUpdateEvent = updateEvent.toByteArray();
    host.sendEvent(Events.Sent.SCORE_UPDATE, (Object) rawUpdateEvent);
    client.sendEvent(Events.Sent.SCORE_UPDATE, (Object) rawUpdateEvent);
  }

  // Checks if all players capable of doing so have guessed the word, completing the allPlayersGuessedFuture if so
  private void checkIfAllGuessedCorrectly() {
    // Get the number of connected clients -1 for the host
    int numberOfGuessingPlayers = getNumberOfGuessingPlayers();
    if (playersGuessedCorrectly.get() == numberOfGuessingPlayers && allPlayersGuessedFuture != null) {
      // Mark this as the case so the game can proceed
      allPlayersGuessedFuture.complete(true);
    }
  }

  // Handler for when a client joins the game
  public void onJoin(SocketIOClient client, JoinEvent e) {
    logger.info("{} (\"{}\") joined", client.getSessionId(), e.getName());
    // Add the player to the game and update the host
    client.set(Keys.GAME, pin);
    client.set(Keys.IS_HOST, false);
    client.joinRoom(pin);
    // Add the player to the round next player queue
    roundNextPlayerQueue.add(client);
    // Update the host
    JoinEvent newEvent = e.toBuilder().setUuid(client.getSessionId().toString()).build();
    host.sendEvent(Events.Sent.PLAYER_JOINED, (Object) newEvent.toByteArray());
  }

  // Handler for when a client leaves the game
  public boolean onDisconnect(SocketIOClient client) {
    logger.info("{} disconnected", client.getSessionId());

    if (client.get(Keys.IS_HOST)) {
      logger.info("{} was the host of the game, so disconnecting everyone", client.getSessionId());
      // If the host disconnected, disconnect everyone else and return true
      forEachPlayer(server.getRoomOperations(pin).getClients(), SocketIOClient::disconnect);
      // Return true indicating the disconnecting client wasn't the host
      return true;
    } else {
      // Remove the client from the next player queue
      roundNextPlayerQueue.remove(client);

      // There is a chance that this player was the current drawer, if this is the case, don't do anything:
      // connected players can still guess for the remaining time

      // Update the host (only if the game hasn't been completed)
      if (!gameComplete) {
        host.sendEvent(Events.Sent.PLAYER_LEFT, client.getSessionId().toString());
      }

      // Check if all players have now guessed correctly now that a player has disconnected
      checkIfAllGuessedCorrectly();

      // Return false indicating the disconnecting client wasn't the host
      return false;
    }
  }

  // Handler for when the start game button is pressed
  public void onStart(StartGameEvent e) {
    // Make sure we only ever start one game thread
    if (thread != null) return;

    // Store game parameters
    this.currentRound = 1;
    this.totalRounds = e.getNumberRounds();
    this.roundLengthSeconds = e.getRoundSeconds();

    logger.info("Starting game with {} rounds each of {} seconds...", this.totalRounds, this.roundLengthSeconds);

    // Start game thread
    thread = new Thread(this, "game-" + pin);
    thread.start();
  }

  // Handler for when the current drawer selects a word
  public void onSelectWord(SocketIOClient client, String word) {
    logger.info("{} selected \"{}\" to draw", client.getSessionId(), word);
    // Select the word if possible
    if (wordSelectionFuture != null) {
      wordSelectionFuture.complete(word);
    }
  }

  // Handler for when the current drawer draws on the canvas
  public void onDraw(byte[] rawDrawEvent) {
    // logger.info("{} {} event received: ({}, {}) -> ({}, {}) @ {}x", e.getColour(), e.getType(), e.getFromX(), e.getFromY(), e.getToX(), e.getToY(), e.getSize());
    // Forward draw events onto the host to be displayed
    host.sendEvent(Events.Sent.DRAW, (Object) rawDrawEvent);
  }

  // Handler for when a player makes a guess
  public void onGuess(SocketIOClient client, GuessEvent guessEvent) {
    // Check if the word matches the guess...
    if (guessEvent.getGuess().equals(currentWord)) {
      logger.info("{} correctly guessed the word", client.getSessionId());
      // If it does, increment that player's score proportional to how quickly they guessed it with
      // a minimum of half the max score for actually guessing it
      int seconds = (int) Duration.between(drawingStartInstant, Instant.now()).toSeconds();
      updateScore(client, MAX_ROUND_SCORE * ((((double) seconds / roundLengthSeconds) / 2) + 0.5));
      playersGuessedCorrectly.incrementAndGet();

      // Check if all players have now guessed correctly
      checkIfAllGuessedCorrectly();
    } else {
      logger.info("{} incorrectly guessed the word as {}", client.getSessionId(), guessEvent.getGuess());
    }
    // In either case, forward it on to the host to display it on the side
    host.sendEvent(Events.Sent.GUESS, (Object) guessEvent.toByteArray());
  }

  public void stop() {
    if (thread != null) {
      logger.info("Stopping game...");
      thread.interrupt();
    }
  }

  // For some reason, netty-socketio only sends the full binary data to one client with
  // `server.getRoomOperations(pin).sendEvent(event, (Object) array);`, so this function
  // sends the data to each client individually
  @SuppressWarnings("SameParameterValue")
  private void sendBinaryEventToAll(String name, byte[] data) {
    for (SocketIOClient client : server.getRoomOperations(pin).getClients()) {
      client.sendEvent(name, (Object) data);
    }
  }

  // Executor for the game thread
  @Override
  public void run() {
    try {
      // While there are still rounds to be played...
      while (currentRound <= totalRounds) {
        logger.info("Starting round {}...", currentRound);

        // While there are still players that need to draw this round...
        while (roundNextPlayerQueue.size() > 0) {
          // 0. Reset round states
          drawingStartInstant = null;
          currentWord = null;
          guessingPlayersAtRoundStart.set(getNumberOfGuessingPlayers());
          playersGuessedCorrectly.set(0);

          // 1. Get the next player to draw
          currentDrawer = roundNextPlayerQueue.poll();
          if (currentDrawer == null) continue;

          logger.info("{} is the next drawer", currentDrawer.getSessionId());

          // 2. Generate 3 random words to chose from, build & send player round start event to all clients
          PlayerRoundStartEvent.Builder startEventBuilder = PlayerRoundStartEvent.newBuilder()
            .setUuid(currentDrawer.getSessionId().toString())
            .setRoundNumber(currentRound)
            .setRoundSeconds(roundLengthSeconds);
          // Generate 3 random words to chose from
          List<String> words = Words.randomWords(3);
          startEventBuilder.addAllWords(words);
          logger.info("Generated {} as random words, sending round start and waiting for word selection...", words);
          sendBinaryEventToAll(Events.Sent.ROUND_START, startEventBuilder.build().toByteArray());

          // 3. Wait for the current player to select a word (or select the middle one after 10 seconds)
          String selectedWord = words.get(1);
          wordSelectionFuture = new CompletableFuture<String>().completeOnTimeout(selectedWord, MAX_WORD_SELECT_SECONDS, TimeUnit.SECONDS);
          try {
            selectedWord = wordSelectionFuture.get();
          } catch (ExecutionException e) {
            e.printStackTrace();
          }
          logger.info("{} was selected, let the drawing begin...", selectedWord);
          wordSelectionFuture = null;
          // Send the selected word to all clients
          currentWord = selectedWord;
          server.getRoomOperations(pin).sendEvent(Events.Sent.WORD_SELECTED, selectedWord);

          // 4. Player should now be drawing the word, wait for all players to guess (or timeout after roundLengthSeconds seconds)
          drawingStartInstant = Instant.now();
          allPlayersGuessedFuture = new CompletableFuture<Boolean>().completeOnTimeout(false, roundLengthSeconds, TimeUnit.SECONDS);
          try {
            allPlayersGuessedFuture.get();
          } catch (ExecutionException e) {
            e.printStackTrace();
          }
          allPlayersGuessedFuture = null;

          // 5. Update the score of the drawer based on how many people guessed correctly
          logger.info("Round complete! Updating score of drawer...");
          updateScore(currentDrawer, MAX_ROUND_SCORE * playersGuessedCorrectly.get() / guessingPlayersAtRoundStart.get());
        }

        logger.info("All players drawn this round, adding them all back to the queue...");
        // Re-add all players (host checking is handled in the priority queue implementation)
        roundNextPlayerQueue.addAll(server.getRoomOperations(pin).getClients());
        // Increment the round number
        currentRound++;
      }

      // Mark the game as complete, showing the winners
      logger.info("All rounds complete! Sending complete event...");
      gameComplete = true;
      server.getRoomOperations(pin).sendEvent(Events.Sent.COMPLETE);
    } catch (InterruptedException e) {
      logger.info("Game thread interrupted!");
    }
  }
}
