<template>
    <div 
    :style="{transform:turnOn}"
    class="player-container">
        <div class="player-buttons">
            
        </div>
        <div class="player-track-info"></div>
        <div class="player-track">
            <div 
            :style="{width:songPercentage}"
            class="player-track-fill"></div>
            <img 
            @click="setSongPosition"
            id="player-track-wave"
            :src="this.$store.state.currentWave" >
        </div>
    </div>
</template>

<script>
export default {
  computed: {
    turnOn() {
      if (this.$store.state.currentWave !== "") {
        return "translateY(0)";
      }
    },
    songPercentage() {

      return (
        this.$store.state.currentSongTime /
          this.$store.state.currentTrackDuration *
          100 +
        "%"
      );
    }
  },
  methods:{
      setSongPosition(event) {
        var myDiv = document.getElementById("player-track-wave").offsetWidth;
        var position = this.$store.state.currentTrackDuration * (event.offsetX / myDiv);
        this.$store.state.player.seek(position);
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
  transition: 1s;
}

.player-track{
    position:relative;
    width:50%;
}
.player-track-fill {
  height: 40px;
  background:$color-green-light;
  position:absolute;
}
#player-track-wave {
  width: 100%;
  height: 40px;
  filter: brightness(14.5%);
}
</style>
