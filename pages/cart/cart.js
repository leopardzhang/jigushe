// pages/cart/cart.js
'use strict';
const checkLogin = require('../../utils/login');
const app = getApp();
Page({
  data: {
    cartList: [],
    shopList: [],
    allChecked: false,
    checkList: [],
    result: 0,
    checker: false
  },
  onLoad() {
    let _this = this;
    wx.request({
      url: `${app.globalData.url}shopcart.php`,
      method: "GET",
      data: { act: 'list', userid: app.globalData.userId },
      success(res) {
        if (res.data != 0) {
          if (res.data.shoplist.length != 0) {
            _this.setData({
              allChecked: false
            })
          }
        }
      }
    })
  },
  onShow() {
    checkLogin(app);
    this.reload();
  },
  onHide() { //离开页面
    console.log(this.data.shoplist);
    let checkList = [];
    for (let i = 0; i < this.data.checkList.length; i++) {
      checkList.push(false);
    }
    this.setData({
      checkList,
      allChecked: false,
      checker: false,
      result: 0
    })
  },
  reload() {
    let _this = this;
    wx.request({
      url: `${app.globalData.url}shopcart.php`,
      method: "GET",
      data: { act: 'list', userid: app.globalData.userId },
      success(res) {
        if (res.data != 0) {
          let checkList = [];
          if (res.data.shoplist.length != 0) {
            let checkList = [];
            for (let i = 0; i < res.data.shoplist.length; i++) {
              checkList.push(false);
            }
            _this.setData({
              shopList: res.data.shoplist,
              checkList,
              allChecked: false,
              checker: false,
              result: 0
            });
          }
        }
      }
    })
  },
  checkAll() {
    this.setData({
      allChecked: !this.data.allChecked
    })
    let arr = this.data.checkList;
    if (this.data.allChecked) {
      let newArr = arr.map((val) => {
        return true;
      });
      this.setData({
        checkList: newArr
      })
    } else {
      let newArr = arr.map((val) => {
        return false;
      });
      this.setData({
        checkList: newArr
      })
    }
    this.calc();
  },
  checker(e) {
    let checkList = this.data.checkList;
    let idx = e.currentTarget.dataset.index;
    checkList[idx] = !checkList[idx]
    let all = checkList.every((val) => {
      return val == 1;
    })
    if (all) {
      this.setData({
        allChecked: true
      })
    } else {
      this.setData({
        allChecked: false
      })
    };
    this.setData({
      checkList
    })
    this.calc();
  },
  remove(e) {
    var _this = this;
    let checkList = this.data.checkList;
    let idx = e.currentTarget.dataset.index;  //购物车列表的索引
    let cartList = this.data.shopList;        //购物车列表
    wx.showModal({
      title: '确认删除？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: `${app.globalData.url}shopcart.php`,
            method: 'GET',
            data: { act: 'del', index: cartList[idx].id, userid: app.globalData.userId },
            success(res) {
              if (res.data.success == '1') {
                cartList.splice(idx, 1);
                checkList.splice(idx, 1);
                console.log(cartList);
                _this.setData({
                  shopList: cartList,
                  checkList
                })
                _this.calc();
              } else {
                wx.showToast({
                  title: '删除失败',
                  image: '/icon/w.png',
                  duration: 2000
                })
              }
            },
            fail() {
              wx.showToast({
                title: '删除失败',
                image: '/icon/w.png',
                duration: 2000
              })
            }
          })
        }
      }
    })
  },
  add(e) {
    let idx = e.currentTarget.dataset.index;
    this.changeNum(idx, 'add');
  },
  minute(e) {
    let idx = e.currentTarget.dataset.index;
    this.changeNum(idx, false);
  },
  changeNum(n, c) {
    let _this = this;
    let shopList = this.data.shopList;
    if (c == 'add') {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: `${app.globalData.url}shopcart.php`,
        method: 'GET',
        data: { goods_num: '1', id: shopList[n].id, userid: app.globalData.userId, act: 'update' },
        success(res) {
          wx.hideLoading();
          if (res.data.success == 'ok') {
            shopList[n].num++;
            _this.setData({
              shopList
            })
          }
          _this.calc();
        }
      })
    } else if (shopList[n].num > 1) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: `${app.globalData.url}shopcart.php`,
        method: 'GET',
        data: { goods_num: '-1', id: shopList[n].id, userid: app.globalData.userId, act: 'update' },
        success(res) {
          wx.hideLoading();
          if (res.data.success == 'ok') {
            shopList[n].num--;
            _this.setData({
              shopList
            })
            _this.calc();
          }
        }
      })
    }
  },
  settlement() {
    let _this = this;
    let cart = [];
    let checkList = this.data.checkList;
    checkList.map((val, index, arr) => {
      if (val) {
        cart.push({
          id: _this.data.shopList[index].id,
          num: _this.data.shopList[index].num
        });
      }
    });
    let strCart = JSON.stringify(cart);
    if (this.data.checker) {
      wx.navigateTo({
        url: `/pages/pay/pay?order=${strCart}`
      })
    }
  },
  calc() {
    let result = 0;
    let cartList = this.data.shopList;
    let checkList = this.data.checkList;
    checkList.map((val, index, arr) => {
      if (val) {
        result += cartList[index].salesprice * cartList[index].num;
      }
    });
    this.setData({
      result: Math.floor(result * 100) / 100
    });
    let _this = this;
    let checker = this.data.checkList.some((val, idx, arr) => {
      return val != 0;
    });
    this.setData({
      checker
    });
  }
})