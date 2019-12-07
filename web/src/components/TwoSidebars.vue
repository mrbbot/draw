<template>
  <div class="two-sidebars">
    <div class="sidebar for-left has-elevation">
      <slot name="left"/>
    </div>
    <slot :dimensions="middleDimensions"/>
    <div class="sidebar for-right has-elevation">
      <slot name="right"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "two-sidebars",
    data() {
      return {
        viewportWidth: 0,
        viewportHeight: 0
      }
    },
    props: {
      middleAspectRatio: {
        type: Number,
        default: 0
      },
      middleHorizontalPadding: {
        type: Number,
        default: 0
      },
      middleVerticalPadding: {
        type: Number,
        default: 0
      }
    },
    computed: {
      middleDimensions() {
        if (this.middleAspectRatio === 0) {
          return {top: 0, left: 0, width: 0, height: 0};
        }

        const availableWidth = this.viewportWidth - (2 * this.middleHorizontalPadding);
        const availableHeight = this.viewportHeight - (2 * this.middleVerticalPadding);

        let width, height;
        if (this.middleAspectRatio >= 1) {
          // Landscape
          width = availableWidth;
          height = width / this.middleAspectRatio;
          if (height > availableHeight) {
            height = availableHeight;
            width = height * this.middleAspectRatio;
          }
        } else {
          // Portrait
          height = availableHeight;
          width = height * this.middleAspectRatio;
          if (width > availableWidth) {
            width = availableWidth;
            height = width / this.middleAspectRatio;
          }
        }

        return {
          top: (this.viewportHeight - height) / 2,
          left: (this.viewportWidth - width) / 2,
          width: width,
          height: height,
        };
      }
    },
    created() {
      this.updateViewportDimensions();
      window.addEventListener("resize", this.updateViewportDimensions);
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.updateViewportDimensions);
    },
    methods: {
      updateViewportDimensions() {
        this.viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      }
    },
    watch: {
      middleDimensions: {
        immediate: true,
        handler(newDimensions) {
          this.$emit("dimensions", newDimensions);
        }
      }
    }
  }
</script>

<style lang="sass">
  .two-sidebars
    min-height: 100vh
    position: relative
    background-color: #EEEEEE

    .sidebar
      position: absolute
      top: 0
      bottom: 0
      width: 60px
      z-index: 10
      background-color: #FFFFFF
      display: flex
      flex-direction: column
      align-items: center
      padding: 1rem 0 0 0
      overflow-y: hidden

      &.for-left
        left: 0

      &.for-right
        right: 0
</style>
