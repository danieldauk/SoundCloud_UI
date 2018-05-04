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
      <transition
      name="song"
      >
          <svg 
          v-if="showButton"
          :key="'play'+ track.id"
          @click="playSong"
          class="song-control-icon-play">
            <use xlink:href="../src/svg/sprite.svg#icon-controller-play"/>
          </svg>

          <svg 
          :key="'pause'+ track.id"
          v-if="!showButton"
          @click="pauseSong"
          class="song-control-icon-pause">
            <use xlink:href="../src/svg/sprite.svg#icon-controller-paus"/>
          </svg>
        
      </transition>
      
    </div>
  

  </div>
</template>


<script>
export default {
  props: ["track"],
  computed: {
    showButton() {
      if (
        this.$store.state.isPlaying === false &&
        this.$store.state.currentSong !== this.track.title
      ) {
        return true;
      } else if (
        this.$store.state.isPlaying === true &&
        this.$store.state.currentSong !== this.track.title
      ) {
        return true;
      } else if (
        this.$store.state.isPlaying === false &&
        this.$store.state.currentSong === this.track.title
      ) {
        return true;
      } else {
        return false;
      }
    },
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
        this.$store.state.player.seek(position);
      }
    },
    currentSongTime() {
      this.$store.dispatch(
        "setCurrentSongTime",
        this.$store.state.player.currentTime()
      );
      var currentTimeInterval = setInterval(
        function() {
          this.$store.dispatch(
            "setCurrentSongTime",
            this.$store.state.player.currentTime()
          );
        }.bind(this),
        100
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
        this.$store.dispatch("isPlaying", true);
        if (!this.$store.state.isPlaying) {
          this.currentSongTime();
        }
      } else {
        clearInterval(this.$store.state.intervalVariable);
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
              this.$store.dispatch(
                "setCurrentTrackDuration",
                this.track.duration
              );
              this.$store.dispatch("setCurrentWave", this.track.waveform_url);
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
  filter: brightness(14.5%);
}

.title-container p {
  margin: 0;
  color: $color-grey-light;
}

.song-menu-container {
  display: flex;
  align-items: center;
}

.song-control-icon-play {
  height: 20px;
  width: 20px;
  fill: $color-grey-light;
  cursor: pointer;
}

.song-control-icon-pause {
  height: 17px;
  width: 17px;
  fill: $color-green-light;
  cursor: pointer;
}

.song-enter{
  opacity:0;
transform: translateX(20px);
}

.song-enter-active{
  transition: .5s;
}

.song-leave-active{
transform: translateX(-20px);
opacity:0;
transition: .5s;
position: absolute;
}


</style>
