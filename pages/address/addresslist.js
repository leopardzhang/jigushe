// pages/address/addresslist.js
const app = getApp();
Page({
  data: {
    addresslist: []
  },
  onLoad: function (options) {
    this.onShow();
  },
  onShow() {
    let _this = this;
    wx.request({
      url: `${app.globalData.url}orderinfo.php`,
      data: { act: 'addrlist', userid: app.globalData.userId },
      method: 'GET',
      success(res) {
        _this.setData({
          addresslist: res.data
        })
      }
    })
  },
  remove(e) {
    let _this = this;
    wx.showModal({
      title: '确认删除？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: `${app.globalData.url}orderinfo.php`,
            data: { act: 'del', userid: app.globalData.userId, aid: e.target.dataset.aid },
            success(res) {
              if (res.data.success == 1) {
                _this.onShow();
              } else {
                wx.showToast({
                  title: '删除失败',
                  image: '/icon/w.png',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    })
  },
  setDefault(e) {
    let _this = this;
    wx.request({
      url: `${app.globalData.url}orderinfo.php`,
      data: { act: 'addrmoren', userid: app.globalData.userId, aid: e.currentTarget.dataset.aid },
      success(res) {
        if (res.data.success = '1') {
          wx.showToast({
            title: '设置成功',
            icon: 'success',
            duration: 400
          })
          _this.onShow();
        } else {
          wx.showToast({
            title: '设置失败',
            image: '/icon/w.png',
            duration: 2000
          })
        }
      }
    })
  }
})