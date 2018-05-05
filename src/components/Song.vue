<template>
  <div class="song-container">
    <img 
    class="artwork-image"
    :src="track.artwork_url.replace('large','t500x500')">
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
    // if songPercentage == 100%?
    //clear interval after 100%
    songPercentage() {
      if (this.$store.state.currentSong === this.track.title) {
        if(this.$store.state.currentSongTime +200 < this.track.duration){
          return this.$store.state.currentSongTime / this.track.duration * 100 + "%";
        } else {
          clearInterval(this.$store.state.intervalVariable);
          this.$store.dispatch("isPlaying", false);
            console.log("song finished");
        }  
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
         this.$store.dispatch("setCurrentSongTime",position);
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
      if (this.$store.state.currentSong === this.track.title && !this.$store.state.isPlaying) {
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
  }
};
</script>

<style lang="scss">
@import "../Sass_variables/variables";

.song-container {
  background: $color-grey-dark;
  display: grid;
  grid-template-rows: 200px 20px auto 30px;
  grid-gap: 5px;
}

.artwork-image {
  height: 200px;
  width: 200px;
}

.waveform-container {
  width: 200px;
  cursor: pointer;
  position:relative;
}

.waveform-container-fill-1{
  background: $color-green-light;
  position:absolute;
  z-index: 2;
  height:20px;
}

.waveform-container-fill-2{
  background: $color-grey-medium;
  width:100%;
  position:absolute;
  height:20px;
}
.waveform {
  width: 200px;
  height: 20px;
  filter: brightness(14.5%);
  display: block;
  position:relative;
  z-index: 3;
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
}

.song-enter-active{
  transition: .2s;
}

.song-leave-active{
opacity:0;
}


</style>
