// pages/community/community.js
var app = getApp();
const communityApi = require('../../service/community.js').allServerApi;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    describe: ""
  },

  //跳转页面
  goCommunity(e) {
    // console.log(e.currentTarget.dataset.id)
    wx.navigateToMiniProgram({
      appId: 'wx9f13438ac4a3f56f',
      path: 'pages/index/index',
      extraData: {},
      envVersion: '',
      success(res) {
        //console.log("跳转成功")
        // 打开成功
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    communityApi.getData(function(res) {
      that.setData({
        arrData: res.data.data
      })
     // console.log(res.data.data)
    }, function(error) {

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})