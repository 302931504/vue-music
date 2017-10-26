<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" class="box" v-model="query" :placeholder="placeholder">
    <i @click="clearBox" class="icon-dismiss" v-show="query"></i>
  </div>
</template>
<script>
  import {debouce} from 'common/js/util';

  export default {
    data () {
      return {
        query: ''
      };
    },
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    methods: {
      clearBox () {
        this.query = '';
      },
      addQuery (newQuery) {
        this.query = newQuery;
      },
      blur () {
        this.$refs.query.blur();
      }
    },
    created () {
      this.$watch('query', debouce((newQuery) => {
        this.$emit('query', newQuery);
      }, 200));
    }
  };
</script>
<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable";

  .search-box{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: @color-highlight-background;
    border-radius: 6px;
    .icon-search{
      font-size: 24px;
      color: @color-background;
    }
    .box{
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: @color-highlight-background;
      color: @color-text;
      font-size: @font-size-medium;
      &::placeholder{
        color: @color-text-d;
      }
    }
    .icon-dismiss{
      font-size: 16px;
      color: @color-background;
    }
  }
</style>