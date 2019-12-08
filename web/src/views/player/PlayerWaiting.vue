<template>
  <FullHeight>
    <IconDetail icon="check">
      <h2 class="title">{{ message }}</h2>
      <p>
        Please orient your device landscape and make this page fullscreen for
        the best experience.
      </p>
      <a class="button for-fullscreen" @click="requestFullscreen"
        >Go Fullscreen</a
      >
    </IconDetail>
  </FullHeight>
</template>

<!--suppress JSUnresolvedVariable -->
<script>
import FullHeight from "../../components/FullHeight";
import IconDetail from "../../components/IconDetail";

export default {
  name: "player-waiting",
  components: { IconDetail, FullHeight },
  props: {
    message: {
      type: String,
      default: "Waiting for players..."
    }
  },
  methods: {
    requestFullscreen() {
      const e = document.documentElement;
      if (e.requestFullscreen) e.requestFullscreen();
      else if (e.mozRequestFullScreen) e.mozRequestFullScreen();
      else if (e.webkitRequestFullscreen) e.webkitRequestFullscreen();
      else if (e.msRequestFullscreen) e.msRequestFullscreen();
    }
  }
};
</script>
