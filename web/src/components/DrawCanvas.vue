<template>
  <canvas
    ref="canvas"
    :width="canvasWidth"
    :height="canvasHeight"
    :style="styles"
    class="draw-canvas has-elevation"
  />
</template>

<script>
import { draw } from "../socket/proto";
const { DrawEvent } = draw;
import { hexForColour, colourHexes } from "../socket/protoutils";
import floodFill from "./fill";

const canvasWidth = 600;
const canvasHeight = 450;

// Helper function to convert a hex colour (#123456) to an object containing RGB values
function hexToRGB(hex) {
  return {
    r: parseInt(hex[1] + hex[2], 16),
    g: parseInt(hex[3] + hex[4], 16),
    b: parseInt(hex[5] + hex[6], 16)
  };
}

// Build of list of RGB values for colours in the palette
const paletteRGBs = [];
for (let colourId in colourHexes) {
  paletteRGBs.push(hexToRGB(colourHexes[colourId]));
}

export default {
  name: "draw-canvas",
  props: {
    dimensions: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      canvasWidth,
      canvasHeight
    };
  },
  computed: {
    styles() {
      const { top, left, width, height } = this.dimensions;
      return {
        top: top + "px",
        left: left + "px",
        width: width + "px",
        height: height + "px"
      };
    }
  },
  mounted() {
    const canvas = this.$refs.canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.lineCap = "round";
    this.clear();
  },
  methods: {
    clear() {
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    },
    handleDrawEvent(/** @type {DrawEvent} */ drawEvent) {
      const type = drawEvent.type;
      const x2 = drawEvent.toX;
      const y2 = drawEvent.toY;
      if (type === DrawEvent.Type.FILL) {
        const hex = hexForColour(drawEvent.colour);
        const { r, g, b } = hexToRGB(hex);
        floodFill(
          this.ctx,
          x2,
          y2,
          r,
          g,
          b,
          canvasWidth,
          canvasHeight,
          paletteRGBs
        );
      } else {
        const colour = hexForColour(drawEvent.colour);
        const size = drawEvent.size;
        const x1 = drawEvent.fromX || x2;
        const y1 = drawEvent.fromY || y2;

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
.draw-canvas
  background-color: white
  position: absolute
  /*image-rendering: -moz-crisp-edges*/
  /*image-rendering: -webkit-crisp-edges*/
  /*image-rendering: pixelated*/
  /*image-rendering: crisp-edges*/
</style>
