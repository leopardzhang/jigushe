// pages/user/user.js
const app = getApp();
const checkLogin = require('../../utils/login');
Page({
  data: {
    list: [
      { text: '我的订单', nav: '', img: 'https://xcx.longcai666.com/xiaochengxu/api/images/order2x.png', url: '/pages/order/order' },
      { text: '我的地址管理', nav: '', img: 'https://xcx.longcai666.com/xiaochengxu/api/images/address2x.png', url: '/pages/address/addresslist' }
    ]
  },
  onLoad (options) {
    checkLogin(app);
  }
})