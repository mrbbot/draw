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
const { DrawEvent } = require("../socket/draw_pb");
import { hexForColour, colourHexes } from "../socket/protobuf_utils";

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
// Function to check whether an RGB colour is in the palette
function isPaletteColour(r, g, b) {
  for (let rgb of paletteRGBs) {
    if (rgb.r === r && rgb.g === g && rgb.b === b) {
      return true;
    }
  }
  return false;
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
      const type = drawEvent.getType();
      const x2 = drawEvent.getTox();
      const y2 = drawEvent.getToy();
      if (type === DrawEvent.Type.FILL) {
        const hex = hexForColour(drawEvent.getColour());
        const { r, g, b } = hexToRGB(hex);
        this.floodFill(x2, y2, r, g, b);
      } else {
        const colour = hexForColour(drawEvent.getColour());
        const size = drawEvent.getSize();
        const x1 = drawEvent.getFromx() || x2;
        const y1 = drawEvent.getFromy() || y2;

        this.ctx.lineWidth = size;
        this.ctx.strokeStyle = colour;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
      }
    },
    //Adapted from http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
    floodFill(startX, startY, fillR, fillG, fillB) {
      // Get raw image data from canvas
      const imageData = this.ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      // Helper function for converting from (x, y) coordinates to imageData index
      const index = (x, y) => (y * canvasWidth + x) * 4;

      // Get the colour where the user clicked
      const startIndex = index(startX, startY);
      const startR = imageData.data[startIndex];
      const startG = imageData.data[startIndex + 1];
      const startB = imageData.data[startIndex + 2];

      // Check if filling with same colour as start and return if so to avoid infinite loop
      if (startR === fillR && startG === fillG && startB === fillB) {
        return;
      }

      // Function to check whether the colour at the specified index matches the start
      function matchesStartColour(pixelIndex) {
        const pixelR = imageData.data[pixelIndex];
        const pixelG = imageData.data[pixelIndex + 1];
        const pixelB = imageData.data[pixelIndex + 2];
        // The !isPaletteColour makes sure that the flood fill matches colours that arise from the antialiasing of lines
        return (
          (startR === pixelR && startG === pixelG && startB === pixelB) ||
          !isPaletteColour(pixelR, pixelG, pixelB)
        );
      }

      // Function to set the colour of a pixel to the fill colour
      function colourPixel(pixelIndex) {
        imageData.data[pixelIndex] = fillR;
        imageData.data[pixelIndex + 1] = fillG;
        imageData.data[pixelIndex + 2] = fillB;
        imageData.data[pixelIndex + 3] = 255;
      }

      // Main loop
      const pixelStack = [[startX, startY]];
      while (pixelStack.length) {
        let [x, y] = pixelStack.pop();

        let pixelIndex = index(x, y);
        while (y >= 0 && matchesStartColour(pixelIndex)) {
          y--;
          // Move up one row
          pixelIndex -= canvasWidth * 4;
        }
        // Backtrack one step
        pixelIndex += canvasWidth * 4;
        y++;

        let reachLeft = false;
        let reachRight = false;
        while (y <= canvasHeight - 1 && matchesStartColour(pixelIndex)) {
          y++;

          // Change the current pixels colour
          colourPixel(pixelIndex);

          // Build the stack to the left
          if (x > 0) {
            if (matchesStartColour(pixelIndex - 4)) {
              if (!reachLeft) {
                pixelStack.push([x - 1, y]);
                reachLeft = true;
              }
            } else if (reachLeft) {
              reachLeft = false;
            }
          }

          // Build the stack to the right
          if (x < canvasWidth - 1) {
            if (matchesStartColour(pixelIndex + 4)) {
              if (!reachRight) {
                pixelStack.push([x + 1, y]);
                reachRight = true;
              }
            } else if (reachRight) {
              reachRight = false;
            }
          }

          // Move down one row
          pixelIndex += canvasWidth * 4;
        }
      }

      // Set the canvas to display the new image data
      this.ctx.putImageData(imageData, 0, 0);
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
