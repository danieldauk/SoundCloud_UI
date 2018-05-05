<template>
    <div 
    :style="turnOn"
    class="player-container">
        <div class="player-buttons">
          
            <svg
            @click="shuffleSongs"
            class="player-control-icon player-control-icon-shuffle">
              <use xlink:href="../src/svg/sprite.svg#icon-shuffle"/>
            </svg>
            <svg
            class="player-control-icon player-control-icon-previous">
              <use xlink:href="../src/svg/sprite.svg#icon-controller-jump-to-start"/>
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
              <use xlink:href="../src/svg/sprite.svg#icon-controller-play"/>
            </svg>


              <svg
             v-if="isPlaying"
            key="pause" 
            @click="pauseSong"
            class="player-control-icon player-control-icon-pause">
              <use xlink:href="../src/svg/sprite.svg#icon-controller-paus"/>
            </svg>
            </transition>
            </div>
            
          
            <svg
            class="player-control-icon player-control-icon-next">
              <use xlink:href="../src/svg/sprite.svg#icon-controller-next"/>
            </svg>
            <svg
            @click="setRepeat"
            :class="{activeRepeat: $store.state.repeatOn}"
            class="player-control-icon player-control-icon-repeat">
              <use xlink:href="../src/svg/sprite.svg#icon-cycle"/>
            </svg>
        </div>
        <div class="player-track-info"></div>
        <div class="player-track">
            <div 
            :style="{width:songPercentage}"
            class="player-track-fill"></div>
            <div 
            class="player-track-fill-2"></div>
            <img 
            @click="setSongPosition"
            id="player-track-wave"
            :src="this.$store.state.currentWave" >
        </div>
        <div
        class="player-volume"
        >
          <div 
          @click="setVolume"
          id="volume-bar">
              <div 
              :style="{width: volume}"
              class="volume-bar-fill"></div>
          </div>
          

        </div>
    </div>
</template>

<script>
import _ from "lodash";
export default {
  computed: {
    volume(){
      return this.$store.state.volume*100 + "%";
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
        //rewind song to 0 and pause. To play again if play is clicked;
        this.$store.state.player.pause();
        this.$store.state.player.seek(0);

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
    isPlaying() {
      return this.$store.state.isPlaying;
    }
  },
  methods: {
    setVolume(){
       var myDiv = document.getElementById("volume-bar").offsetWidth;
       var position = (event.offsetX / myDiv);
       this.$store.state.player.setVolume(position);
       this.$store.dispatch("setVolume", position);
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
    }
  }
};
</script>

<style lang="scss">
@import "../Sass_variables/variables";
.player-container {
  position: fixed;
  height: 50px;
  width: 100%;
  background: $color-grey-dark;
  top: calc(100vh - 50px);
  left: 0;
  transform: translateY(50px);
  opacity: 0;
  transition: all 1s;
  display: flex;
  align-items: center;
  z-index: 4;
}

.player-track {
  position: relative;
  width: 50%;
}
.player-track-fill {
  height: 40px;
  background: $color-green-light;
  position: absolute;
  z-index: 5;
}

.player-track-fill-2 {
  height: 40px;
  background: $color-grey-medium;
  position: absolute;
  z-index: 4;
  width: 100%;
}
#player-track-wave {
  width: 100%;
  height: 40px;
  filter: brightness(14.5%);
  display: block;
  position: relative;
  z-index: 6;
}

.player-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 20px;
}
.play-pause-container {
  width: 30px;
  display: flex;
  justify-content: center;
  margin: 0 20px;
}

.player-control-icon {
  height: 15px;
  width: 15px;
  fill: $color-grey-light;
  cursor: pointer;
  margin: 0px 20px;

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

.player-volume{
    margin-left: auto;
    margin-right: 30px;
}


#volume-bar{
  height:5px;
  width: 100px;
  border-radius:10px;
  background: $color-grey-medium;
  position: relative;
    overflow:hidden;
}

.volume-bar-fill{
  height:100%;
  width:20%;
  position:absolute;
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
</style>
