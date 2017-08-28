function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function load() {
  this.setData({
    loading: false
  })
}
function checkValue() {
  var list = this.data.warnList;
  var submitAble = list.every((item, index, arr) => {
    return (item >= 1)
  });
  this.setData({
    submitAble
  })
}
function getOpenId() {
  let _this = this;
  wx.getStorage({
    key: 'user',
    success: function (res) {
      console.log(res);
      _this.setData({
        openid: res.data.openid,
        expires_in: res.data.expires_in
      })
    }
  });
}
module.exports = {
  formatTime: formatTime,
  load: load,
  checkValue: checkValue,
  getOpenId: getOpenId
}
