import * as types from './mutation-types';

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAYING_STATE] (state, flag) {
  	state.playing = flag;
  },
  [types.SET_FULL_SCREEN] (state, flag) {
  	state.fullScreen = flag;
  },
  [types.SET_PLAY_LIST] (state, list) {
  	state.playList = list;
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
  	state.sequenceList = list;
  },
  [types.SET_PLAY_MODE] (state, mode) {
  	state.mode = mode;
  },
  [types.SET_CURRENT_INDEX] (state, index) {
  	state.currentIndex = index;
  },
  [types.SET_DISC] (state, disc) {
    state.disc = disc;
  },
  [types.SET_TOPLIST] (state, list) {
    state.topList = list;
  },
  [types.SET_SEARCH_LIST] (state, arr) {
    state.searches = arr;
  },
  [types.SET_PLAY_HISTORY] (state, songs) {
    state.playHistory = songs;
  },
  [types.SET_FAVORITE] (state, songs) {
    state.favorite = songs;
  }
};
export default mutations;
