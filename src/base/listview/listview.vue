<template>
  <scroll class="listview" ref="listview" 
  :data="data" 
  :listen-scroll="listenScroll" 
  :probe-type="3"
  @scroll="scroll">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item" @click="clickSinger(item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" 
    @touchstart.stop.prevent="onShortcutTouchStart"
    @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li v-for="(item, index) in shortcutList" class="item" 
        :data-index='index' 
        :class="{'current':index === currentIndex}">
          {{item}}
        </li> 
      </ul>
    </div>
    <div class="fixed" ref="fixed">
      <div class="fiexd-title" v-show="fixedTitle">{{fixedTitle}}</div>
    </div>
    <loading class="loading" v-show="!data.length"></loading>
  </scroll>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import {getData} from 'common/js/dom';
  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        touch: {},
        listHeight: [],
        scrollY: -1,
        listenScroll: true,
        currentIndex: 0,
        diff: -1
      };
    },
    computed: {
      shortcutList () {
        return this.data.map((group) => {
          return group.title.substr(0, 1);
        });
      },
      fixedTitle () {
        if (this.scrollY > 0) {
          return '';
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
      }
    },
    components: {
      Scroll,
      Loading
    },
    methods: {
      refresh () {
        this.$refs.listview.refresh();
      },
      clickSinger (item) {
        this.$emit('select', item);
      },
      onShortcutTouchStart (el) {
        let anchorIndex = getData(el.target, 'index');
        let firstTouch = el.changedTouches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = anchorIndex;
        this._scrollTo(anchorIndex);
      },
      onShortcutTouchMove (el) {
        let firstTouch = el.changedTouches[0];
        this.touch.y2 = firstTouch.pageY;
        let delta = (this.touch.y2 - this.touch.y1) / 18 | 0;
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
        this._scrollTo(anchorIndex);
      }, 
      scroll (pos) {
        this.scrollY = pos.y;
      },
      _calculateHeight () {
        this.listHeight = [];
        let list = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < list.length; i++) {
          let item = list[i].clientHeight;
          height += item;
          this.listHeight.push(height);
        }
      },
      _scrollTo (index) {
        this.scrollY = -this.listHeight[index];
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this._calculateHeight();
        }, 20);
      },
      scrollY (newY) {
        let listHeight = this.listHeight;
        if (newY > 0) {
          this.currentIndex = 0;
          return;
        }
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i;
            this.diff = height2 + newY;
            return;
          } 
        }
      },
      diff (newVal) {
        let fixedTop = (newVal > 0 && newVal < 18) ? newVal - 18 : 0;
        if (this.fixedTop === fixedTop) {
          return;
        }    
        this.fixedTop = fixedTop;
        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
      }
    }
  };
</script>
<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable";

  .listview{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: @color-background;
    .list-group{
      padding-bottom: 30px;
      .list-group-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
      .list-group-item{
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar{
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name{
          margin-left: 20px;
          color: @color-text-l;
          font-size: @font-size-medium;
        }
      }
    }
    .list-shortcut{
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: @color-background-d;
      font-family: Helvetica;
      .item{
        padding: 3px;
        line-height: 1;
        color: @color-text-l;
        font-size: @font-size-small;
      }
      .current{
        color: @color-theme;
      }
    }
    .fixed{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fiexd-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
    }
    .loading{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
      z-index: 100;  
    } 
  }
  
</style>