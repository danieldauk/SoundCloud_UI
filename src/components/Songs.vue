<template>
<div class="songs-container">

   <transition-group
   tag="div"
   class="transition-container"
   name="tracks">
   
        <app-song 
        v-for="track in tracks" :track="track"
        :key="track.id"></app-song>
   </transition-group>
 
</div>
</template>

<script>
import Song from "./Song.vue";


export default {
  computed: {
    tracks() {
     // console.log(this.$store.state.currentPlaylist);
      return this.$store.state.tracks;
    },
    currentSong() {
      return this.$store.state.currentSong;
    }
  },
  

  created() {
    SC.get("playlists/89657406").then(
      function(playlist) {
        var tracksArray = [];
        var currentPlaylist = {};
        var payload = {};
        for (var i = 0; i < 8; i++) {
          tracksArray.push(playlist.tracks[i]);
          currentPlaylist[playlist.tracks[i].title] = i;
        }
        payload.array = tracksArray;
        payload.playlist = currentPlaylist;
        this.$store.dispatch("loadTracks", payload);
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

.transition-container {
  min-height: calc(100vh - 50px);
  display: grid;
  grid-gap: 20px;
  justify-content: center;
  grid-template-columns: repeat(4, 200px);
}

.songs-container{
    padding-bottom: 60px;
    padding-top: 10px;
    background-color: $color-grey-medium;
}
.tracks-move{
    transition: 1s;
}

</style>
