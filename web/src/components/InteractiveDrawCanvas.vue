<template>
  <TwoSidebars
    class="interactive-draw-canvas"
    :middle-aspect-ratio="4 / 3"
    :middle-horizontal-padding="60"
    :middle-vertical-padding="0"
    :style="{ '--fa-secondary-color': hexForColour(selectedColour) }"
    @dimensions="updateStoredDimensions"
  >
    <template slot="left">
      <!--Tools-->
      <div
        class="icon-button"
        v-for="tool of tools"
        :key="tool"
        :class="{ ['is-active']: tool === selectedTool }"
        @click="selectedTool = tool"
      >
        <FontAwesomeIcon
          :icon="['fad', iconForTool(tool)]"
          size="2x"
          fixed-width
        />
      </div>
      <!--Sizes-->
      <div
        class="icon-button for-size"
        v-for="size of sizes"
        :key="size"
        :style="{ opacity: selectedTool === tools[0] ? 1 : 0.5 }"
        :class="{
          ['is-active']: size === selectedSize && selectedTool === tools[0]
        }"
        @click="selectedSize = size"
      >
        <FontAwesomeIcon :icon="['fas', 'circle']" :size="size" fixed-width />
      </div>
    </template>
    <template v-slot:default="{ dimensions }">
      <slot name="canvas-overlay" />
      <DrawCanvas
        ref="canvas"
        :dimensions="dimensions"
        @mousedown.native="mouseDown"
        @mousemove.native="mouseMove"
        @touchstart.native="touchStart"
        @touchmove.native="touchMove"
      />
    </template>
    <template slot="right">
      <div
        class="colour"
        v-for="colour of colours"
        :key="colour"
        :class="{ ['is-selected']: colour === selectedColour }"
        :style="{ backgroundColor: hexForColour(colour) }"
        @click="selectedColour = colour"
      ></div>
    </template>
  </TwoSidebars>
</template>

<script>
import _throttle from "lodash/throttle";
import DrawCanvas from "./DrawCanvas";

import { draw } from "../socket/proto";
const { DrawEvent, Colour } = draw;
import {
  drawEventTypes,
  colours,
  iconForDrawEventType,
  hexForColour
} from "../socket/protoutils";
import TwoSidebars from "./TwoSidebars";

const sizes = ["sm", "lg", "2x"];
const sizesMap = {
  sm: 10,
  lg: 20,
  "2x": 40
};

export default {
  name: "interactive-draw-canvas",
  components: { TwoSidebars, DrawCanvas },
  data() {
    return {
      tools: drawEventTypes,
      selectedTool: DrawEvent.Type.BRUSH,
      sizes: sizes,
      selectedSize: sizes[0],
      colours: colours,
      selectedColour: Colour.RED,
      storedDimensions: { top: 0, left: 0, width: 0, height: 0 }
    };
  },
  created() {
    this.lastX = -1;
    this.lastY = -1;
    this.throttledContinueTap = _throttle(this.continueTap, 25);
  },
  methods: {
    updateStoredDimensions(newDimensions) {
      this.storedDimensions = newDimensions;
    },
    iconForTool: iconForDrawEventType,
    hexForColour,
    canvasCoords(clientX, clientY) {
      const { top, left, width, height } = this.storedDimensions;
      return {
        x: ((clientX - left) / width) * 600,
        y: ((clientY - top) / height) * 450
      };
    },
    mouseDown(e) {
      e.preventDefault();
      // console.log("mouseDown", e);
      const { x, y } = this.canvasCoords(e.clientX, e.clientY);
      this.startTap(x, y);
    },
    mouseMove(e) {
      // console.log("mouseMove", e);
      if (e.buttons === 1) {
        e.preventDefault();
        const { x, y } = this.canvasCoords(e.clientX, e.clientY);
        this.throttledContinueTap(x, y);
      }
    },
    touchStart(e) {
      e.preventDefault();
      // console.log("touchStart", e);
      const { x, y } = this.canvasCoords(
        e.targetTouches[0].clientX,
        e.targetTouches[0].clientY
      );
      this.startTap(x, y);
    },
    touchMove(e) {
      e.preventDefault();
      // console.log("touchMove", e);
      const { x, y } = this.canvasCoords(
        e.targetTouches[0].clientX,
        e.targetTouches[0].clientY
      );
      this.throttledContinueTap(x, y);
    },
    //TODO: fix when leaving canvas and coming back in, reset lastX/Y on leave?
    //TODO: check everything works with multiple touches
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
      drawEvent.type = this.selectedTool;
      drawEvent.colour = this.selectedColour;
      drawEvent.toX = thisX;
      drawEvent.toY = thisY;

      if (this.selectedTool === DrawEvent.Type.BRUSH) {
        drawEvent.size = sizesMap[this.selectedSize];
        if (this.lastX !== -1 && this.lastY !== -1) {
          drawEvent.fromX = this.lastX;
          drawEvent.fromY = this.lastY;
        }
      }

      this.$refs.canvas.handleDrawEvent(drawEvent);
      this.$emit("draw", drawEvent);

      this.lastX = thisX;
      this.lastY = thisY;
    }
  }
};
</script>

<style lang="sass">
.interactive-draw-canvas
  .sidebar
    padding: 0
    justify-content: center

  .icon-button
    width: 50px
    height: 50px
    margin: 5px
    cursor: pointer
    border-radius: 25px
    display: flex
    align-items: center
    justify-content: center
    transition: background-color linear 0.15s, opacity linear 0.15s
    &.is-active.for-size
      path
        fill: var(--fa-secondary-color)
        opacity: 0.6
        transition: fill linear 0.15s, opacity linear 0.15s
    @media (hover: hover)
      &:hover
        background-color: rgba(0, 0, 0, 0.075)
      &:active
        background-color: rgba(0, 0, 0, 0.15)

    &.is-active
      background-color: rgba(0, 0, 0, 0.15)
      --fa-secondary-opacity: 0.6

    &:not(.is-active)
      --fa-secondary-color: black

    .fa-secondary
      transition: fill linear 0.15s, opacity linear 0.15s

  .colour
    width: 100%
    height: calc(100% / 12)
    cursor: pointer
    box-sizing: border-box
    border: 5px solid transparent
    transition: border-color linear 0.15s
    @media (hover: hover)
      &:hover
        border-color: rgba(255, 255, 255, 0.5)
        &:last-child
          border-color: rgba(0, 0, 0, 0.15)

    &.is-selected
      border-color: rgba(255, 255, 255, 0.75)
      &:last-child
        border-color: rgba(0, 0, 0, 0.3)
</style>
