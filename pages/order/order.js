// pages/order/order.js
const app = getApp();
const util = require('../../utils/util');
Page({
  data: {
    tabBar: [
      { id: 0, text: '未支付' },
      { id: 1, text: '已成交' }
    ],
    classIndex: 0
  },
  onLoad (options) {
    let _this = this;
    wx.request({
      url: `${app.globalData.url}memberorder.php`,
      data: { act: 'orderlist', userid: app.globalData.userId, orderzt: '0' },
      success(res) {
        if (res.data instanceof Array) {
          _this.setData({
            orderList: res.data
          })
        }
      }
    })
    wx.request({
      url: `${app.globalData.url}memberorder.php`,
      data: { act: 'orderlist', userid: app.globalData.userId, orderzt: '1' },
      success(res) {
        if (res.data instanceof Array) {
          _this.setData({
            orderList2: res.data
          })
        }
      }
    })
  },
  tabChange(e) {
    let current = e.currentTarget.dataset.id;
    this.setData({
      classIndex: current
    })
  },
  banner_swiper(e) {
    this.setData({
      classIndex: e.detail.current
    })
  },
  remove(e) {
    let _this = this;
    console.log(e);
    wx.showModal({
      title: '确认删除？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: `${app.globalData.url}memberorder.php`,
            data: { act: 'del', userid: app.globalData.userId, id: e.target.dataset.id },
            success(res) {
              let orderList = _this.data.orderList;
              orderList.splice(e.target.dataset.index, 1);
              _this.setData({
                orderList
              })
              _this.onLoad();
            }
          })
        }
      }
    })
  },
  pay(e) {
    let _this = this;
    wx.request({
      url: `${app.globalData.url}pay.php`,
      data: { orderlistnum: e.target.dataset.num, userid: app.globalData.userId, openid: _this.data.openid },
      success(res) {
        console.log(res);
      }
    })
  },
  confirm(e) {
    wx.showModal({
      title: '确认收货？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: `${app.globadData.url}memberorder.php`,
            data: { act: 'queren', id: e.target.dataset.id, userid: app.globalData.userId },
            success(res) {
              if (res.data.success == '1') {    //确认收货了
                wx.request({
                  url: `${app.globalData.url}memberorder.php`,
                  data: { act: 'queren', userid: app.globalData.userId, id: e.target.dataset.id },
                  success(res) {
                    if (res.data.success == 1) {
                      wx.showToast({
                        title: '收货成功',
                        icon: 'success',
                        duration: 2000
                      })
                    } else {
                      wx.showToast({
                        title: '收货失败',
                        image: '/icon/w.png',
                        duration: 2000
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  }
})