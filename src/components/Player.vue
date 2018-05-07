<template>
    <div 
    :style="turnOn"
    class="player-container">
        <div class="player-buttons">
          
            <svg
            @click="shuffleSongs"
            class="player-control-icon player-control-icon-shuffle">
              <use xlink:href="src/svg/sprite.svg#icon-shuffle"/>
            </svg>
            <svg
            @click="playNextPrev(-1)"
            class="player-control-icon player-control-icon-previous">
              <use xlink:href="src/svg/sprite.svg#icon-controller-jump-to-start"/>
            </svg>
          
            <div 
            class="play-pause-container">
            <transition
            name="song2"
            mode="out-in"
            >
              <svg 
              v-if="!isPlaying"
              key="play"
              @click="playSong"
            class="player-control-icon player-control-icon-play">
              <use xlink:href="src/svg/sprite.svg#icon-controller-play"/>
            </svg>


              <svg
             v-if="isPlaying"
            key="pause" 
            @click="pauseSong"
            class="player-control-icon player-control-icon-pause">
              <use xlink:href="src/svg/sprite.svg#icon-controller-paus"/>
            </svg>
            </transition>
            </div>
            
          
            <svg
            @click="playNextPrev(1)"
            class="player-control-icon player-control-icon-next">
              <use xlink:href="src/svg/sprite.svg#icon-controller-next"/>
            </svg>
            <svg
            @click="setRepeat"
            :class="{activeRepeat: $store.state.repeatOn}"
            class="player-control-icon player-control-icon-repeat">
              <use xlink:href="src/svg/sprite.svg#icon-cycle"/>
            </svg>
        </div>
        <div class="track-name-container">

        <div class="player-track">
              <div 
              :style="{width:songPercentage}"
              class="player-track-fill"></div>
              <div 
              class="player-track-fill-2"></div>
              <div 
              @click="setSongPosition"
              :style="{'-webkit-mask-box-image': 'url(' +this.$store.state.currentWave +')'}" 
              id="player-track-wave">
              
              </div>
              
            </div>
            <div class="player-track-info">{{$store.state.currentSong}}</div>
        </div>
        <div class="time-volume-container">
          <div class="player-time">
           {{songTime}}
          </div>
        <div
        class="player-volume"
        >

          <range-slider
            class="slider"
            min="0"
            max="1"
            step="0.01"
            :value="volume"
            @input="setVolume">
         </range-slider>
        </div>
        </div>
        
    </div>
</template>

<script>
import RangeSlider from "vue-range-slider";
import "vue-range-slider/dist/vue-range-slider.css";

