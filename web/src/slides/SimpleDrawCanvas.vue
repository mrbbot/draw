<template>
  <canvas
    ref="canvas"
    :width="width"
    :height="height"
    @mousedown="mouseDown"
    @mousemove="mouseMove"
  />
</template>

<script>
import _throttle from "lodash/throttle";
import floodFill from "../components/fill";

const rawRed = { r: 255, g: 0, b: 0 };
const rawBlue = { r: 0, g: 0, b: 255 };
const rawWhite = { r: 255, g: 255, b: 255 };

export default {
  name: "simple-draw-canvas",
  props: {
    width: {
      type: Number,
      default: 640
    },
    height: {
      type: Number,
      default: 480
    },
    mode: {
      type: String,
      required: true
    },
    disableMouse: {
      type: Boolean,
      default: false
    },
    throttleAmount: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.lastX = -1;
    this.lastY = -1;
  },
  mounted() {
    const canvas = this.$refs.canvas;
    this.rect = canvas.getBoundingClientRect();
    this.ctx = canvas.getContext("2d");
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = 20;
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.width, this.height);
  },
  watch: {
    throttleAmount: {
      immediate: true,
      handler(newThrottleAmount) {
        this.throttledHandleDraw =
          newThrottleAmount === 0
            ? this.handleDraw
            : _throttle(this.handleDraw, newThrottleAmount);
      }
    }
  },
  methods: {
    canvasCoords(clientX, clientY) {
      return {
        x: clientX - this.rect.left,
        y: clientY - this.rect.top
      };
    },
    mouseDown(e) {
      if (this.disableMouse) return;
      const { x, y } = this.canvasCoords(e.clientX, e.clientY);
      this.lastX = x;
      this.lastY = y;
      this.handleDraw(x, y, e.shiftKey, e.altKey);
    },
    mouseMove(e) {
      if (this.disableMouse) return;
      if (e.buttons === 1) {
        const { x, y } = this.canvasCoords(e.clientX, e.clientY);
        this.throttledHandleDraw(x, y, e.shiftKey, false);
      }
    },
    handleDraw(x, y, shift, alt) {
      this.$emit("draw", {
        lastX: this.lastX,
        lastY: this.lastY,
        x,
        y,
        shift,
        alt
      });
      x = Math.round(x);
      y = Math.round(y);
      const colour = shift ? "blue" : "red";
      const rawColour = shift ? rawBlue : rawRed;
      this.ctx.fillStyle = colour;
      this.ctx.strokeStyle = colour;
      if (alt && this.mode.endsWith("fill")) {
        const palette =
          this.mode === "bad-fill" ? null : [rawRed, rawBlue, rawWhite];
        floodFill(
          this.ctx,
          x,
          y,
          rawColour.r,
          rawColour.g,
          rawColour.b,
          this.width,
          this.height,
          palette
        );
      } else {
        switch (this.mode) {
          case "bad-brush":
            this.ctx.beginPath();
            this.ctx.arc(x, y, 10, 0, 2 * Math.PI);
            this.ctx.fill();
            break;
          case "brush":
          case "bad-fill":
          case "fill":
            if (this.lastX !== -1 && this.lastY !== -1) {
              this.ctx.beginPath();
              this.ctx.moveTo(this.lastX, this.lastY);
              this.ctx.lineTo(x, y);
              this.ctx.stroke();
            }
            break;
        }
      }

      this.lastX = x;
      this.lastY = y;
    }
  }
};
</script>
