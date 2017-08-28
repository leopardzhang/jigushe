function checkLogin(app){
  if (!app.globalData.userId){
    wx.navigateTo({
      url: '/pages/login/login'
    })
  }
}
module.exports = checkLogin;