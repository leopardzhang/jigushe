// pages/product/product.js
const app = getApp();
const util = require('../../utils/util');
const checkLogin = require('../../utils/login');
Page({
  data: {
    loading: true,
    banner: {
      autoplay: true,
      circular: true,
      indicatorDots: true,
      interval: 5000,
      duration: 400
    },
    descriptionShow: false,
    rule: [],
    wrong: null,
    num: null,
    chosed: [],
    choseVal: [],
    rangeList: [],   //规格列表
  },
  onLoad(options) {
    let _this = this;
    wx.setNavigationBarTitle({
      title: options.page
    })
    wx.request({
      url: `${app.globalData.url}products_show.php`,
      data: { id: options.id },
      success(res) {
        _this.setData({
          data: res.data
        })
      }
    })
    wx.request({
      url: `${app.globalData.url}guige.php`,
      data: { id: options.id },
      success(res) {
        if (res.data) {
          _this.setData({
            rangeList: res.data
          });
          let rule = [];
          let chosed = [];
          let choseVal = [];
          if (res.data) {
            for (let i = 0; i < res.data.length; i++) {
              rule.push({ id: res.data[i].id, value: 0 });
              chosed.push(0);
              choseVal.push([], []);
            }
            _this.setData({
              rule,
              chosed,
              choseVal
            })
          }
        } else {
          _this.setData({
            resInf: { norm: null }
          })
        }
      }
    })
  },
  imgLoad() {
    util.load.call(this);
  },
  makehPhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel
    })
  },
  bindchange(e) {
    let _this = this;
    let num = parseInt(e.detail.value);        //获取点击的索引
    let rule = this.data.rule;                 //获取当前数据
    let cid = parseInt(e.target.dataset.id);   //获取条件的id
    let index = e.target.dataset.index;        //获取点击的索引
    rule.splice(index, 1, { id: cid, value: _this.data.rangeList[index].value[num] });
    let chosed = this.data.chosed;
    chosed[index] = 1;
    let choseVal = this.data.choseVal;
    choseVal[index] = num;
    this.setData({
      rule,
      chosed,
      num,
      choseVal
    })
    wx.request({
      url: `${app.globalData.url}products_show.php`,
      data: { types: 'selectprice', id: _this.data.data.id, data: _this.data.rule },
      success(res) {  //获取价格&库存信息
        _this.setData({
          resInf: res.data
        })
        let infoList = _this.data.data;
        infoList.tot_housenum = res.data.housenum;
        infoList.price = res.data.price;
        _this.setData({
          data: infoList
        })
      }
    })
    if (this.data.wrong = this.data.chosed && this.data.clicked) {
      this.setData({
        wrong: _this.data.chosed
      })
    }
  },
  changeShow() {
    this.setData({
      descriptionShow: !this.data.descriptionShow
    })
  },
  buy() {
    if (!app.globalData.userId) {
      checkLogin(app);
    } else {
      let _this = this;
      this.setData({
        clicked: true
      });
      let arr = this.data.chosed;
      let reg = arr.every(function (val) {
        return val != 0;
      });
      if (reg && app.globalData.userId) {//可以购买 条件齐全
        var [goods_price, id, userid, norm] = [_this.data.data.price, _this.data.data.id, app.globalData.userId, _this.data.resInf.norm || ''];
        wx.navigateTo({
          url: `/pages/pay/pay?goods_price=${goods_price}&id=${id}&norm=${norm}`
        })
      } else {
        wx.showToast({
          title: '请选择规格',
          image: '/icon/w.png',
          duration: 2000,
          complete() {
            //关闭
          }
        })
        this.setData({
          wrong: _this.data.chosed
        })
      }
    }
  },
  addTocart() {//添加购物车
    if (!app.globalData.userId) {
      checkLogin(app);
    } else {
      let _this = this;
      this.setData({
        clicked: true
      })
      let arr = this.data.chosed;
      let reg = arr.every(function (val) {
        return val != 0;
      });
      if (reg && app.globalData.userId) {//可以购买 条件齐全
        let [norm, id, userid] = [this.data.resInf.norm || '', this.data.data.id, app.globalData.userId];
        wx.request({
          url: `${app.globalData.url}shopcart.php`,
          method: "GET",
          data: { act: 'add', norm, id, userid },
          success(res) {
            if (res.data == 1) {
              wx.showToast({
                title: '添加购物车成功',
                icon: 'success',
                duration: 2000,
                complete() {//添加购物车完毕回调

                }
              })
            } else {
              wx.showToast({
                title: '添加购物车失败',
                image: '/icon/w.png',
                duration: 2000
              })
            }
          }
        })
      } else {
        this.setData({
          wrong: _this.data.chosed
        })
        wx.showToast({
          title: '请选择规格',
          image: '/icon/w.png',
          duration: 2000,
          complete() {
            //关闭
          }
        })
      }
    }
  },
  checkLunch() {

  }
})