import _ from "lodash";
export default {
  computed: {
    volume() {
      return this.$store.state.volume;
    },
    turnOn() {
      if (this.$store.state.currentWave !== "") {
        return { transform: "translateY(0px)", opacity: "1" };
      }
    },
    songPercentage() {
      if (
        this.$store.state.currentSongTime + 200 <
        this.$store.state.currentTrackDuration
      ) {
        return (
          this.$store.state.currentSongTime /
            this.$store.state.currentTrackDuration *
            100 +
          "%"
        );
      } else {
        return "song finished";
      }
    },
    songTime() {
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
    },
    isPlaying() {
      return this.$store.state.isPlaying;
    }
  },
  watch: {
    songPercentage: function() {
      if (this.songPercentage === "song finished") {
        this.autoPlayNext();
      }
    }
  },
  methods: {
    setVolume(value) {
      this.$store.state.player.setVolume(value);
      this.$store.dispatch("setVolume", value);
    },
    setSongPosition(event) {
      var myDiv = document.getElementById("player-track-wave").offsetWidth;
      var position =
        this.$store.state.currentTrackDuration * (event.offsetX / myDiv);
      this.$store.state.player.seek(position);
      this.$store.dispatch("setCurrentSongTime", position);
    },
    playSong() {
      this.$store.state.player.play();
      this.$store.dispatch("isPlaying", true);
      this.currentSongTime();
    },
    pauseSong() {
      this.$store.state.player.pause();
      this.$store.dispatch("isPlaying", false);
      clearInterval(this.$store.state.intervalVariable);
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
    shuffleSongs() {
      var tracksArray = this.$store.state.tracks;
      var currentPlaylist = {};
      var payload = {};
      tracksArray = _.shuffle(tracksArray);

      for (var i = 0; i < tracksArray.length; i++) {
        currentPlaylist[tracksArray[i].title] = i;
      }
      payload.array = tracksArray;
      payload.playlist = currentPlaylist;
      this.$store.dispatch("loadTracks", payload);
    },
    setRepeat() {
      this.$store.dispatch("setRepeat", !this.$store.state.repeatOn);
    },
    autoPlayNext() {
      //rewind the last song to 0 and pause. To play again if play is clicked ;
      this.$store.state.player.pause();
      this.$store.state.player.seek(0);
      if (this.$store.state.repeatSong) {
        this.$store.state.player.play();
      } else {
        clearInterval(this.$store.state.intervalVariable);
        this.$store.dispatch("isPlaying", false);
        /* play next song*/

        //check if end of playlist
        var currentSong = this.$store.state.currentPlaylist[
          this.$store.state.currentSong
        ];
        if (currentSong === this.$store.state.tracks.length - 1) {
          if (this.$store.state.repeatOn) {
            var myPlayer;
            var nextSong = this.$store.state.tracks[0];
            SC.stream("/tracks/" + nextSong.id)
              .then(function(player) {
                myPlayer = player;
              })
              .then(
                function() {
                  this.$store.dispatch("loadPlayer", myPlayer);
                  this.$store.dispatch("loadSong", nextSong.title);
                  this.$store.dispatch("isPlaying", true);
                  this.$store.dispatch(
                    "setCurrentTrackDuration",
                    nextSong.duration
                  );
                  this.$store.dispatch("setCurrentWave", nextSong.waveform_url);
                  this.$store.state.player.play();
                  this.currentSongTime();
                }.bind(this)
              );
          }
        } else {
          var myPlayer;
          var nextSong = this.$store.state.tracks[
            this.$store.state.currentPlaylist[this.$store.state.currentSong] + 1
          ];
          SC.stream("/tracks/" + nextSong.id)
            .then(function(player) {
              myPlayer = player;
            })
            .then(
              function() {
                this.$store.dispatch("loadPlayer", myPlayer);
                this.$store.dispatch("loadSong", nextSong.title);
                this.$store.dispatch("isPlaying", true);
                this.$store.dispatch(
                  "setCurrentTrackDuration",
                  nextSong.duration
                );
                this.$store.dispatch("setCurrentWave", nextSong.waveform_url);
                this.$store.state.player.play();
                this.currentSongTime();
              }.bind(this)
            );
        }
      }
    },
    playNextPrev(prevOrNext) {
      clearInterval(this.$store.state.intervalVariable);
      this.$store.dispatch("isPlaying", false);

      /* turn off repeat song*/
      this.$store.dispatch("setRepeatSong", false);
      //check if end of playlist
      var currentSong = this.$store.state.currentPlaylist[
        this.$store.state.currentSong
      ];

      if (
        currentSong === this.$store.state.tracks.length - 1 &&
        prevOrNext === 1
      ) {
        var nextSong = this.$store.state.tracks[0];
      } else if (
        this.$store.state.currentPlaylist[this.$store.state.currentSong] +
          prevOrNext <
        0
      ) {
        var nextSong = this.$store.state.tracks[
          this.$store.state.tracks.length - 1
        ];
      } else {
        var nextSong = this.$store.state.tracks[
          this.$store.state.currentPlaylist[this.$store.state.currentSong] +
            prevOrNext
        ];
      }
      var myPlayer;
      SC.stream("/tracks/" + nextSong.id)
        .then(function(player) {
          myPlayer = player;
        })
        .then(
          function() {
            this.$store.dispatch("loadPlayer", myPlayer);
            this.$store.dispatch("loadSong", nextSong.title);
            this.$store.dispatch("isPlaying", true);
            this.$store.dispatch("setCurrentTrackDuration", nextSong.duration);
            this.$store.dispatch("setCurrentWave", nextSong.waveform_url);
            this.$store.state.player.play();
            this.currentSongTime();
          }.bind(this)
        );
    }
  },
  components: {
    RangeSlider
  }
};
</script>

<style lang="scss">
@import "../Sass_variables/variables";

$slider-height: 10px;
$slider-width: 100px;
$rail-height: 4px;
$knob-size: 10px;
$rail-color: $color-grey-medium;
$rail-fill-color: $color-green-light;
$knob-color: $color-green-light;
$knob-border: none;
$knob-shadow: 1px 1px rgba(0, 0, 0, 0.2);
@import "~vue-range-slider/dist/vue-range-slider.scss";

.player-container {
  position: fixed;
  height: 50px;
  width: 100%;
  background: $color-grey-dark;
  bottom: 0;
  left: 0;
  transform: translateY(50px);
  opacity: 0;
  transition: all 1s;
  display: grid;
  grid-template-columns: 20% 60% 20%;
  align-items: center;
  z-index: 4;
}

.track-name-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.player-track-info {
  height: auto;
  font-size: 11px;
  color: $color-grey-light;
  display: flex;
  align-items: flex-end;
}

.player-track {
  position: relative;
  width: calc(100% - 40px);
  margin: 5px 20px 0;
}
.player-track-fill {
  height: 30px;
  background: $color-green-light;
  position: absolute;
  z-index: 5;
}

.player-track-fill-2 {
  height: 30px;
  background: $color-grey-medium;
  position: absolute;
  z-index: 4;
  width: 100%;
}

#player-track-wave {
  background: $color-grey-dark;
  height: 30px;
  width: 100%;
  position: absolute;
  z-index: 6;
}

