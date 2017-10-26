import * as types from './mutation-types';
import {shuffle} from 'common/js/util';
import {playMode} from 'common/js/config';
import {saveSearch, deleteOneSearch, deleteALL, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache';

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id;
  });
} 

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list);
  /* if (state.mode === playMode.random) {
    let randomList = shuffle(list);
    commit(types.SET_PLAY_LIST, randomList);
    index = setIndex(randomList, list[index]); 
  } else { */
    commit(types.SET_PLAY_LIST, list);
  // } 
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const randomPlay = function ({commit}, {list}) {
   commit(types.SET_PLAY_MODE, playMode.random);
   commit(types.SET_SEQUENCE_LIST, list);
   let randomList = shuffle(list);
   commit(types.SET_PLAY_LIST, randomList);
   commit(types.SET_CURRENT_INDEX, 0);
   commit(types.SET_FULL_SCREEN, true);
   commit(types.SET_PLAYING_STATE, true);
};

export const insertSong = function ({commit, state}, song) {
  let playList = state.playList.slice(); // 创建一个playList的副本
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  let currentSong = playList[currentIndex]; // 记录当前播放歌曲
  let fpIndex = findIndex(playList, song); // 查找当前播放列表是否存在待插入歌曲
  currentIndex++; // 当前播放歌曲的索引+1将为待插入歌曲在播放列表的索引
  playList.splice(currentIndex, 0, song); // 插入歌曲到当前位置
  if (fpIndex > -1) {
    if (fpIndex < currentIndex) {
      playList.splice(fpIndex, 1);
      currentIndex--;
    } else {
      playList.splice(fpIndex + 1, 1);
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1;
  let fsIndex = findIndex(sequenceList, song);
  sequenceList.splice(currentSIndex, 0, song);

  if (fsIndex > -1) {
    if (fsIndex < currentSIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  } 

  commit(types.SET_PLAY_LIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const deleteSong = function ({commit, state}, song) {
  let playList = state.playList.slice(); // 创建一个playList的副本
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  let PIndex = findIndex(playList, song);
  playList.splice(PIndex, 1);
  let SIndex = findIndex(sequenceList, song);
  sequenceList.splice(SIndex, 1);

  if (currentIndex > PIndex || currentIndex === playList.length) {
    currentIndex--;
  }

  commit(types.SET_PLAY_LIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);

  const playingState = playList.length > 0;
  commit(types.SET_PLAYING_STATE, playingState);
};

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_LIST, saveSearch(query));
};

export const deleteOneSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_LIST, deleteOneSearch(query));
};

export const deleteALLSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_LIST, deleteALL());
};

export const clearPlaylist = function ({commit}) {
  commit(types.SET_PLAY_LIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_CURRENT_INDEX, -1);
  commit(types.SET_PLAYING_STATE, false);
};

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song));
};

export const saveFavoriteSongs = function ({commit}, song) {
  commit(types.SET_FAVORITE, saveFavorite(song));
};

export const deleteFavoriteSongs = function ({commit}, song) {
  commit(types.SET_FAVORITE, deleteFavorite(song));
};
