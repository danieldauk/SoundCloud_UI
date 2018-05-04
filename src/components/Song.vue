<template>
  <div 
  class="song-container"
  @click="playSong">
  <img 
  class="artwork-image"
  :src="track.artwork_url.replace('large','t500x500')">
  <div 
  :style="{width:songPercentage}"
  class="waveform-container">
    <img 
    class="waveform"
    :src="track.waveform_url">
  </div>
  <button @click.stop="pauseSong">Pause</button>
      <h3>{{track.title}}</h3>
      <h4>{{track.id}}</h4>
  </div>
</template>


<script>
export default {
  props: ["track"],
  computed:{
    songPercentage(){
      return this.$store.state.currentSongTime/this.track.duration * 100 + "%";
    }
  },
  methods: {
    currentSongTime(){
      var currentTimeInterval = setInterval(function(){
        this.$store.dispatch("setCurrentSongTime",this.$store.state.player.currentTime())
      }.bind(this),1000);
      this.$store.dispatch("setInterval", currentTimeInterval);
      
    },
    pauseSong(){
      this.$store.state.player.pause();
      this.$store.dispatch("isPlaying", false);
      clearInterval(this.$store.state.intervalVariable);
    },
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
            this.currentSongTime();
          }.bind(this)
        );
    }
  }
};
</script>

<style lang="scss">
@import "../Sass_variables/variables";

.song-container{
  background: $color-grey-dark;
  display:grid;
  grid-template-rows: 200px 20px 50px;
}

.artwork-image{
  height: 200px;
  width: 200px;
}

.waveform-container{
  background:$color-green-dark;
  width:0;
}
.waveform{
  width: 200px;
  height:20px;
  filter: invert(100%);
}
</style>
