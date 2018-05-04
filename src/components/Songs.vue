<template>
<div class="songs-container">
   {{currentSong}}
 <app-song 
 v-for="track in tracks" :track="track"
 :key="track.id"></app-song>
</div>
</template>

<script>
import Song from "./Song.vue";

export default {
  computed: {
    tracks() {
      return this.$store.state.tracks;
    },
    currentSong() {
      return this.$store.state.currentSong;
    },
    shuffleSongs(){}
  },
  methods: {},

  created() {
    SC.get("playlists/89657406").then(
      function(playlist) {
        var tracksArray = [];
        for (var i = 0; i < 10; i++) {
          tracksArray.push(playlist.tracks[i]);
        }
        console.log(tracksArray);
        this.$store.dispatch("loadTracks", tracksArray);
      }.bind(this)
    );
  },
  components: {
    appSong: Song
  }
};
</script>

<style lang="scss">
@import "../Sass_variables/variables";

.songs-container{
    min-height: calc(100vh - 50px);
    background-color: $color-grey-dark;
    display: grid;
    grid-gap: 10px;
    justify-content: center;
    grid-template-columns: repeat(4,250px);
}

</style>
