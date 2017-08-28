// pages/order/orderinfo.js
const app = getApp();
Page({
  data: {
    info: ''
  },
  onLoad (options) {
    let _this = this;
    wx.request({
      url: `${app.globalData.url}memberorder.php`,
      data: { act: 'ordercontent', userid: app.globalData.userId, id: options.id },
      success(res) {
        console.log(res.data);
        _this.setData({
          info: res.data
        });
      }
    })
  }
})