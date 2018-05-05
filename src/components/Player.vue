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
    </div>
</template>

<script>
import _ from "lodash";
export default {
  computed: {
    turnOn() {
      if (this.$store.state.currentWave !== "") {
        return {transform:"translateY(0px)", opacity: "1"};
      }
    },
    songPercentage() {

      return (
        this.$store.state.currentSongTime /
          this.$store.state.currentTrackDuration *
          100 +
        "%"
      );
    },
    isPlaying(){
      return this.$store.state.isPlaying;
    }
  },
  methods:{
      setSongPosition(event) {
        var myDiv = document.getElementById("player-track-wave").offsetWidth;
        var position = this.$store.state.currentTrackDuration * (event.offsetX / myDiv);
        this.$store.state.player.seek(position);
        this.$store.dispatch("setCurrentSongTime",position);
      },
      playSong(){
        this.$store.state.player.play();
        this.$store.dispatch("isPlaying", true);
        this.currentSongTime();
      },
      pauseSong(){
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
  opacity:0;
  transition: all 1s;
  display:flex;
  align-items: center;
  z-index:4;
}

.player-track{
    position:relative;
    width:50%;
}
.player-track-fill {
  height: 40px;
  background:$color-green-light;
  position:absolute;
  z-index:5;
}

.player-track-fill-2{
  height: 40px;
  background:$color-grey-medium;
  position:absolute;
  z-index: 4;
  width:100%;
}
#player-track-wave {
  width: 100%;
  height: 40px;
  filter: brightness(14.5%);
  display:block;
  position:relative;
  z-index:6;
}

.player-buttons{
   display:flex;
  align-items: center;
  justify-content: center;
  margin:0 20px;
}
.play-pause-container{
  width: 30px;
  display:flex;
  justify-content: center;
  margin: 0 20px;
  
}

.player-control-icon{
  height:15px;
  width:15px;
  fill: $color-grey-light;
  cursor: pointer;
  margin: 0px 20px;

  &-play{
    height: 30px;
    width: 30px;
    margin:0;
    fill: $color-green-light;
  }
  &-pause{
    height:24px;
    width:24px;
     margin:0;
     fill: $color-green-light;
  }
  &-shuffle{
    height:14px;
    width: 14px;
  }
}

.song2-enter{
opacity:0.5;
transform: translateX(20px) scale(0.5);

}

.song2-enter-active{
  transition: .2s;
}

.song2-leave-active{
transform: translateX(-20px) scale(0.5);
opacity:0;
transition: .2s;
}
</style>
