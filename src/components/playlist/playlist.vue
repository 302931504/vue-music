<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="modeIcon" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content" :data="sequenceList" :refreshDelay="refreshDelay">
          <transition-group ref="list" name="list" tag="ul">
            <li :key="item.id" class="item" ref="listItem" v-for="(item, index) in sequenceList" @click="selectSong(item, index)">
              <i class="current" :class="currentIcon(item)"></i>
              <span class="text" v-html="item.name"></span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavorite(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>  
        </scroll>
        <div class="list-operate">
          <div class="add" @click="showAddsong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清除当前播放列表" confirmBtnText="清除" @sure="clearPlaylist"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>
<script>
  import {mapActions} from 'vuex';
  import {playMode} from 'common/js/config';
  import Scroll from 'base/scroll/scroll';
  import Confirm from 'base/confirm/confirm'; 
  import AddSong from 'components/add-song/add-song';
  import {playerMixin} from 'common/js/mixin';

  export default {
    mixins: [playerMixin],
    data () {
      return {
        showFlag: false,
        refreshDelay: 100
      };
    },
    computed: {
      modeText () {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环';
      }
    },
    methods: {
      showAddsong () {
        this.$refs.addSong.show();
      },
      showConfirm () {
        this.$refs.confirm.show();
      },
      clearPlaylist () {
        this.clearPlaylist();
        this.hide();
      },
      show () {
        this.showFlag = true;
        setTimeout(() => {
          this.$refs.listContent.refresh();
          this.scrollToCurrent(this.currentSong);
        }, 20);
      },
      hide () {
        this.showFlag = false;
      },
      currentIcon (item) {
        if (item.id === this.currentSong.id) {
          return 'icon-play';
        }
      },
      scrollToCurrent (currentSong) {
        let index = this.sequenceList.findIndex((song) => {
          return currentSong.id === song.id;
        });
        this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300);
      },
      selectSong (item, index) {
        if (this.mode === playMode.random) {
          index = this.playList.findIndex((song) => {
            return item.id === song.id;
          });
        }
        this.setCurrentInsex(index);
        this.setPlayingState(true);
      },
      deleteOne (item) {
        this.deleteSong(item);
        if (!this.playList.length) {
          this.showFlag = false; 
        }
      },
      ...mapActions([
        'deleteSong',
        'clearPlaylist'
      ])
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (!this.showFlag || newSong.id === oldSong.id) {
          return;
        }
        setTimeout(() => {
          this.scrollToCurrent(newSong);
        }, 20);
      } 
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
  };
</script>
<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .playlist{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: @color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active{
      transition: opacity .3s;
      .list-wrapper{
        transition: all .3s;
      }
    }
    &.list-fade-enter, &.list-fade-leave-to{
      opacity: 0;
      .list-wrapper{
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: @color-highlight-background;
      .list-header{
        position: relative;
        padding: 20px 30px 10px 20px;
        .title{
          display: flex;
          align-items: center;
          .icon{
            margin-right: 10px;
            font-size: 30px;
            color: @color-theme-d;
          }
          .text{
            flex: 1;
            font-size: @font-size-medium;
            color: @color-text-l;
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
      .list-content{
        max-height: 240px;
        overflow: hidden;
        .item{
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          .current{
            flex: 0 0 20px;
            width: 20px;
            font-size: @font-size-small;
            color: @color-theme-d;
          }
          .text{
            flex: 1;
            #no-wrap();
            font-size: @font-size-medium;
            color: @color-text-d;
          }
          .like{
            #extend-click();
            margin-right: 15px;
            font-size: @font-size-small;
            color: @color-theme;
            .icon-favorite{
              color: @color-sub-theme;
            }
          }
          .delete{
            #extend-click();
            font-size: @font-size-small;
            color: @color-theme;
          }
        }
      }
      .list-operate{
        width: 140px;
        margin: 20px auto 30px auto;
        .add{
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid @color-text-l;
          border-radius: 100px;
          color: @color-text-l;
          .icon-add{
            margin-right: 5px;
            font-size: @font-size-small-s;
          }
          .text{
            font-size: @font-size-small;
          }
        }
      }
      .list-close{
        text-align: center;;
        line-height: 50px;
        background: @color-background;
        font-size: @font-size-medium-x;
        color: @color-text-l;
      }
    }
  }

  .list-enter-active, .list-leave-active{
    transtion: all 1s linear;
  }
  .list-enter, .list-leave-to{
    height: 0;
  }
</style>