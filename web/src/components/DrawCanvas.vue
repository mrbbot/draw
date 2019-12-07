<template>
  <canvas ref="canvas" width="600" height="450" :style="styles" class="draw-canvas has-elevation"/>
</template>

<script>
  const {DrawEvent} = require("../socket/draw_pb");
  import {hexForColour} from "../socket/protobuf_utils";

  export default {
    name: "draw-canvas",
    props: {
      dimensions: {
        type: Object,
        required: true
      }
    },
    computed: {
      styles() {
        const {top, left, width, height} = this.dimensions;
        return {top: top + "px", left: left + "px", width: width + "px", height: height + "px"};
      },
    },
    mounted() {
      const canvas = this.$refs.canvas;
      this.ctx = canvas.getContext("2d");
      this.ctx.lineCap = "round";
    },
    methods: {
      clear() {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, 0, 600, 450);
      },
      handleDrawEvent(/** @type {DrawEvent} */ drawEvent) {
        const type = drawEvent.getType();
        if (type === DrawEvent.Type.FILL) {
          // TODO: do a proper flood fill here
          this.ctx.fillStyle = hexForColour(drawEvent.getColour());
          this.ctx.fillRect(0, 0, 600, 450);
        } else {
          const colour = type === DrawEvent.Type.ERASER ? "#FFFFFF" : hexForColour(drawEvent.getColour());
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
  }
</script>

<style lang="sass">
  .draw-canvas
    background-color: white
    position: absolute
</style>
