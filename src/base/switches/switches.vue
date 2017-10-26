<template>
  <ul class="switches">
    <li class="switch-item" @click="switcheItem(index)" v-for="(item, index) in switches" :class="{'active': currentIndex === index}">
      <span>{{item}}</span>
    </li>
  </ul>
</template>
<script>
  export default {
    props: {
      switches: {
        type: Array,
        default: ['项目一', '项目二', '项目三']
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      switcheItem (index) {
        this.$emit('switch', index);
      }
    }
  };
</script>
<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable";

  .switches{
    display: flex;
    align-items: center;
    width: 240px;
    margin: 0 auto;
    border: 1px solid @color-highlight-background;
    border-radius: 5px;
    .switch-item{
      flex: 1;
      padding: 8px;
      text-align: center;
      font-size: @font-size-medium;
      color: @color-text-d;
      &.active{
        background: @color-highlight-background;
        color: @color-text;
      }
    }
  }
</style>