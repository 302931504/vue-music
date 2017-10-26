<template>
  <div class="recommend" ref="recommends">
    <scroll :data="discList" class="recommend-content" ref="scroll">
      <div>
        <div class="slider-wrapper">
          <slider v-if="recommends.length > 0">
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img  @load="loadImg" :src="item.picUrl"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌曲推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="item in discList" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loadingWrapper" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
  import {getRecommend, getDiscList} from 'api/getRecommend';
  import Slider from 'base/slider/slider';
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import {playlistMixin} from 'common/js/mixin';
  import {mapMutations} from 'vuex';

  export default {
    mixins: [playlistMixin],
    data () {
      return {
        recommends: [],
        discList: []
      };
    },
    created () {
      this._getRecommend();
      this._getDiscList();
    },
    methods: {
      handlePlaylist (playlist) {
        let bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.recommends.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === 0) {
            this.recommends = res.data.slider;
          }
        });
      },
      _getDiscList () {
        getDiscList().then((res) => {
          if (res.code === 0) {
            this.discList = res.data.list;
          }
        }).catch(err => err);
      },
      loadImg () {
        if (!this.haveload) {
          this.$refs.scroll.refresh();
          this.haveload = true;
        }
      },
      selectItem (item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        });
        this.setDisc(item);
      },
      ...mapMutations({
        setDisc: 'SET_DISC' 
      })
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  };
</script>
<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable";
  .recommend{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .recommend-content{
      height: 100%;
      overflow: hidden;
      .slider-wrapper{
        position: relative;
        width: 100%;
        overflow: hidden;
      }
      .recommend-list{
        .list-title{
          height: 65px;
          line-height: 65px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-theme;
        }
        .item{
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 20px 20px;
          .icon{
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          }
          .text{
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: @font-size-medium;
            .name{
              margin-bottom: 10px;
              color: @color-text;
            }
            .desc{
              color: @color-text-d;
            }
          }
        }
      }
    }
  }
  .loadingWrapper{
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
</style>