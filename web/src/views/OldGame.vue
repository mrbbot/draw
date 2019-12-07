<template>
  <div class="game" :style="{'--fa-secondary-color': hexForColour(selectedColour)}">
    <div class="left">
      <div class="icon-button" v-for="tool of tools" :class="{['is-active']: tool === selectedTool}"
           @click="selectedTool = tool">
        <FontAwesomeIcon :icon="['fad', iconForTool(tool)]" size="2x" fixed-width/>
      </div>
      <div class="icon-button" @click="requestFullScreen">
        <FontAwesomeIcon :icon="['fad', 'compress']" size="2x" fixed-width/>
      </div>
    </div>
    <canvas ref="canvas" width="600" height="450" :style="canvasStyles" @mousedown="mouseDown" @mousemove="mouseMove"
            @touchstart="touchStart" @touchmove="touchMove"/>
    <div class="right">
      <div class="colour" v-for="colour of colours" :class="{['is-selected']: colour === selectedColour}"
           :style="{backgroundColor: hexForColour(colour)}" @click="selectedColour = colour"></div>
    </div>
  </div>
</template>

<!--suppress JSUnresolvedVariable -->
<script>
  import io from "socket.io-client";
  import _throttle from "lodash/throttle";

  const {DrawEvent, Colour} = require("../socket/draw_pb");
  import {drawEventTypes, colours, iconForDrawEventType, hexForColour} from "../socket/protobuf_utils";

  export default {
    name: "game",
    data() {
      return {
        viewportWidth: 0,
        viewportHeight: 0,
        tools: drawEventTypes,
        selectedTool: DrawEvent.Type.BRUSH,
        colours: colours,
        selectedColour: Colour.RED,
      }
    },
    computed: {
      canvasDimensions() {
        const availableWidth = this.viewportWidth - 120;
        const availableHeight = this.viewportHeight;
        const canvasRatio = 4 / 3;

        let width = availableWidth;
        let height = width / canvasRatio;
        if (height > availableHeight) {
          height = availableHeight;
          width = height * canvasRatio;
        }

        return {
          top: (this.viewportHeight - height) / 2,
          left: (this.viewportWidth - width) / 2,
          width: width,
          height: height,
        }
      },
      canvasStyles() {
        const {top, left, width, height} = this.canvasDimensions;
        return {top: top + "px", left: left + "px", width: width + "px", height: height + "px"};
      },
    },
    created() {
      this.updateViewportDimensions();
      window.addEventListener("resize", this.updateViewportDimensions);
      this.lastX = -1;
      this.lastY = -1;
      this.throttledContinueTap = _throttle(this.continueTap, 25);
      this.socket = io("http://localhost:9090");
      this.socket.on("connect", (e) => console.log("connect", e));
      this.socket.on("draw", (e) => this.handleDrawEvent(DrawEvent.deserializeBinary(e)));
      this.socket.on("disconnect", (e) => console.log("disconnect", e));
    },
    mounted() {
      const canvas = this.$refs.canvas;
      this.ctx = canvas.getContext("2d");
      this.ctx.lineCap = "round";
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.updateViewportDimensions);
      this.socket.disconnect();
    },
    methods: {
      iconForTool: iconForDrawEventType,
      hexForColour,
      updateViewportDimensions() {
        this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      },
      requestFullScreen() {
        const e = document.documentElement;
        if (e.requestFullscreen) e.requestFullscreen();
        else if (e.mozRequestFullScreen) e.mozRequestFullScreen();
        else if (e.webkitRequestFullscreen) e.webkitRequestFullscreen();
        else if (e.msRequestFullscreen) e.msRequestFullscreen();
        this.updateViewportDimensions();
      },
      canvasCoords(clientX, clientY) {
        const {top, left, width, height} = this.canvasDimensions;
        return {
          x: (clientX - left) / width * 600,
          y: (clientY - top) / height * 450
        };
      },
      mouseDown(e) {
        // console.log("mouseDown", e);
        const {x, y} = this.canvasCoords(e.clientX, e.clientY);
        this.startTap(x, y);
      },
      mouseMove(e) {
        // console.log("mouseMove", e);
        if (e.buttons === 1) {
          const {x, y} = this.canvasCoords(e.clientX, e.clientY);
          this.throttledContinueTap(x, y);
        }
      },
      touchStart(e) {
        // console.log("touchStart", e);
        const {x, y} = this.canvasCoords(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        this.startTap(x, y);
      },
      touchMove(e) {
        // console.log("touchMove", e);
        const {x, y} = this.canvasCoords(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        this.throttledContinueTap(x, y);
      },
      startTap(x, y) {
        this.lastX = -1;
        this.lastY = -1;
        this.sendDrawEvent(x, y);
      },
      continueTap(x, y) {
        this.sendDrawEvent(x, y);
      },
      sendDrawEvent(x, y) {
        const thisX = Math.round(x);
        const thisY = Math.round(y);

        const drawEvent = new DrawEvent();
        drawEvent.setType(this.selectedTool);

        if (this.selectedTool === DrawEvent.Type.BRUSH || this.selectedTool === DrawEvent.Type.FILL) {
          drawEvent.setColour(this.selectedColour);
        }

        if (this.selectedTool === DrawEvent.Type.BRUSH || this.selectedTool === DrawEvent.Type.ERASER) {
          drawEvent.setSize(10);
          drawEvent.setTox(thisX);
          drawEvent.setToy(thisY);
          if (this.lastX !== -1 && this.lastY !== -1) {
            drawEvent.setFromx(this.lastX);
            drawEvent.setFromy(this.lastY);
          }
        }

        this.handleDrawEvent(drawEvent);
        this.socket.binary(true).emit("draw", drawEvent.serializeBinary());

        this.lastX = thisX;
        this.lastY = thisY;
      },
      handleDrawEvent(/** @type {DrawEvent} */ drawEvent) {
        const type = drawEvent.getType();
        if (type === DrawEvent.Type.FILL) {
          this.ctx.fillStyle = this.hexForColour(drawEvent.getColour());
          this.ctx.fillRect(0, 0, 600, 450);
        } else {
          const colour = type === DrawEvent.Type.ERASER ? "#FFFFFF" : this.hexForColour(drawEvent.getColour());
          const size = drawEvent.getSize();
          const x2 = drawEvent.getTox();
          const y2 = drawEvent.getToy();
          const x1 = drawEvent.getFromx() || x2;
          const y1 = drawEvent.getFromy() || y2;

          this.ctx.lineWidth = size;
          this.ctx.strokeStyle = colour;
          this.ctx.beginPath();
          this.ctx.moveTo(x1, y1);
          this.ctx.lineTo(x2, y2);
          this.ctx.stroke();
        }
      }
    }
  };
</script>

<style lang="sass">
  .game
    position: relative
    width: 100vw
    height: 100vh
    background-color: #333333
    --fa-secondary-color: #FF0000

    .left, .right
      position: absolute
      top: 0
      bottom: 0
      z-index: 10
      width: 60px
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)
      background-color: white
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center

    .left
      left: 0

    .right
      right: 0

    .icon-button
      width: 50px
      height: 50px
      margin: 5px
      cursor: pointer
      border-radius: 25px
      display: flex
      align-items: center
      justify-content: center
      transition: background-color linear 0.15s
      @media (hover: hover)
        &:hover
          background-color: rgba(0, 0, 0, 0.075)
        &:active
          background-color: rgba(0, 0, 0, 0.15)

      &.is-active
        --fa-secondary-opacity: 0.6

      &:not(.is-active)
        --fa-secondary-color: black

      .fa-secondary
        transition: fill linear 0.15s, opacity linear 0.15s

    .colour
      width: 100%
      height: 12.5%
      cursor: pointer
      box-sizing: border-box
      border: 10px solid transparent
      transition: border-color linear 0.15s
      @media (hover: hover)
        &:hover
          border-color: rgba(255, 255, 255, 0.5)

      &.is-selected
        border-color: rgba(255, 255, 255, 0.75)

    //noinspection CssOverwrittenProperties
    canvas
      position: absolute
      background-color: white
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)
  /*image-rendering: -moz-crisp-edges*/
  /*image-rendering: -webkit-crisp-edges*/
  /*image-rendering: pixelated*/
  /*image-rendering: crisp-edges*/
</style>
