// pages/login/login.js
const app = getApp();
Page({
  data: {
    tabBar: [
      { id: 0, text: '注册' },
      { id: 1, text: '登录' }
    ],
    banner: {
      indicatorDots: false,
      autoplay: false,
      duration: 80
    },
    sign: {
      sex: ['先生', '女士']
    },
    formList: [
      { id: 1, placeholder: '姓', type: 'text', name: 'lastname' },
      { id: 2, placeholder: '名', type: 'text', name: 'firstName' },
      { id: 3, placeholder: '手机号', type: 'number', name: 'tel' },
      { id: 4, placeholder: '电子邮箱', type: 'text', name: 'email' }
    ],
    sexIndex: '',
    agree: false,
    submitList: [0, 0, 0, 0, 0, 0, 0],
    submitAble: false,
    classIndex: 0,
    autoFocusIndex: 0,
    addressList: [],
    second: 60,
    sended: false,
    ok: false,
    telInputed: false
  },
  onLoad(options) {

  },
  tabChange(e) {
    let current = e.currentTarget.dataset.id;
    this.setData({
      classIndex: current
    })
  },
  sexChoser(e) {
    let _this = this;
    let sexIndex = parseInt(e.detail.value);
    let submitList = this.data.submitList;
    submitList[0] = 1;
    this.checkable();
    let time = setTimeout(function () {
      _this.setData({
        sexIndex,
        autoFocusIndex: 1,
        submitList
      })
    }, 200);
  },
  inputComplete(e) {
    let submitList = this.data.submitList;
    let idx = parseInt(e.target.dataset.index);
    var index = '';
    if (e.detail.value != '') {
      submitList[idx + 1] = 1;
      index = e.target.dataset.index;
      this.setData({
        submitList
      })
    } else {
      submitList[idx + 1] = 0;
      index = e.target.dataset.index;
      this.setData({
        submitList
      })
    }
    let formList = this.data.formList;
    formList[index].val = e.detail.value;
    this.setData({
      autoFocusIndex: ++e.target.dataset.id,
    })
    this.checkable();
    //console.log(this.data.autoFocusIndex) 聚焦的索引
  },
  banner_swiper(e) {
    this.setData({
      classIndex: e.detail.current
    })
  },
  regionChose(e) {
    let addressList = e.detail.value;
    let submitList = this.data.submitList;
    submitList[5] = 1;
    this.setData({
      addressList: e.detail.value,
      submitList
    })
    this.checkable();
  },
  formSubmit(e) {
    let _this = this;
    wx.request({
      url: `${app.globalData.url}reg.php`,
      data: { data: e.detail.value },
      method: 'GET',
      success(res) {
        console.log(res);
        if (res.data == '-1') {
          wx.showToast({
            title: '该手机号已注册',
            image: '/icon/w.png',
            duration: 2000,
            complete() {
              //关闭
            }
          })
        } else {
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000,
            complete() {
              //关闭
            }
          });
          setTimeout(() => {
            _this.setData({
              classIndex: 1
            })
          }, 2000)
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  login() {
    wx.request({
      url: `${app.globalData.url}login.php`,
      data: { mobile: '13674637162' },
      method: 'GET',
      success(res) {
        if (res.data.userid) {
          app.globalData.userId = res.data.userid;
          wx.navigateBack({ delta: 1 });
        } else {
          wx.showToast({
            title: '登录失败',
            image: '/icon/w.png',
            duration: 2000,
            complete() {
              //关闭
            }
          })
        }
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  addAble(e) {
    let submitList = this.data.submitList;
    if (e.detail.value.length > 0) {
      submitList[6] = 1;
      this.setData({
        submitList
      })
    } else {
      submitList[6] = 0;
      this.setData({
        submitList
      })
    }
    this.checkable();
  },
  checkable() {
    let arr = this.data.submitList;
    let value = arr.every((val) => {
      return val == true
    })
    this.setData({
      submitAble: value
    })
  },
  inputTel(e) {
    let tel = e.detail.value;
    let reg = /^1[34578]\d{9}$/;
    if (reg.test(tel)) {
      this.setData({
        tel,
        telInputed: true
      })
    } else {
      wx.showToast({
        title: '请填写正确的电话号码',
        image: '/icon/w.png',
        duration: 2000,
        complete() {
          //关闭
        }
      })
    }
  },
  getCode() {
    if (this.data.telInputed) {
      let second = this.data.second;
      let timer = setInterval(() => {
        second--;
        this.setData({
          second: second,
          sended: true
        })
        if (second <= 0) {
          clearInterval(timer);
          this.setData({
            second: 60,
            sended: false
          })
        }
      }, 1000);
    }
  },
  inputCode(e) {
    let tel = e.detail.value;
    let reg = /\d{6}$/;
    if (reg.test(tel)) {
      //验证成功
      this.setData({
        codeInputed: true
      })
    } else {
      //验证失败
    }
  }
})