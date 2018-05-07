<template>
  <div class="song-container">
    <img 
    class="artwork-image"
    :src="(track.artwork_url)?track.artwork_url.replace('large','t500x500') : 'https://dummyimage.com/500x500/1e1f1e/282828&text=No Image'">
    <div 
    @click="setSongPosition"
    
    class="waveform-container">
      <div
      class="waveform-container-fill-1"
      :style="{width:songPercentage}">
      </div>
      <div
      class="waveform-container-fill-2">
      </div>
      <div 
      :style="{'-webkit-mask-box-image': 'url(' +track.waveform_url +')'}" 
      class="waveform"></div>
    </div>
    <div class="title-container">
     <p>{{track.title |toSentenceCase |cutTitle}}</p>
    </div>
    <div class="song-menu-container">
      <div class="play-pause-song-container">
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
      
      <div class="song-time">
        {{songTime}}
      </div>
      <div class="repeat-song-container">
          <svg
          @click="setRepeatSong"
                :class="[{'song-control-icon-repeat': true},{'song-repeat-on':songRepeat}]">
                  <use xlink:href="../src/svg/sprite.svg#icon-cycle"/>
            </svg>
      </div>
      
    </div>
  

  </div>
</template>


<script>
import _ from "lodash";
export default {
  props: ["track"],
  computed: {
    songRepeat() {
      if (
        this.$store.state.currentSong == this.track.title &&
        this.$store.state.repeatSong
      ) {
        return true;
      } else {
        return false;
      }
    },
    songTime() {
      if (this.$store.state.currentSong === this.track.title) {
        var currentTimeSeconds = Math.round(
          this.$store.state.currentSongTime / 1000
        );
        var totalTimeSeconds = Math.round(
          this.$store.state.currentTrackDuration / 1000
        );
        var currentTimeMinutes = currentTimeSeconds / 60;
        var currentResidualMinutes =
          Math.round((currentTimeMinutes % 1) * 60) < 10
            ? "0" + Math.round((currentTimeMinutes % 1) * 60)
            : Math.round((currentTimeMinutes % 1) * 60);
        var currentTimeMinutesAndSeconds =
          Math.floor(currentTimeMinutes) + ":" + currentResidualMinutes;
        var totalTimeMinutes = totalTimeSeconds / 60;
        var totalResidualMinutes =
          Math.round((totalTimeMinutes % 1) * 60) < 10
            ? "0" + Math.round((totalTimeMinutes % 1) * 60)
            : Math.round((totalTimeMinutes % 1) * 60);
        var totalTimeMinutesAndSeconds =
          Math.floor(totalTimeMinutes) + ":" + totalResidualMinutes;
        return currentTimeMinutesAndSeconds + "/" + totalTimeMinutesAndSeconds;
      } else {
        var totalTimeSeconds = Math.round(this.track.duration / 1000);
        var totalTimeMinutes = totalTimeSeconds / 60;
        var totalResidualMinutes =
          Math.round((totalTimeMinutes % 1) * 60) < 10
            ? "0" + Math.round((totalTimeMinutes % 1) * 60)
            : Math.round((totalTimeMinutes % 1) * 60);
        var totalTimeMinutesAndSeconds =
          Math.floor(totalTimeMinutes) + ":" + totalResidualMinutes;
        return totalTimeMinutesAndSeconds;
      }
    },
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
    setRepeatSong() {
      if (this.$store.state.currentSong === this.track.title) {
        this.$store.dispatch("setRepeatSong", !this.$store.state.repeatSong);
      }
    },
    setSongPosition(event) {
      if (this.$store.state.currentSong === this.track.title) {
        var myDiv = document.getElementsByClassName("waveform")[0].offsetWidth;
        var position = this.track.duration * (event.offsetX / myDiv);
        this.$store.state.player.seek(position);
        this.$store.dispatch("setCurrentSongTime", position);
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
      if (
        this.$store.state.currentSong === this.track.title &&
        !this.$store.state.isPlaying
      ) {
        this.$store.state.player.play();
        this.currentSongTime();
        this.$store.dispatch("isPlaying", true);
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
  },
  filters: {
    toSentenceCase(value) {
      return value
        .split(" ")
        .map(_.capitalize)
        .join(" ");
    },
    cutTitle(value){
      if(value.length>50){
        return value.split("").splice(0,50).join("") + "...";
      } else {
        return value;
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
  grid-template-rows: 200px 20px minmax(40px, min-content) 30px;
  grid-gap: 5px;
  position: relative;
  //z-index is needed because of shuffle effect and z-index of waveform
  z-index: 4;
}

.artwork-image {
  height: 200px;
  width: 200px;
}

.waveform-container {
  width: 200px;
  cursor: pointer;
  position: relative;
}

.waveform-container-fill-1 {
  background: $color-green-light;
  position: absolute;
  z-index: 2;
  height: 20px;
}

.waveform-container-fill-2 {
  background: $color-grey-medium;
  width: 100%;
  position: absolute;
  height: 20px;
  z-index: 1;
}
.waveform {
  width: 200px;
  height: 20px;
  background: $color-grey-dark;
  position: relative;
  z-index: 3;
}

.title-container {
  margin: 0 5px;
  text-align: center;
}
.title-container p {
  margin: 0;
  font-size: 14px;
  color: $color-grey-light;
}

.song-menu-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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

.play-pause-song-container {
  display: flex;
  align-items: center;
  margin-left: 3px;
}

.repeat-song-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 5px;
}

.song-control-icon-repeat {
  height: 17px;
  width: 17px;
  fill: $color-grey-light;
  cursor: pointer;
}

.song-repeat-on {
  fill: $color-green-light;
}

.song-time {
  color: $color-grey-light;
  font-size: 12px;
  letter-spacing: 1.5px;
  text-align: center;
}

.song-enter {
  opacity: 0;
}

.song-enter-active {
  transition: 0.2s;
}

.song-leave-active {
  opacity: 0;
}
</style>
