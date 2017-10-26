<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rankType="true"></music-list>
  </transition>
</template>
<script>
  import {mapGetters} from 'vuex';
  import {getMusicList} from 'api/rank';
  import {createSong} from 'common/js/song';
  import MusicList from 'components/music-list/music-list';
  export default {
    data () {
      return {
        songs: []
      };
    },
    computed: {
      title () {
        return this.topList.topTitle;
      },
      bgImage () {
        return this.topList.picUrl;
      },
      ...mapGetters([
        'topList'
      ])
    },
    created () {
      this._getSongList();
    },
    methods: {
      _getSongList () {
        if (!this.topList.id) {
          this.$router.push('/rank');
          return;
        } 
        getMusicList(this.topList.id).then(res => {
          if (res.code === 0) {
            this.songs = this._normalizeSongs(res.songlist);
            console.log(this.songs);
          }
        }); 
      },
      _normalizeSongs (list) {
        let ret = [];
        list.forEach(item => {
          let musicData = item.data; 
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      }
    },
    components: {
      MusicList
    }
  };
</script>
<style scoped lang="less" rel="stylesheet/less">
  .slide-enter-active, .slide-leave-active{
    transition: all 0.6s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0); 
  }
</style>