.player-buttons {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-around;
}
.play-pause-container {
  width: 30px;
  display: flex;
  justify-content: center;
}

.player-control-icon {
  height: 15px;
  width: 15px;
  fill: $color-grey-light;
  cursor: pointer;

  &-play {
    height: 30px;
    width: 30px;
    margin: 0;
    fill: $color-green-light;
  }
  &-pause {
    height: 24px;
    width: 24px;
    margin: 0;
    fill: $color-green-light;
  }
  &-shuffle {
    height: 14px;
    width: 14px;
  }
}

.activeRepeat {
  fill: $color-green-light;
}

.time-volume-container {
  display: flex;
  justify-content: space-between;
}

.player-time {
  color: $color-grey-light;
  letter-spacing: 1.5px;
  font-size: 14px;
}

.player-volume {
  margin: 0 auto;
}

#volume-bar {
  height: 5px;
  width: 100px;
  border-radius: 10px;
  background: $color-grey-medium;
  position: relative;
  overflow: hidden;
}

.volume-bar-fill {
  height: 100%;
  width: 20%;
  position: absolute;
  background: $color-green-light;
}

.song2-enter {
  opacity: 0.5;
  transform: translateX(20px) scale(0.5);
}

.song2-enter-active {
  transition: 0.2s;
}

.song2-leave-active {
  transform: translateX(-20px) scale(0.5);
  opacity: 0;
  transition: 0.2s;
}

@media (max-width: 800px) {
  .player-container {
    background: $color-grey-dark;
    bottom: 0;
    height: 120px;
    grid-template-columns: auto;
    grid-row-gap: 5px;
    grid-template-rows: 30px 50px 25px;
  }
  .player-track-info{
  }

  .time-volume-container {
    display: flex;
    justify-content: space-around;
  }

  .player-time {
  }

  .player-volume {
    margin: 0;
  }
}
</style>
