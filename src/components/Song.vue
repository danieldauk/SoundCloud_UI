<template>
  <div 
  class="song-container"
  @click="playSong">
  <img 
  class="artwork-image"
  :src="track.artwork_url.replace('large','t500x500')">
      <h3>{{track.title}}</h3>
      <h4>{{track.id}}</h4>
  </div>
</template>


<script>
export default {
  props: ["track"],
  methods: {
    playSong() {
      var myPlayer;
      SC.stream("/tracks/" + this.track.id)
        .then(function(player) {
          myPlayer = player;
        })
        .then(
          function() {
            this.$store.dispatch("loadPlayer",myPlayer);
            this.$store.dispatch("loadSong", this.track.title)
            this.$store.dispatch("isPlaying", true)
            this.$store.state.player.play();
          }.bind(this)
        );
    }
  }
};
</script>

<style lang="scss">
@import "../Sass_variables/variables";

.song-container{
  border: 1px solid $color-grey-light;
}

.artwork-image{
  height: 180px;
  width: 180px;
}
</style>
