<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li class="search-item" v-for="(item, index) in searches" :key="index" @click="selectOne(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>
<script>
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectOne (item) {
        this.$emit('selectOne', item);
      },
      deleteOne (item) {
        this.$emit('deleteOne', item);
      }
    }
  };
</script>
<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .search-list{
    .search-item{
      display: flex;
      align-item: center;
      height: 40px;
      overflow: hidden;
      &.list-enter-active, &.list-leave-active{
        transition: all .1s;
      }
      &.list-enter, &.list-leave-to{
        height: 0;
      }
      .text{
        flex: 1;
        color: @color-text-l;
      }
      .icon{
        #extend-click();
        .icon-delete{
          font-size: @font-size-small;
          color: @color-text-d;
        }
      }
    }
  }
</style>