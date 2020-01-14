<!--suppress HtmlRequiredAltAttribute, CheckImageSize, HtmlFormInputWithoutLabel -->
<template>
  <main class="slides">
    <div class="slide-progress">
      <div :style="{ width: `${(slide / (slideCount - 1)) * 100}%` }"></div>
    </div>
    <transition :name="direction" mode="out-in" @enter="setupSlide">
      <section v-if="slide === 0" class="slide" key="0">
        <div class="field has-secondary-rainbow">
          <FontAwesomeIcon
            :icon="['fad', 'paint-brush']"
            style="font-size: 8rem"
          />
        </div>
        <h1 class="title is-1">DrawIt</h1>
        <h2 class="subtitle has-text-centered" style="max-width: 240px;">
          Project using Java, JavaScript & Vue
        </h2>
      </section>
      <section v-else-if="slide === 1" class="slide is-horizontal" key="1">
        <!--Someone creates a lobby, players join with their mobile devices, in each
        round, every player gets a chance to draw and everyone else has to guess-->
        <img src="./img/skribbl.gif" style="height: 120px" />
        <h1
          class="title is-1 is-marginless"
          style="margin-right: 30px !important;"
        >
          +
        </h1>
        <img src="./img/kahoot.png" style="height: 100px" />
        <h1 class="title is-1 is-marginless" style="margin: 0 30px !important;">
          =
        </h1>
        <div class="field has-secondary-rainbow">
          <FontAwesomeIcon
            :icon="['fad', 'paint-brush']"
            style="font-size: 6rem"
          />
        </div>
      </section>
      <!--<section v-else-if="slide === 2" class="slide" key="2">
        <h1 class="title is-2">Core Components</h1>
        <ol style="font-size: 1.5rem">
          <li>Drawing <i>(JavaScript)</i></li>
          <li>Game management <i>(Java)</i></li>
          <li>Transport between clients & the host</li>
        </ol>
        &lt;!&ndash;Hopefully time for a quick demo at the end&ndash;&gt;
      </section>
      <section v-else-if="slide === 3" class="slide" key="3">
        <h1 class="title is-2">Canvas</h1>
        <div class="slide-row">
          <div class="slide-column" style="margin-right: 1rem">
            <Prism language="html" :code="code.slide3.html" />
            <Prism language="javascript" :code="code.slide3.js" />
          </div>
          <canvas ref="canvas3" width="200" height="200" />
        </div>
      </section>-->
      <section v-else-if="slide === 2" class="slide" key="4">
        <h1 class="title is-2">Paint Brush: 1<sup>st</sup> Attempt</h1>
        <h2 class="subtitle">Listen for mouse move, draw on event</h2>
        <SimpleDrawCanvas mode="bad-brush" />
      </section>
      <section v-else-if="slide === 3" class="slide" key="5">
        <h1 class="title is-2">Paint Brush: 2<sup>nd</sup> Attempt</h1>
        <h2 class="subtitle">
          Listen for mouse move, draw line between last & current coordinates
        </h2>
        <SimpleDrawCanvas mode="brush" />
      </section>
      <section v-else-if="slide === 4" class="slide" key="6">
        <h1 class="title is-2">Paint Bucket</h1>
        <h2 class="subtitle">
          <a
            href="http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/"
            >http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/</a
          >
        </h2>
        <div class="field">
          <img src="./img/paintbucket.gif" width="640" class="is-pixelated" />
        </div>
      </section>
      <section v-else-if="slide === 5" class="slide" key="7">
        <h1 class="title is-2">Paint Bucket: 1<sup>st</sup> Attempt</h1>
        <h2 class="subtitle"><!--No way to disable-->Anti-aliasing</h2>
        <SimpleDrawCanvas mode="bad-fill" />
        <h2 class="subtitle has-text-grey" style="margin-top: 1rem;">
          Shift: Blue / Alt: Fill
        </h2>
      </section>
      <section v-else-if="slide === 6" class="slide" key="8">
        <h1 class="title is-2">Paint Bucket: 2<sup>nd</sup> Attempt</h1>
        <h2 class="subtitle">
          Check if colour in palette
        </h2>
        <SimpleDrawCanvas mode="fill" />
        <h2 class="subtitle has-text-grey" style="margin-top: 1rem;">
          Shift: Blue / Alt: Fill
        </h2>
      </section>
      <section v-else-if="slide === 7" class="slide" key="9">
        <h1 class="title is-2">Creating Games</h1>
        <ul style="font-size: 1.5rem; list-style: inherit;">
          <li>Each game has its own thread <i>(waiting for players)</i></li>
          <li>
            Java threads &approx; OS threads
            <!--OS handles scheduling, heavy-weight, up to 1000s-->
          </li>
          <li>
            Comparison with Goroutines
            <!--Go runtime handles scheduling, map to fewer OS threads, millions-->
          </li>
          <!--Not really a concern atm given number of simultaneous games-->
        </ul>
      </section>
      <!--<section v-else-if="slide === 10" class="slide" key="10">
        <h1 class="title is-2">Thread Communication</h1>
        <Prism language="java" :code="code.slide10" />
        &lt;!&ndash;Also used for letting thread know when all players have guessed the word/or timeout&ndash;&gt;
      </section>-->
      <section v-else-if="slide === 8" class="slide" key="11">
        <h1 class="title is-2">Transport: Socket.IO</h1>
        <ul style="font-size: 1.5rem; list-style: inherit;">
          <li>Event bus over network</li>
          <li>Tries WebSockets, falls back to polling</li>
          <li>Rooms</li>
          <!--<li>
            <code class="has-text-grey-dark">netty-socketio</code> Java Library
          </li>-->
        </ul>
      </section>
      <section v-else-if="slide === 9" class="slide" key="12">
        <div class="slide-row">
          <SimpleDrawCanvas
            mode="brush"
            :width="320"
            :height="240"
            :throttle-amount="slide12ThrottleAmount"
            @draw="slide12OnDraw"
          />
          <svg width="320" height="60">
            <rect x="0" y="10" width="100%" height="40" fill="#CCCCCC" />
            <rect x="0" y="9" width="100%" height="1" fill="#000000" />
            <rect x="0" y="50" width="100%" height="1" fill="#000000" />
            <rect
              v-for="event of slide12Events"
              :key="event.id"
              :x="event.x"
              y="20"
              width="20"
              height="20"
              :fill="event.fill"
            />
            <rect x="130" y="0" width="60" height="60" fill="#333333" />
          </svg>
          <SimpleDrawCanvas
            ref="targetCanvas12"
            mode="brush"
            :disable-mouse="true"
            :width="320"
            :height="240"
          />
        </div>
        <input
          type="range"
          min="0"
          max="200"
          step="20"
          v-model="slide12RawThrottleAmount"
        />
        <p
          class="event-count"
          style="font-size: 1.5rem;"
          :style="{ opacity: slide12Events.length === 0 ? 0 : 1 }"
        >
          Events: {{ slide12Events.length }}
        </p>
      </section>
      <section v-else-if="slide === 10" class="slide" key="13">
        <h1 class="title is-2">Encoding</h1>
        <ul style="font-size: 1.5rem; list-style: inherit;">
          <li>
            Initially JSON
            <i>(key data)</i>
            <!--lots of duplicated data for draw events: key names-->
          </li>
          <li>Socket.IO also supports binary messages</li>
          <li>Need language independent binary format</li>
        </ul>
      </section>
      <section v-else-if="slide === 11" class="slide" key="14">
        <h1 class="title is-2">Protocol Buffers</h1>
        <div class="content" style="max-width: 600px;">
          <blockquote>
            Protocol buffers are Google's language-neutral, platform-neutral,
            extensible mechanism for serializing structured data.
          </blockquote>
        </div>
        <div class="slide-row">
          <Prism language="protobuf" :code="code.slide14.proto" />
          <h1
            class="title is-1 is-marginless"
            style="margin: 0 30px !important;"
          >
            &rightarrow;
          </h1>
          <Prism language="java" :code="code.slide14.java" />
          <!--for JavaScript, using pbjs not google-protobuf for much smaller bundle size-->
        </div>
      </section>
      <section v-else-if="slide === 12" class="slide" key="15">
        <div class="slide-row for-comparison">
          <Prism language="javascript" :code="code.slide15.proto" />
          <Prism language="javascript" :code="code.slide15.json" />
        </div>
      </section>
      <section v-else-if="slide === 13" class="slide" key="16">
        <h1 class="title is-2 is-spaced">Demo Time</h1>
        <h2 class="subtitle">
          <a href="https://draw.mrbbot.dev">https://draw.mrbbot.dev</a>
        </h2>
        <h2 class="subtitle">
          <a href="https://github.com/mrbbot/draw"
            >https://github.com/mrbbot/draw</a
          >
        </h2>
        <div class="field">
          <router-link
            class="button is-dark has-background-rainbow is-medium"
            to="/host"
            >Start Game</router-link
          >
        </div>
      </section>
    </transition>
  </main>
