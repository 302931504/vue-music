<template>
  <scroll class="suggest" :data="result" :pullup="pullup" @scrollToEnd="scrollToEnd" ref="suggest" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="clickItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore && query" title=''></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length && query">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>
<script>
  import {search} from 'api/search';
  import {createSong} from 'common/js/song';
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import Singer from 'common/js/singer';
  import {mapMutations, mapActions} from 'vuex';
  import NoResult from 'base/no-result/no-result';

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      zhida: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      query (newVal) {
        this._searchQuery();
      }
    },
    data () {
      return {
        page: 1,
        result: [],
        pullup: true,
        hasMore: true
      };
    },
    methods: {
      refresh () {
        this.$refs.suggest.refresh();
      },
      getIconCls (item) {
        if (item.types === 'singer') {
          return 'icon-mine';
        } else {
          return 'icon-music';
        }
      },
      getDisplayName (item) {
        if (item.types === 'singer') {
          return item.singername;
        } else {
          return `${item.name}-${item.singer}`;
        }
      },
      scrollToEnd () {
        if (!this.hasMore) {
          return;
        }
        this.page++;
        search(this.query, this.page, this.showSinger).then((res) => {
          if (res.code === 0) {
            this.result = this.result.concat(this._handleData(res.data));
            this._checkMore(res.data);
          }
        });
      },
      clickItem (item) {
        if (item.types === 'singer') {
          let singer = new Singer({
            id: item.singermid, 
            name: item.singername
          });
          this.$router.push({
            path: `/search/${singer.id}`
          });
          this.setSinger(singer);
        } else {
          this.insertSong(item);
        }
        this.$emit('select');
      },
      listScroll () {
        this.$emit('listScroll');
      },
      _searchQuery () {
        this.page = 1;
        this.$refs.suggest.scrollTo(0, 0);
        this.hasMore = true;
        search(this.query, this.page, this.zhida).then(res => {
          if (res.code === 0) {
            this.result = this._handleData(res.data);
            this._checkMore(res.data);
          }
        });
      },
      _checkMore (data) {
        const song = data.song;
        if (!song.list.length || (song.curnum + song.curpage * 20) > song.totalnum) {
          this.hasMore = false;
        }
      },
      _handleData (data) {
        let ret = [];
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{types: 'singer'}});
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list));
        }
        return ret;
      },
      _normalizeSongs (list) {
        let ret = [];
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  };
</script>
<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .suggest{
    height: 100%;
    overflow: hidden;
    .suggest-list{
      padding: 0 30px;
      .suggest-item{
        display: flex;
        align-item: center;
        padding-bottom: 20px;
      }
      .icon{
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"]{
          font-size: 14px;
          color: @color-text-d;
        }
      }
      .name{
        flex: 1;
        font-size: @font-size-medium;
        color: @color-text-d;
        overflow: hidden;
        .text{
          #no-wrap();
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