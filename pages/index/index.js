'use strict';
const app = getApp();
const util = require('../../utils/util');
Page({
  data: {
    scrollAble: true,
    classIndex: 1,
    banner: {
      indicatorDots: false,
      autoplay: false,
      duration: 100
    },
    navBar: [
      { id: 0, text: '推荐' },
      { id: 1, text: '分类' },
      { id: 2, text: '品牌' }
    ],
    classes: [],
    brand: [],
    recommend: [],
    loading: true
  },
  onLoad() {
    let _this = this;
    wx.request({
      url: `${app.globalData.url}index.php`,
      data: {},
      method: 'GET',
      success(res) {
        let [classes, brands, recommends] = [res.data.type, res.data.pinpai, res.data.tj];
        _this.setData({
          classes,
          brands,
          recommends,
        });
      }
    })
  },
  onShow(){
    this.setData({
      classIndex: 1
    })
  },
  onReady() {
    util.load.call(this);
  },
  choseClass(e) {
    let current = e.currentTarget.dataset.id;
    this.setData({
      classIndex: current
    })
  },
  banner_swiper(e) {
    this.setData({
      classIndex: e.detail.current
    })
  }
})
