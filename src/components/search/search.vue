<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onChangequery"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll ref="shortcut" class="shortcut" :data="shortcut" :refreshDelay="refreshDelay">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKeys">{{item.k}}</li>
            </ul>
          </div>
          <div class="search-history"  v-show="searches.length > 0">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searches" @selectOne="addQuery" @deleteOne="deleteOneSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest ref="suggest" :query="query" @listScroll="blur" @select="saveSearch"></suggest>
    </div> 
    <confirm ref="confirm" @sure="sure" text="确定清空历史记录吗"></confirm>
    <router-view></router-view>
  </div>
</template>
<script>
  import SearchBox from 'base/search-box/search-box';
  import Suggest from 'components/suggest/suggest';
  import SearchList from 'base/search-list/search-list';
  import Confirm from 'base/confirm/confirm';
  import Scroll from 'base/scroll/scroll';
  import {getHotKey} from 'api/search';
  import {mapActions} from 'vuex';
  import {playlistMixin, searchMixin} from 'common/js/mixin'; 

  export default {
    mixins: [playlistMixin, searchMixin],
    data () {
      return {
        hotKeys: []
      };
    },
    computed: {
      shortcut () {
        return this.hotKeys.concat(this.searches);
      }
    },
    created () {
      this._getHotKey();
    },
    methods: {
      handlePlaylist (playlist) {
        let bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.shortcutWrapper.style.bottom = bottom;
        this.$refs.shortcut.refresh(); 

        this.$refs.searchResult.style.bottom = bottom;
        this.$refs.suggest.refresh();
      },
      _getHotKey () {
        getHotKey().then((res) => {
          if (res.code === 0) {
            this.hotKeys = res.data.hotkey.splice(0, 10);
          }
        });
      },
      sure () {
        this.deleteALLSearchHistory();
      },
      showConfirm () {
        this.$refs.confirm.show();
      },
      ...mapActions([
        'deleteALLSearchHistory'
      ])
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    },
    watch: {
      query () {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    }
  };
</script>
<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .search{
    .search-box-wrapper{
      margin: 20px;
    }
    .shortcut-wrapper{
      position: fixed;
      top: 178px;
      bottom: 0;
      width: 100%;
      .shortcut{
        height: 100%;
        overflow: hidden;
        .hot-key{
          margin: 0 20px 20px 20px;
          .title{
            margin-bottom: 20px;
            font-size: @font-size-medium;
            color: @color-text-l
          }
          .item{
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: @color-highlight-background;
            font-size: @font-size-medium;
            color: @color-text-d;
          }
        }
        .search-history{
          position: relative;
          margin: 0 20px;
          .title{
            display: flex;
            align-items: center;
            height: 40px;
            font-size: @font-size-medium;
            color: @color-text-l;
            margin-bottom: 10px;
            .text{
              flex: 1;
            }
            .clear{
              #extend-click();
              .icon-clear{
                font-size: @font-size-medium;
                color: @color-text-d;
              }
            }
          } 
        }
      }
    }
    .search-result{
      position: fixed;
      width: 100%;
      top: 178px;
      bottom: 0;
    }
  }
</style>