import {playMode} from 'common/js/config';
import {mapGetters, mapMutations, mapActions} from 'vuex';
import {shuffle} from 'common/js/util';

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playList);
  },
  activated () {
    this.handlePlaylist(this.playList);
  },
  watch: {
    playList (newVal) {
      this.handlePlaylist(newVal);
    }
  },
  methods: {
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method');
    }
  }
};

export const playerMixin = {
  computed: {
    modeIcon () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    },
    ...mapGetters([
      'sequenceList',
      'playList',
      'currentSong',
      'mode',
      'favorite'
    ])
  },
  methods: {
    changeMode () {
      let mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetSongIndex(list);
      this.setPlayList(list);
    },
    resetSongIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentInsex(index);
    },
    toggleFavorite (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteSongs(song);
      } else {
        this.saveFavoriteSongs(song);
      }
    },
    getFavorite (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite';
      } else {
        return 'icon-not-favorite';
      }
    },
    isFavorite (song) {
      const index = this.favorite.findIndex((item) => {
        return item.id === song.id;
      });
      return index > -1;
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setCurrentInsex: 'SET_CURRENT_INDEX',
      setPlayList: 'SET_PLAY_LIST',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'saveFavoriteSongs',
      'deleteFavoriteSongs'
    ])
  }
};

export const searchMixin = {
  data () {
    return {
      query: '',
      refreshDelay: 100
    };
  },
  computed: {
    ...mapGetters([
      'searches'
    ])
  },
  methods: {
    addQuery (val) {
      this.$refs.searchBox.addQuery(val);
    },
    onChangequery (query) {
      this.query = query;
    },
    blur () {
      this.$refs.searchBox.blur();
    },
    saveSearch () {
      this.saveSearchHistory(this.query);
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteOneSearchHistory'
    ])
  }
};