package dev.mrbbot.draw;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Words {
  // File name relative to root of JAR of words list
  private final static String WORDS_FILE = "/dev/mrbbot/draw/words.txt";
  private final static Random RANDOM = new Random();
  // List of words to chose from
  private static List<String> WORDS;

  // Gets a random word to be guessed
  public static String randomWord() {
    // If words haven't been loaded yet, load them
    if (WORDS == null) {
      WORDS = new ArrayList<>();

      // Read the words file line by line...
      try {
        BufferedReader reader = new BufferedReader(new InputStreamReader(Words.class.getResourceAsStream(WORDS_FILE)));
        String line;
        while ((line = reader.readLine()) != null) {
          // Remove extra whitespace
          line = line.trim();
          // Add the word if it's not empty
          if (!line.isEmpty()) {
            WORDS.add(line.toLowerCase());
          }
        }
      } catch (IOException e) {
        e.printStackTrace();
      }
    }

    // Get a random word from the list
    return WORDS.get(RANDOM.nextInt(WORDS.size()));
  }

  // Build a list containing `count` unique words
  public static List<String> randomWords(int count) {
    List<String> words = new ArrayList<>();
    // Iterate `count` times
    for (int i = 0; i < count; i++) {
      // While word is not unique, keep generating a random word
      String word;
      do {
        word = randomWord();
      } while (words.contains(word));
      // Once it's unique, add it to the list
      words.add(word);
    }
    return words;
  }
}
