import jsonp from 'common/js/jsonp';

import {commonParams, options} from './config';

export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';

  let data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  });

  return jsonp(url, data, options);
}

export function search (query, page, zhida) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
  let data = Object.assign({}, commonParams, {
    ct: 24,
    qqmusic_ver: 1298,
    new_json: 1,
    remoteplace: 'sizer.yqq.song_next',
    searchid: 150662629575036188,
    t: 0,
    aggr: 1,
    cr: 1,
    catZhida: zhida ? 1 : 0,
    lossless: 0,
    flag_qc: 0,
    p: page,
    n: 20,
    w: query,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  });

  return jsonp(url, data, options);
}