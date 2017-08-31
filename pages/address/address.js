// pages/address/address.js
'use strict';
var app = getApp();
const util = require('../../utils/util');
Page({
  data: {
    inputList: [
      { label: '收货人姓', type: 'text', name: 'lastname', id: 1, check: 'checkInput' },
      { label: '收货人名', type: 'text', name: 'firstname', id: 2, check: 'checkInput' },
      { label: '手机号', type: 'number', name: 'tel', id: 3, check: 'checkTel' }
    ],
    addressList: [
      { label: '详细地址', name: 'address', holder: '街道门牌信息', id: 5, check: 'checkInput' },
      { label: '邮政编码', name: 'zipcode', holder: '选填', id: 6 }
    ],
    region: ['选择省', '选择市', '选择区'],
    sex: ['先生', '女士'],
    sexIndex: [0, 1],
    sexChosed: false,
    warning: [0, 1, 1, 1, 0, 1, 1],
    warnList: [0, 0, 0, 0, 0, 0, 1],
    submitAble: false
  },
  onLoad: function (options) {
    // wx.chooseAddress({
    //   success: function (res) {
    //     console.log(res.userName)
    //     console.log(res.postalCode)
    //     console.log(res.provinceName)
    //     console.log(res.cityName)
    //     console.log(res.countyName)
    //     console.log(res.detailInfo)
    //     console.log(res.nationalCode)
    //     console.log(res.telNumber)
    //   }
    // })
  },
  sexChoser(e) {
    var warning = this.data.warning;
    var warnList = this.data.warnList;
    warning[e.target.dataset.id] = 1;
    warnList[e.target.dataset.id] = 1;
    this.setData({
      sexIndex: e.detail.value,
      sexChosed: true,
      warning,
      warnList
    })
    util.checkValue.call(this);
  },
  checkTel(e) {
    let reg = /^1[34578]\d{9}$/;
    var warning = this.data.warning;
    var warnList = this.data.warnList;
    if (!reg.test(e.detail.value)) {
      warning[e.target.dataset.id] = 0;
      warnList[e.target.dataset.id] = 0;
      this.setData({
        warning,
        warnList
      })
    } else {
      warning[e.target.dataset.id] = 1;
      warnList[e.target.dataset.id] = 1;
      this.setData({
        warning,
        warnList
      })
    }
    util.checkValue.call(this);
  },
  checkInput(e) {
    var warning = this.data.warning;
    var warnList = this.data.warnList;
    if (e.detail.value.length == 0) {
      warning[e.target.dataset.id] = 0;
      warnList[e.target.dataset.id] = 0;
      this.setData({
        warning,
        warnList
      })
    } else {
      warning[e.target.dataset.id] = 1;
      warnList[e.target.dataset.id] = 1;
      this.setData({
        warning,
        warnList
      })
    }
    util.checkValue.call(this);
  },
  checkEmail(e) {
    let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    var warning = this.data.warning;
    var warnList = this.data.warnList;
    if (!reg.test(e.detail.value)) {
      warning[e.target.dataset.id] = 0;
      warnList[e.target.dataset.id] = 0;
      this.setData({
        warning,
        warnList
      })
    } else {
      warning[e.target.dataset.id] = 1;
      warnList[e.target.dataset.id] = 1;
      this.setData({
        warning,
        warnList
      })
    }
    util.checkValue.call(this);
  },
  bindRegionChange(e) {
    console.log(e);
    var warning = this.data.warning;
    var warnList = this.data.warnList;
    warning[e.target.dataset.id] = 1
    warnList[e.target.dataset.id] = 1;
    this.setData({
      region: e.detail.value
    })
    util.checkValue.call(this);
    console.log(this.data.region);
  },
  formSubmit(e) {
    console.log(e);
    wx.request({
      url: `${app.globalData.url}orderinfo.php`,
      data: { data: e.detail.value, act: 'addr', userid: app.globalData.userId },
      success(res) {
        if (res.data.success == '1') {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 2000);
        }
      }
    })
    // wx.setStorage({    //将地址保存在本地缓存中
    //   key: "addressInfo",
    //   data: e.detail.value,
    //   success() {
    //     wx.showToast({
    //       title: '保存成功',
    //       icon: 'success',
    //       duration: 2000
    //     })
    //     setTimeout(() => {
    //       wx.navigateBack({
    //         delta: 1
    //       })
    //     }, 2000);
    //   },
    //   fail() {
    //   }
    // });
  }
})