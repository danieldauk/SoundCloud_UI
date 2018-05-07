<template>
<div
class="songs-container">
    <div 
    v-show="!content"
    style="color:red"
    class="spinner">
      <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
    <div 
     v-show="content"
     class="songs">
       <transition-group
   tag="div"
   class="transition-container"
   name="tracks">
   
        <app-song 
        v-for="track in tracks" :track="track"
        :key="track.id"></app-song>
        <div 
        class="song-spinner"
        key="song-spinner"
        v-if="fetching"> 
        <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
   </transition-group>
  <div class="load-more">
    <button 
    @click="loadMore"
    class="load-more-button"
    >Load more</button>
  </div>
    </div>
  
</div>
</template>

<script>
import Song from "./Song.vue";

export default {
  data() {
    return {
      contentShowed: false,
      isFetching: false
    };
  },
  computed: {
    tracks() {
      return this.$store.state.tracks;
    },
    content() {
      return this.contentShowed;
    },
    fetching() {
      return this.isFetching;
    },
    headerFetching() {
      return this.$store.state.headerFetching;
    }
  },
  watch: {
    headerFetching() {
      if (this.headerFetching === true) {
        this.showContent(false);
      } else {
        this.showContent(true);
      }
    }
  },
  methods: {
    showContent(value) {
      this.contentShowed = value;
    },
    fetchingData(value) {
      console.log("fetch");
      this.isFetching = value;
    },
    loadMore() {
      if (this.$store.state.currentQueryTerm === "") {
        this.fetchingData(true);
        SC.get("playlists/89657406", {
          limit: this.$store.state.tracks.length + 8
        }).then(
          function(playlist) {
            var tracksArray = this.$store.state.tracks;
            var currentPlaylist = this.$store.state.currentPlaylist;
            var payload = {};
            for (
              var i = this.$store.state.tracks.length;
              i < playlist.tracks.length;
              i++
            ) {
              tracksArray.push(playlist.tracks[i]);
              currentPlaylist[playlist.tracks[i].title] = i;
            }
            payload.array = tracksArray;
            payload.playlist = currentPlaylist;
            this.$store.dispatch("loadTracks", payload);
            //disable spinner
            this.fetchingData(false);
          }.bind(this)
        );
      } else {
        this.fetchingData(true);
        SC.get("/tracks", {
          q: this.$store.state.currentQueryTerm,
          limit: this.$store.state.tracks.length + 8
        }).then(
          function(playlist) {
            var tracksArray = this.$store.state.tracks;
            var currentPlaylist = this.$store.state.currentPlaylist;
            var payload = {};
            for (
              var i = this.$store.state.tracks.length;
              i < playlist.length;
              i++
            ) {
              tracksArray.push(playlist[i]);
              currentPlaylist[playlist[i].title] = i;
            }
            payload.array = tracksArray;
            payload.playlist = currentPlaylist;
            this.$store.dispatch("loadTracks", payload);
            this.fetchingData(false);
          }.bind(this)
        );
      }
    }
  },
  created() {
    SC.get("playlists/89657406", { limit: 8 }).then(
      function(playlist) {
        var tracksArray = [];
        var currentPlaylist = {};
        var payload = {};
        for (var i = 0; i < playlist.tracks.length; i++) {
          tracksArray.push(playlist.tracks[i]);
          currentPlaylist[playlist.tracks[i].title] = i;
        }
        payload.array = tracksArray;
        payload.playlist = currentPlaylist;
        this.$store.dispatch("loadTracks", payload);
        this.showContent(true);
      }.bind(this)
    );
  },
  components: {
    appSong: Song
  }
};
</script>

<style lang="scss">
@import "../Sass_variables/variables";

.transition-container {
  display: grid;
  grid-gap: 20px;
  justify-content: center;
  grid-template-columns: repeat(4, 200px);
  grid-auto-rows: min-content;
}

.songs-container {
  min-height: calc(100vh - 120px);
  padding-bottom: 60px;
  padding-top: 10px;
  background-color: $color-grey-medium;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.load-more {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.load-more-button {
  background: $color-green-dark;
  border-radius: 20px;
  font-size: 14px;
  color: $color-white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  outline: none;
}

.song-spinner {
  grid-column: 1/5;
  display: flex;
  justify-content: center;
  align-items: center;
}
//spinner animation ->
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 37px;
}
.lds-ellipsis div {
  position: absolute;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: $color-green-dark;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 6px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 6px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 26px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 45px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(19px, 0);
  }
}

//<-spinner animation
.tracks-move {
  transition: 1s;
}

@media (max-width: 900px) {
  .transition-container {
    grid-template-columns: repeat(3, 200px);
  }
  .song-spinner {
    grid-column: 1/4;
  }
}

@media (max-width: 800px) {
  .songs-container {
  min-height: calc(100vh - 230px);
  padding-bottom: 160px;
  }
}

@media (max-width: 700px) {
  .transition-container {
    grid-template-columns: repeat(2, 200px);
  }
  .song-spinner {
    grid-column: 1/3;
  }
}

@media (max-width: 450px) {
  .transition-container {
    grid-template-columns: 200px;
  }
  .song-spinner {
    grid-column: 1/2;
  }
}
</style>
