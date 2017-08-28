//app.js
App({
  onLaunch() {
    var _this = this;
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
      wx.login({
        success: function (res) {
          if (res.code) {
            console.log(res.code);
            wx.getUserInfo({
              success: function (res) {
                var objz = {};
                objz.avatarUrl = res.userInfo.avatarUrl;
                objz.nickName = res.userInfo.nickName;
                wx.setStorageSync('userInfo', objz);//存储userInfo
              }
            });
            wx.request({
              url: `${_this.globalData.url}wxcode.php`,
              data: { js_code: res.code, appid: _this.globalData.appId, secret: _this.globalData.appSecret, grant_type: 'authorization_code' },
              method: 'GET',
              success: function (res) {
                console.log(res);
                var obj = {};
                obj.openid = res.data.openid;
                obj.expires_in = Date.now() + res.data.expires_in;
                console.log(obj);
                wx.setStorageSync('user', obj);//存储openid
                _this.globalData.openID = res.data.openid;
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg);
          }
        }
      });
    }
  },
  getUserInfo(cb) {
    var _this = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          _this.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(_this.globalData.userInfo)
        }
      })
    }
  },
  globalData: {
    appId: 'wxec961a4c6fa7d586',
    appSecret: '2a462229c82bf6a968b5166a353807b7',
    userInfo: null,
    openType: 'contact',
    url: 'https://xcx.longcai666.com/xiaochengxu/api/',
    product: {
      number: 4
    },
    login: false,
    userId: null,
    openId: null
  }
})
