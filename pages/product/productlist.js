// pages/product/productlist.js
const app = getApp();
const util = require('../../utils/util');
Page({
  data: {
    productList: [],
    loading: true,
    currentPage: 1,
    id: null,
    reload: 0,
    still: 1,
    havaData: false
  },
  onLoad(options) {
    let _this = this;
    wx.setNavigationBarTitle({
      title: options.page
    });
    wx.request({
      url: `${app.globalData.url}products_list.php`,
      data: { typeid: options.id },
      method: 'GET',
      success(res) {
        if (res.data != '') {
          let { zs: total, list: productList } = res.data;
          const pageNum = Math.ceil(total / app.globalData.product.number);
          _this.setData({
            total,
            id: options.id
          })
          _this.loadMore();
        } else { //没数据
          _this.setData({
            loading: false,
            havaData: false
          })
        }
      }
    })
  },
  loadMore(page = this.data.currentPage) {
    var _this = this;
    this.setData({
      reload: 1
    })
    wx.request({
      url: `${app.globalData.url}products_list.php`,
      data: { typeid: _this.data.id, page: _this.data.currentPage },
      method: 'GET',
      success(res) {
        if (res.data.pagezt == '0') {
          _this.setData({
            still: 0
          })
        } else {
          var productList = [];
          let { zs: total, list: newList } = res.data;
          var list = _this.data.productList;
          productList = list.concat(newList);
          _this.setData({
            productList,
            reload: 0,
            havaData: true
          })
        }
      },
      complete() {
        _this.setData({
          reload: 0
        })
      }
    })
  },
  imgLoad() {
    util.load.call(this);
  },
  onReachBottom: function () {
    if (this.data.havaData) {
      if (this.data.still) {
        this.data.currentPage++;
        this.loadMore.call(this);
      }
    }
  }
})