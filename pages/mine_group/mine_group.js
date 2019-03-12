// pages/mine_group/mine_group.js
const groupApi = require("../../service/mine_group.js").allServerApi;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyNum: 0,
    groupNum: 0,
    applyArr: [],
    groupArr: [],
    zhezhaoShow: false
  },
  show() {
    this.setData({
      zhezhaoShow: true
    })
  },
  close() {
    this.setData({
      zhezhaoShow: false
    })
  },
  getMineGroup() {
    let that = this
    groupApi.getMineGroup({
      mp_openid: wx.getStorageSync('openid')
    }, function(res) {
      console.log(res)
      that.setData({
        applyArr: res.data.data.first,
        applyNum: res.data.data.first.length,
        groupArr: res.data.data.second,
        groupNum: res.data.data.second.length
      })
    }, function(error) {

    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMineGroup();
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