</template>

<script>
import "prismjs";
import "prismjs/components/prism-java";
import "prismjs/components/prism-protobuf";
import Prism from "vue-prism-component";
import "prismjs/themes/prism.css";
import SimpleDrawCanvas from "./SimpleDrawCanvas";
import "./protocomparison";

const code = {
  slide3: {
    html: `<canvas ref="canvas" width="200" height="200" />`,
    js: `const canvas = this.$refs.canvas;
const ctx = canvas.getContext("2d");

ctx.fillStyle = "red";
ctx.fillRect(/*x*/ 10, /*y*/ 20, /*w*/ 30, /*h*/ 40);

ctx.lineCap = "round";
ctx.lineWidth = 10;
ctx.strokeStyle = "#0000FF";
ctx.beginPath();
ctx.moveTo(/*x*/ 50, /*y*/ 50);
ctx.lineTo(/*x*/ 100, /*y*/ 100);
ctx.stroke();`
  },
  slide10: `List<String> words = Words.randomWords(3);
wordSelectionFuture = new CompletableFuture<String>()
  .completeOnTimeout(words.get(1), 15, TimeUnit.SECONDS);
String selectedWord = wordSelectionFuture.get();
...
void onSelectWord(String word) {
  wordSelectionFuture.complete(word);
}`,
  slide14: {
    proto: `message DrawEvent {
  enum Type {
    BRUSH = 0;
    FILL = 1;
  }

  Type type = 1;
  Colour colour = 2;
  int32 size = 3;
  int32 fromX = 4;
  int32 fromY = 5;
  int32 toX = 6;
  int32 toY = 7;
}`,
    java: `public void writeTo(com.google.protobuf.CodedOutputStream output)
                        throws java.io.IOException {
      if (type_ != dev.mrbbot.draw.DrawProtos.DrawEvent.Type.BRUSH.getNumber()) {
        output.writeEnum(1, type_);
      }
      if (colour_ != dev.mrbbot.draw.DrawProtos.Colour.RED.getNumber()) {
        output.writeEnum(2, colour_);
      }
      if (size_ != 0) {
        output.writeInt32(3, size_);
      }
      if (fromX_ != 0) {
        output.writeInt32(4, fromX_);
      }
      if (fromY_ != 0) {
        output.writeInt32(5, fromY_);
      }
      if (toX_ != 0) {
        output.writeInt32(6, toX_);
      }
      if (toY_ != 0) {
        output.writeInt32(7, toY_);
      }
      unknownFields.writeTo(output);
    }`,
    javascript: `DrawEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.colour != null && message.hasOwnProperty("colour"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.colour);
            if (message.size != null && message.hasOwnProperty("size"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.size);
            if (message.fromX != null && message.hasOwnProperty("fromX"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.fromX);
            if (message.fromY != null && message.hasOwnProperty("fromY"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.fromY);
            if (message.toX != null && message.hasOwnProperty("toX"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.toX);
            if (message.toY != null && message.hasOwnProperty("toY"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.toY);
            return writer;
        };`
  },
  slide15: {
    proto: `const drawEvent = new DrawEvent();
drawEvent.type = DrawEvent.Type.FILL;
drawEvent.colour = Colour.BLUE;
drawEvent.toX = 10;
drawEvent.toY = 20;
console.log(DrawEvent.encode(drawEvent).finish());

Uint8Array(8) [ 8, 1, 16, 4, 48, 10, 56, 20 ]`,
    json: `const drawEvent = {
  type: "FILL",
  colour: "BLUE",
  toX: 10,
  toY: 20
};
const bytes = stringToBytes(JSON.stringify(drawEvent));
console.log(new Uint8Array(bytes));

Uint8Array(49) [ 123, 34, 116, 121, 112, 101, 34, 58, 34, 70, ... ]`
  }
};

