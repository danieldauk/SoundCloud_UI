import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    player: "",
    tracks: [],
    currentSong: "",
    isPlaying: false
  },
  getters: {},
  mutations: {
    loadTracks(state, payload) {
      state.tracks = payload;
    },
    loadPlayer(state, payload) {
      state.player = payload;
    },
    loadSong(state, payload) {
      state.currentSong = payload;
    },
    isPlaying(state, payload) {
      state.isPlaying = payload;
    }
  },
  actions: {
    loadTracks(context, payload) {
      context.commit("loadTracks", payload);
    },
    loadPlayer(context, payload) {
      context.commit("loadPlayer", payload);
    },
    loadSong(context, payload) {
      context.commit("loadSong", payload);
    },
    isPlaying(context, payload) {
      context.commit("isPlaying", payload);
    }
  }
});
