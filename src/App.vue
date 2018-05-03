<template>
<div>
<button
  @click="checkTime"
  >CheckTime</button>
  <button
  @click="playMusic"
  >Play</button>
  <button
  @click="loadMusic"
  >Load Music</button>
  <app-menu></app-menu>
  <app-song v-for="track in tracks" :track="track"></app-song>
</div>
</template>

<script>
import Menu from "./components/Menu";
import Song from "./components/Song.vue";

export default {
  computed:{
    tracks(){
      return this.$store.state.tracks;
    }
  },
  methods: {
    playMusic() {
      if (this.$store.state.player !== "") {
        console.log(SC);
        this.$store.state.player.play();
      } else {
        var myPlayer;
        SC.stream("/tracks/367956896")
          .then(function(player) {
            myPlayer = player;
          })
          .then(
            function() {
              this.$store.state.player = myPlayer;
              this.$store.state.player.play();
              console.log(this.$store.state.player);
            }.bind(this)
          );
      }
    },
    loadMusic() {
      SC.get("/tracks", {
        q: "Tom Walker Leave a light on"
      }).then(function(tracks) {
        this.$store.state.tracks = tracks;
      }.bind(this));
    },
    checkTime() {
      console.log(this.$store.state.player.currentTime());
    }
  },
  components: {
    appMenu: Menu,
    appSong: Song
  }
};
</script>

<style lang="scss">
$color-green-light: #00da5a;
$color-green-dark: #07bb4f;
$color-black: #181818;
$color-grey-dark: #282828;
$color-grey-medium: #333333;
$color-grey-light: #bdbdbd;
$color-white: #f2f2f2;
</style>
