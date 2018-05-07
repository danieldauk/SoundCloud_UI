<template>
  <div class="header"> 
      <div class="soundcloud-logo-container">
          <svg
            class="soundcloud-logo">
              <use xlink:href="../src/svg/sprite.svg#icon-soundcloud"/>
            </svg>
      </div>
      <div class="header-search">
        <input
        class="search-input"
        @change="searchSong"
        placeholder="Search"
       type="text">
      </div>
      

  </div>
</template>

<script>
export default {
  methods: {
    searchSong(event) {
      this.$store.dispatch("setHeaderFetching", true);
      //delete current songs array and playlist to prevent animation stacking
      this.$store.dispatch("loadTracks", {array:[], playlist:{}});

      if (event.target.value === "") {
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
            //update query term in store
            this.$store.dispatch("setQueryTerm", "");
            //disable spinner in songs component
            this.$store.dispatch("setHeaderFetching", false);
          }.bind(this)
        );
      } else {
        this.$store.dispatch("setHeaderFetching", true);
        SC.get("/tracks", {
          q: event.target.value,
          limit: 8
        }).then(
          function(playlist) {
            var tracksArray = [];
            var currentPlaylist = {};
            var payload = {};
            for (var i = 0; i < playlist.length; i++) {
              tracksArray.push(playlist[i]);
              currentPlaylist[playlist[i].title] = i;
            }

            payload.array = tracksArray;
            payload.playlist = currentPlaylist;

            this.$store.dispatch("loadTracks", payload);

            //update query term in store
            this.$store.dispatch("setQueryTerm", event.target.value);
            //disable spinner in songs component
            this.$store.dispatch("setHeaderFetching", false);
          }.bind(this)
        );
      }
    }
  }
};
</script>

<style lang="scss">
@import "../Sass_variables/variables";
.header {
  background: $color-grey-dark;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.soundcloud-logo-container {
  margin-right: auto;
  display: flex;
  align-items: center;
}

.header-search {
  display: flex;
}

.soundcloud-logo {
  fill: $color-grey-light;
  width: 40px;
  height: 40px;
}

.search-input {
  border: none;
  border-bottom: 1px solid $color-grey-medium;
  background: none;
  color: $color-grey-light;
  font-size: 20px;
  font-family: roboto;
  font-weight: 300;
  outline: none;
  &::-webkit-input-placeholder {
    font-weight: 300;
    font-family: roboto;
  }
}
.search-icon {
  width: 20px;
  height: 20px;
  fill: $color-grey-medium;
}
</style>
