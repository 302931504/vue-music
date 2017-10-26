import {playMode} from 'common/js/config';
import {loadSearches, loadPlays, loadFavorite} from 'common/js/cache';

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searches: loadSearches(),
  playHistory: loadPlays(),
  favorite: loadFavorite()
};
export default state; 
