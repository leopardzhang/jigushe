// pages/service/service.js
const app = getApp();
Page({
  data: {
    text: ''
  },
  onLoad(options) {
    let _this = this;
    wx.request({
      url: `${app.globalData.url}${options.type}` + '.php',
      success(res) {
        _this.setData({
          text: res.data.content
        })
      }
    })
  }
})