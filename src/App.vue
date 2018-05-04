<template>
<div>
  <app-songs></app-songs>

  <app-player></app-player>

</div>
</template>

<script>
import Header from "./components/Header.vue";
import Songs from "./components/Songs.vue";
import Player from "./components/Player.vue";


export default {
  components: {
    appHeader: Header,
    appSongs: Songs,
    appPlayer: Player
  }
};
</script>

<style lang="scss">
  body{
    padding: 0;
    margin: 0;
  }

</style>
