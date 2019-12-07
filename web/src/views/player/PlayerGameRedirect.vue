<template>
  <div></div>
</template>

<script>
  export default {
    name: "player-game-redirect",
    created() {
      window.gamePin = this.$route.params.id;
      this.$router.replace("/");
    }
  }
</script>
