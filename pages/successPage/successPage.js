// pages/successPage/successPage.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const invitateAPI = require("../../service/invitate.js").allServerApi;
const flockListApi = require("../../service/flockList.js").allServerApi;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    let showLogin = app.getUserInfoFun();
    that.setData({
      groupID: options.id
    })

  },
  onShow: function() {
    var that = this
    that.getZhuliInfo()
  },
  headAlt() {
    let that = this;
    that.setData({
      showAlt: false
    })
  },
  enjoyGroup: function(e) {
    let that = this;
    that.setData({
      showAlt: true,
      sendId: e.currentTarget.dataset.id
    });
    flockListApi.recordAddFlock({
      mp_openid: wx.getStorageSync('openid'),
      room_id: e.currentTarget.dataset.id
    }, function(res) {
       console.log(res)
    }, function(error) {
      console.log(error)
    })
  },
  getZhuliInfo: function() {
    var that = this
    invitateAPI.getZhuli({
      mp_openid: wx.getStorageSync('openid'),
      id: that.data.groupID
    }, function(suc) {
      console.log(suc);
      if (suc.data.result == 0) {
        if (suc.data.data.list.length>4){
         that.setData({
           userInfoList: suc.data.data.list,
           objInfo: suc.data.data,
           lenth:4
         })
       }else{
         that.setData({
           userInfoList: suc.data.data.list,
           objInfo: suc.data.data,
           lenth: suc.data.data.list.length
         })
       }
        that.setData({
          userInfoList: suc.data.data.list,
          objInfo: suc.data.data
        })
      }
    }, function(err) {})
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