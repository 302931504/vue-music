<template>
  <div class="singer" ref="singer">
    <listview :data="singerList" @select="witchSinger" ref="list"></listview>
    <router-view></router-view>
  </div>
</template>
<script>
  import {getSingerList} from 'api/singer';
  import Singer from 'common/js/singer';
  import Listview from 'base/listview/listview';
  import {mapMutations} from 'vuex';
  import {playlistMixin} from 'common/js/mixin'; 

  const HOT = '热门';
  const HOT_LENGTH = 10;
  export default {
    mixins: [playlistMixin],
    data () {
      return {
        singerList: []
      };
    },
    created () {
      this._getSingerList();
    },
    methods: {
      handlePlaylist (playlist) {
        let bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.singer.style.bottom = bottom;
        this.$refs.list.refresh();
      },
      witchSinger (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        });
        this.setSinger(singer);
      },
      _getSingerList () {
        getSingerList().then((res) => {
          if (!res.code) {
            this.singerList = this._normalizeSinger(res.data.list);
          }
        }).catch(err => {
          return err;
        }); 
      },
      _normalizeSinger (list) {
        let map = {
          hot: {
            title: HOT,
            items: []
          }
        };
        list.forEach((item, index) => {
          if (index < HOT_LENGTH) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }));
          } 
          const key = item.Findex;
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            };
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }));
        });
        let ret = [];
        let hot = [];
        for (let key in map) {
          let val = map[key];
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val);
          } else if (val.title === HOT) {
            hot.push(val);
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });
        return hot.concat(ret);
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      Listview
    }
  };
</script>
<style scoped lang="less" rel="stylesheet/less">
  .singer{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
</style>