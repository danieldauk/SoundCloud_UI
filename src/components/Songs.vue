<template>
<div class="songs-container">
   <button
   @click="shuffleSongs"
   >Shuffle</button>
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
import _ from "lodash";

export default {
  computed: {
    tracks() {
      return this.$store.state.tracks;
    },
    currentSong() {
      return this.$store.state.currentSong;
    }
  },
  methods: {
    shuffleSongs() {
      var tracksArray = this.$store.state.tracks;
      tracksArray = _.shuffle(tracksArray);
      this.$store.dispatch("loadTracks", tracksArray);
    }
  },

  created() {
    SC.get("playlists/89657406").then(
      function(playlist) {
        var tracksArray = [];
        for (var i = 0; i < 10; i++) {
          tracksArray.push(playlist.tracks[i]);
        }
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

.transition-container {
  min-height: calc(100vh - 50px);
  background-color: $color-grey-medium;
  display: grid;
  grid-gap: 20px;
  justify-content: center;
  grid-template-columns: repeat(4, 200px);
}

.tracks-move{
    transition: 1s;
}

</style>
