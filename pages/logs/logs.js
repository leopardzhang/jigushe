//logs.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    console.log(app.globalData.userInfo);
    app.globalData.userInfo = 'zty';
    console.log(app.globalData.userInfo);
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})
