import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LEN = 15;

const PLAY_KEY = '__play__';
const PLAY_MAX_LEN = 200;

const FAVORITE_KEY = '__favorite__';
const FAVORITE_MAX_LEN = 200;

function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare);
  if (index === 0) {
    return;
  }
  if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}

function deleteOne (arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, []);
  insertArray(searches, query, (item) => {
    return item === query;
  }, SEARCH_MAX_LEN);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function deleteOneSearch (query) {
  let searches = storage.get(SEARCH_KEY, []);
  deleteOne(searches, (item) => {
    return item === query;
  });
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function deleteALL () {
  storage.remove(SEARCH_KEY);
  return [];
}

export function loadSearches () {
  return storage.get(SEARCH_KEY, []);
}

export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, []);
  insertArray(songs, song, (item) => {
    return item.id === song.id;
  }, PLAY_MAX_LEN);
  storage.set(PLAY_KEY, songs);
  return songs;
}

export function loadPlays () {
  return storage.get(PLAY_KEY, []);
}

export function saveFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, []);
  insertArray(songs, song, (item) => {
    return item.id === song.id;
  }, FAVORITE_MAX_LEN);
  storage.set(FAVORITE_KEY, songs);
  return songs; 
}

export function deleteFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, []);
  deleteOne(songs, (item) => {
    return item.id === song.id;
  });
  storage.set(FAVORITE_KEY, songs);
  return songs;
}

export function loadFavorite () {
  return storage.get(FAVORITE_KEY, []);
}