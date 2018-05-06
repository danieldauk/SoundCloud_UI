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
      return this.$store.state.tracks;
    }
  },
  

  created() {
    SC.get("playlists/89657406",{limit:8}).then(
      function(playlist) {
        console.log(playlist);
        var tracksArray = [];
        var currentPlaylist = {};
        var payload = {};
        for (var i = 0; i < playlist.tracks.length; i++) {
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
  grid-auto-rows: min-content;
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
