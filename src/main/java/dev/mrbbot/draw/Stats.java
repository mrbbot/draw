package dev.mrbbot.draw;

import com.timgroup.statsd.NoOpStatsDClient;
import com.timgroup.statsd.NonBlockingStatsDClient;
import com.timgroup.statsd.StatsDClient;
import com.timgroup.statsd.StatsDClientException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.URISyntaxException;

public final class Stats {
  public static class Timer {
    private String aspect;
    private long startTime;

    private Timer(String aspect) {
      this.aspect = aspect;
      startTime = System.currentTimeMillis();
    }

    public void done() {
      getInstance().recordExecutionTime(aspect, System.currentTimeMillis() - startTime);
    }
  }

  private static final Logger LOGGER = LoggerFactory.getLogger(Stats.class);
  private static StatsDClient INSTANCE;

  public static StatsDClient getInstance() {
    if(INSTANCE == null) {
      LOGGER.info("Initialising statsd client...");
      // Get the URL of the statsd server from the environment, should look something like this:
      // statsd://hostname:8125
      String urlSpec = System.getenv("STATSD_URL");
      try {
        // Try to parse the URL and connect to statsd
        URI uri = new URI(urlSpec);
        INSTANCE = new NonBlockingStatsDClient("draw", uri.getHost(), uri.getPort());
        LOGGER.info("Connected to statsd!");
      } catch (URISyntaxException e) {
        LOGGER.warn("Unable to parse STATSD_URL: " + urlSpec + " (defaulting to no-op client)", e);
        INSTANCE = new NoOpStatsDClient();
      } catch (StatsDClientException e) {
        LOGGER.warn("An exception was thrown when initialising the statsd client (defaulting to no-op client)", e);
        INSTANCE = new NoOpStatsDClient();
      }
    }
    return INSTANCE;
  }

  public static void count(String aspect, int delta) {
    getInstance().count(aspect, delta);
  }

  public static void count(String aspect, int delta, double sampleRate) {
    getInstance().count(aspect, delta, sampleRate);
  }

  public static Timer time(String aspect) {
    return new Timer(aspect);
  }

  public static void gauge(String aspect, int value) {
    getInstance().recordGaugeValue(aspect, value);
  }

  public static void set(String aspect, String value) {
    getInstance().recordSetValue(aspect, value);
  }
}
