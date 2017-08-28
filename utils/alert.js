export default class Common {
  alert(title, content){
    wx.showModal({
      title: title,
      content: content
    })
  }
}