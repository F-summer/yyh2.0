// pages/feedback_list/feedback_list.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const app = getApp();
const feedbackApi = require("../../service/feedback.js").allServerApi;
const error = require('../../util/errorMsg.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listArr:[]
  },
  getData(){
    let that = this;
    feedbackApi.getFeedbackList({
      mp_openid: wx.getStorageSync('openid')
    },function(res){
      res.data.data.forEach((val,index)=>{
        if (val.status=="已提交"){
          val.styleName= 'style1'
        } else if (val.status == "处理中"){
          val.styleName = 'style2'
        }else{
          val.styleName = 'style3'
        }
        val.create_time = val.create_time.split("T")[0] +' '+ val.create_time.split("T")[1].split(".")[0];
        val.process_time = val.process_time.split("T")[0] + ' ' + val.process_time.split("T")[1].split(".")[0];
      })
      that.setData({
        listArr:res.data.data
      })
    },function(error){
      console.log(error)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})