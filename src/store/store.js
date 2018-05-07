import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    player: "",
    tracks: [],
    currentSong: "",
    isPlaying: false,
    currentSongTime: 0,
    currentTrackDuration: 0,
    intervalVariable: "",
    currentWave: "",
    currentPlaylist: {},
    repeatOn: true,
    repeatSong: false,
    volume: 0.5,
    currentQueryTerm: "",
    headerFetching: false

  },
  getters: {},
  mutations: {
    loadTracks(state, payload) {
      state.tracks = payload.array;
      state.currentPlaylist = payload.playlist;
    },
    loadPlayer(state, payload) {
      state.player = payload;
    },
    loadSong(state, payload) {
      state.currentSong = payload;
    },
    isPlaying(state, payload) {
      state.isPlaying = payload;
    },
    setCurrentSongTime(state, payload) {
      state.currentSongTime = payload;
    },
    setInterval(state, payload) {
      state.intervalVariable = payload;
    },
    setCurrentWave(state, payload){
        state.currentWave = payload;
    },
    setCurrentTrackDuration(state, payload){
        state.currentTrackDuration = payload;
    },
    setRepeat(state, payload){
      state.repeatOn = payload;
    },
    setVolume(state, payload){
      state.volume = payload;
    },
    setRepeatSong(state, payload){
      state.repeatSong = payload;
    },
    setQueryTerm(state, payload){
      state.currentQueryTerm = payload;
    },
    setHeaderFetching(state, payload){
      state.headerFetching = payload;
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
    },
    setCurrentSongTime(context, payload) {
      context.commit("setCurrentSongTime", payload);
    },
    setInterval(context, payload) {
      context.commit("setInterval", payload);
    },
    setCurrentWave(context, payload){
        context.commit("setCurrentWave", payload);
    },
    setCurrentTrackDuration(context, payload){
        context.commit("setCurrentTrackDuration", payload);
    },
    setRepeat(context, payload){
      context.commit("setRepeat", payload);
    },
    setVolume(context, payload){
      context.commit("setVolume", payload);
    },
    setRepeatSong(context, payload){
      context.commit("setRepeatSong", payload);
    },
    setQueryTerm(context, payload){
      context.commit("setQueryTerm", payload);
    },
    setHeaderFetching(context, payload){
      context.commit("setHeaderFetching", payload);
    }
  }
});
