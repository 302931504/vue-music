<template>
  <div class="progress-bar" ref="progressBar" @click="clickpageX">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressStart"
           @touchmove.prevent="progressMove"
           @touchend="progressEnd" 
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      this.touch = {};
    },
    methods: {
      progressStart (e) {
        this.touch.initiated = true;
        this.touch.offsetX = e.touches[0].pageX;
        this.touch.left = this.$refs.progress.clientWidth;
      },
      progressMove (e) {
        let x = e.touches[0].pageX - this.touch.offsetX;
        let offset = Math.min(this.$refs.progressBar.clientWidth - 16, Math.max(0, this.touch.left + x));
        this._offset(offset);
      },
      progressEnd (e) {
        this.touch.initiated = false;
        this.changePercent();
      },
      changePercent () {
        const progressBarWidth = this.$refs.progressBar.clientWidth - 16;
        let percent = this.$refs.progress.clientWidth / progressBarWidth;
        this.$emit('percent', percent);
      },
      clickpageX (e) {
        // const offset = e.offsetX;
        let rect = this.$refs.progressBar.getBoundingClientRect();
        let offset = e.pageX - rect.left;
        this._offset(offset);
        this.changePercent();
      },
      _offset (offset) {
        this.$refs.progress.style.width = `${offset}px`;
        this.$refs.progressBtn.style.transform = `translate3d(${offset}px, 0, 0)`;
      }
    },
    watch: {
      percent (newVal) {
        if (newVal >= 0 && !this.touch.initiated) {
          const offset = (this.$refs.progressBar.clientWidth - 16) * newVal;
          this._offset(offset);
        }
      }
    }
  };
</script>
<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable";

  .progress-bar{
    height: 30px;
    .bar-inner{
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, .3);
      .progress{
        position: absolute;
        height: 100%;
        background: @color-theme;
      }
      .progress-btn-wrapper{
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn{
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid @color-text;
          border-radius: 50%;
          background: @color-theme;
        }
      }
    }
  }
</style>