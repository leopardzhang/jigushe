// pages/pay/pay.js
'use strict';
const app = getApp();
const util = require('../../utils/util');
Page({
  data: {
    shopLlist: [],
    totalprice: '',
    address: ''
  },
  onLoad(options) {
    let _this = this;
    if (options.order) {
      let cartData = JSON.parse(options.order) || {};
      wx.request({
        url: `${app.globalData.url}orderinfo.php`,
        data: { info: cartData, userid: app.globalData.userId },
        method: "GET",
        success(res) {
          console.log(res);
          if (res.data.dizhi.zt == 0) {
            wx.navigateTo({
              url: '/pages/address/address'
            })
          } else {
            _this.setData({
              address: res.data.dizhi.zt,
              aid: res.data.dizhi.aid
            })
          }
          _this.setData({
            shopList: res.data.shoplist,
            totalprice: res.data.totalprice,
            address: res.data.dizhi,
            totprice: res.data.totprice,
            cartid: res.data.cartid
          });
        },
        fail() {
          console.log('失败了');
        }
      });
    } else {
      wx.request({
        url: `${app.globalData.url}orderinfo.php`,
        data: { act: 'NowBuy', goods_price: options.goods_price, id: options.id, userid: app.globalData.userId, norm: options.norm },
        success(res) {
          _this.setData({
            shopList: res.data.shoplist,
            totalprice: res.data.totalprice,
            address: res.data.dizhi,
            totprice: res.data.totprice,
            cartid: res.data.cartid
          });
        }
      })
    }
    // wx.request({
    //   url: `${app.globalData.url}orderinfo.php`,
    //   method: 'GET',
    //   data: { act: 'addr', userid: app.globalData.userId}
    // })
  },
  pay() {   //发送 this.data.totprice
    let _this = this;
    let [aid, userid, totprice, cartid] = [this.data.aid, app.globalData.userId, this.data.totprice, this.data.cartid];
    util.getOpenId.call(_this);
    wx.request({
      url: `${app.globalData.url}orderpost.php`,
      data: { aid, userid, totprice, cartid, openid: _this.data.openid },
      success(res) {
        if (res.data.success == '1') {
          // wx.requestPayment({
          //   'timeStamp': '',
          //   'nonceStr': '',
          //   'package': '',
          //   'signType': 'MD5',
          //   'paySign': '',
          //   'success': function (res) {
          //   },
          //   'fail': function (res) {
          //   }
          // })
        }
      }
    })
  }
})