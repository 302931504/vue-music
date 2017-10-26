<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
      </div>
      <div class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" :data="favorite" class="list-scroll" v-if="currentIndex === 0">
          <div class="list-inner">
            <song-list :songs="favorite" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playHistoryList" :data="playHistory" class="list-scroll" v-if="currentIndex === 1">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="getNoData">
        <no-result :title="getNoDataDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
  import Switches from 'base/switches/switches';
  import SongList from 'base/song-list/song-list';
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import {mapGetters, mapActions} from 'vuex';
  import {playlistMixin} from 'common/js/mixin';
  import Song from 'common/js/song';

  export default {
    mixins: [playlistMixin],
    data () {
      return {
        switches: ['我喜欢的', '最近听的'],
        currentIndex: 0
      };
    },
    computed: {
      getNoData () {
        if (this.currentIndex === 0) {
          return !this.favorite.length;
        } else {
          return !this.playHistory.length;
        }
      },
      getNoDataDesc () {
        if (this.currentIndex === 0) {
          return '亲爱的你还没有喜欢的歌曲呢~';
        } else {
          return '亲爱的你最近还没有听过歌曲呢~';
        }
      },
      ...mapGetters([
        'playHistory',
        'favorite'
      ])
    },
    created () {
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.favoriteList.refresh();
        }
        if (this.currentIndex === 1) {
          this.$refs.playHistoryList.refresh();
        }
      }, 20);
    },
    methods: {
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.listWrapper.style.bottom = bottom;
        this.$refs.favoriteList && this.$refs.favoriteList.refresh();
        this.$refs.playHistoryList && this.$refs.playHistoryList.refresh();
      },
      back () {
        this.$router.back();
      },
      switchItem (index) {
        this.currentIndex = index;
      },
      selectSong (song) {
        this.insertSong(new Song(song));
      },
      random () {
        let list = this.currentIndex === 0 ? this.favorite : this.playHistory;
        if (!list.length) {
          return;
        }
        list = list.map((song) => {
          return new Song(song);
        });
        this.randomPlay({list});
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },
    components: {
      Switches,
      SongList,
      Scroll,
      NoResult
    }
  };
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable";

  .user-center{
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: @color-background;
    &.slide-enter-active, &.slide-leave-active{
      transition: all .3s;
    }
    &.slide-enter, &.slide-leave-to{
      transform: translate3d(100%, 0, 0);
    } 
    .back{
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-back{
        display: block;
        padding: 10px;
        font-size: @font-size-large-x;
        color: @color-theme;
      }
    }
    .switches-wrapper{
      margin: 10px 0 30px 0;
    }
    .play-btn{
      box-sizing: border-box;
      width: 135px;
      padding: 7px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid @color-text-l;
      color: @color-text-l;
      border-radius: 100px;
      font-size: 0;
      .icon-play{
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: @font-size-medium-x;
      }
      .text{
        display: inline-block;
        vertical-align: middle;
        font-size: @font-size-small;
      }
    }
    .list-wrapper{
      position: absolute;
      top: 110px;
      bottom: 0;
      width: 100%;
      .list-scroll{
        height: 100%;
        overflow: hidden;
        .list-inner{
          padding: 20px 30px;
        }
      }
    }
    .no-result-wrapper{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>