export default {
  name: "slides",
  components: {
    SimpleDrawCanvas,
    Prism
  },
  data() {
    return {
      slide: 0,
      slideCount: 14,
      direction: "slide-forward",
      slide12EventCount: 0,
      slide12Events: [],
      slide12AnimationFrame: -1,
      slide12RawThrottleAmount: 0
    };
  },
  computed: {
    slide12ThrottleAmount() {
      return parseInt(this.slide12RawThrottleAmount);
    }
  },
  created() {
    this.code = code;
    window.addEventListener("keydown", this.keyDown);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keyDown);
  },
  methods: {
    keyDown(e) {
      switch (e.key) {
        case "R":
        case "r":
          this.direction = "slide-backward";
          this.slide = 0;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          this.direction = "slide-backward";
          this.slide = (this.slide - 1 + this.slideCount) % this.slideCount;
          break;
        case "ArrowRight":
        case "ArrowDown":
        case "Enter":
          this.direction = "slide-forward";
          this.slide = (this.slide + 1) % this.slideCount;
          break;
      }
    },
    setupSlide() {
      const setupFunction = this[`slide${this.slide}Setup`];
      if (setupFunction) setupFunction();
    },
    // slide3Setup() {
    //   const ctx = this.$refs.canvas3.getContext("2d");
    //   ctx.fillStyle = "red";
    //   ctx.fillRect(10, 20, 30, 40);
    //   ctx.lineCap = "round";
    //   ctx.lineWidth = 10;
    //   ctx.strokeStyle = "#0000FF";
    //   ctx.beginPath();
    //   ctx.moveTo(50, 50);
    //   ctx.lineTo(100, 100);
    //   ctx.stroke();
    // },
    slide8Setup() {
      this.slide9Destroy();
    },
    slide10Setup() {
      this.slide9Destroy();
    },
    slide9Setup() {
      this.slide12RawThrottleAmount = "0";
      this.slide12AnimationFrame = requestAnimationFrame(this.slide12Animation);
    },
    slide9Destroy() {
      cancelAnimationFrame(this.slide12AnimationFrame);
      this.slide12Events = [];
    },
    slide12OnDraw(drawEvent) {
      this.slide12Events.push({
        id: this.slide12EventCount,
        x: -20,
        fill: drawEvent.shift ? "blue" : "red",
        drawEvent
      });
      this.slide12EventCount++;
    },
    slide12DrawEvent({ lastX, lastY, x, y, shift, alt }) {
      const targetCanvas = this.$refs.targetCanvas12;
      targetCanvas.lastX = lastX;
      targetCanvas.lastY = lastY;
      targetCanvas.handleDraw(x, y, shift, alt);
    },
    slide12Animation() {
      this.slide12Events = this.slide12Events.filter(event => {
        event.x += 2;
        if (event.x > 320) {
          this.slide12DrawEvent(event.drawEvent);
          return false;
        }
        return true;
      });
      this.slide12AnimationFrame = requestAnimationFrame(this.slide12Animation);
    }
  }
};
</script>

