<template>
  <div class="song-container">
    <img 
    class="artwork-image"
    :src="track.artwork_url.replace('large','t500x500')">
    <div 
    @click="setSongPosition"
    :style="{width:songPercentage}"
    class="waveform-container">
      <img 
      class="waveform"
      :src="track.waveform_url">
    </div>
    <div class="title-container">
      <p>{{track.title}}</p>
    </div>
    <div class="song-menu-container">
      <button @click="playSong">Play</button>
<button @click="pauseSong">Pause</button>
    </div>
  

  </div>
</template>


<script>
export default {
  props: ["track"],
  computed: {
    songPercentage() {
      if (this.$store.state.currentSong === this.track.title) {
        return (
          this.$store.state.currentSongTime / this.track.duration * 100 + "%"
        );
      } else {
        return 0 + "%";
      }
    }
  },
  methods: {
    setSongPosition(event) {
      if (this.$store.state.currentSong === this.track.title) {
        var myDiv = document.getElementsByClassName("waveform")[0].offsetWidth;
        var position = this.track.duration * (event.offsetX / myDiv);
        console.log(position);
        this.$store.state.player.seek(position);
      }
    },
    currentSongTime() {
      var currentTimeInterval = setInterval(
        function() {
          this.$store.dispatch(
            "setCurrentSongTime",
            this.$store.state.player.currentTime()
          );
        }.bind(this),
        1000
      );
      this.$store.dispatch("setInterval", currentTimeInterval);
    },
    pauseSong() {
      this.$store.state.player.pause();
      this.$store.dispatch("isPlaying", false);
      clearInterval(this.$store.state.intervalVariable);
    },
    playSong() {
      if (this.$store.state.currentSong === this.track.title) {
        this.$store.state.player.play();
      } else {
        //update current time to 0 and bar width to 0
        this.$store.dispatch("setCurrentSongTime", 0);
        var myPlayer;
        SC.stream("/tracks/" + this.track.id)
          .then(function(player) {
            myPlayer = player;
          })
          .then(
            function() {
              this.$store.dispatch("loadPlayer", myPlayer);
              this.$store.dispatch("loadSong", this.track.title);
              this.$store.dispatch("isPlaying", true);
              this.$store.state.player.play();
              this.currentSongTime();
            }.bind(this)
          );
      }
    }
  }
};
</script>

<style lang="scss">
@import "../Sass_variables/variables";

.song-container {
  background: $color-grey-dark;
  display: grid;
  grid-template-rows: 200px 20px auto 30px;
}

.artwork-image {
  height: 200px;
  width: 200px;
}

.waveform-container {
  background: $color-green-dark;
  width: 0;
  cursor: pointer;
}
.waveform {
  width: 200px;
  height: 20px;
  filter: invert(100%);
}

.title-container p {
  margin: 0;
  color: $color-grey-light;
}
</style>
