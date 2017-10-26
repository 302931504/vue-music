<template>
  <transition name="slide">
    <music-list :title="singer.name" :bg-image="singer.avatar" :songs="songs"></music-list>
  </transition>
</template>
<script>
  import {mapGetters} from 'vuex';
  import {getSingerDetail} from 'api/singer';
  import {createSong} from 'common/js/song';
  import MusicList from 'components/music-list/music-list';
  export default {
    data () {
      return {
        songs: []
      };
    },
    computed: {
      ...mapGetters([
        'singer'
      ])
    },
    created () {
      this._getSingerDetail();
    },
    methods: {
      _getSingerDetail () {
         if (!this.singer.id) {
          this.$router.push('/singer');
          return;
        } 
        getSingerDetail(this.singer.id).then(res => {
          if (res.code === 0) {
            this.songs = this._normalizeSongs(res.data.list);
            console.log(this.songs);
          }
        });
      },
      _normalizeSongs (list) {
        let ret = [];
        list.forEach(item => {
          let {musicData} = item;
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