<!--suppress CssOverwrittenProperties -->
<style lang="sass">
.slides
  position: absolute
  top: 0
  left: 0
  bottom: 0
  right: 0
  overflow: hidden

  .slide-progress
    position: absolute
    top: 0
    left: 0
    right: 0
    height: 6px
    > div
      transition: width 0.25s ease
      height: 100%
      background-color: #CCCCCC

  .slide
    width: 100%
    height: 100%
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    &.is-horizontal
      flex-direction: row

  .event-count
    transition: opacity 0.25s linear

  .slide-forward-enter-active, .slide-forward-leave-active, .slide-backward-enter-active, .slide-backward-leave-active
    transition: all 0.25s ease
  .slide-forward-enter, .slide-backward-leave-to
    transform: translateX(10px)
    opacity: 0
  .slide-forward-leave-to, .slide-backward-enter
    transform: translateX(-10px)
    opacity: 0

  .slide-row
    display: flex
    flex-direction: row
    align-items: center
    justify-content: center

  .slide-column
    display: flex
    flex-direction: column

  code[class*="language-"], pre[class*="language-"]
    .tag, .number
      display: inline
      padding: inherit
      font-size: inherit
      line-height: inherit
      text-align: inherit
      vertical-align: inherit
      border-radius: inherit
      font-weight: inherit
      white-space: inherit
      background: inherit
      margin: inherit

  canvas
    border: 1px solid black

  .for-comparison
    pre:first-child
      margin-right: 1rem

  .title.is-2.is-spaced
    margin-bottom: 1.5rem

  img.is-pixelated
    image-rendering: pixelated
    image-rendering: crisp-edges
</style>
