<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>
<script>
  import {mapGetters} from 'vuex';
  import {getSongList} from 'api/getRecommend';
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
        return this.disc.dissname;
      },
      bgImage () {
        return this.disc.imgurl;
      },
      ...mapGetters([
        'disc'
      ])
    },
    created () {
      this._getSongList();
    },
    methods: {
      _getSongList () {
        if (!this.disc.dissid) {
          this.$router.push('/recommend');
          return;
        } 
        getSongList(this.disc.dissid).then(res => {
          if (res.code === 0) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist);
          }
        }); 
      },
      _normalizeSongs (list) {
        let ret = [];
        list.forEach(musicData => {
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