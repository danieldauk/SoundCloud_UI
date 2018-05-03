<template>
  <div
  @click="playSong">
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
            this.$store.state.player = myPlayer;
            this.$store.state.player.play();
            this.$store.state.currentSong = this.track.title
          }.bind(this)
        );
    }
  }
};
</script>