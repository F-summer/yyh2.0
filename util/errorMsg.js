let error = function (msg) {
  wx.showToast({
    title: msg,
    icon:"none"
  })
}
module.exports = error