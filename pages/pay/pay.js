// pages/pay/pay.js
let app = getApp();
const payApi = require('../../service/pay.js').allServerApi;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto:null
  },
  //调用支付
  payFun(){
    let that = this;
    payApi.pay({
      mp_openid: wx.getStorageSync('openid'),
      total_fee:1
    },function(res){
      console.log(res)
      wx.requestPayment({
        'timeStamp': res.data.data.timeStamp,
        'nonceStr': res.data.data.nonceStr,
        'package': res.data.data.package,
        'signType': res.data.data.signType,
        'paySign': res.data.data.paySign,
        'success': function (res) {
          console.log(res)
        },
        'fail': function (res) {
          console.log(res)
        }
      })
    },function(error){
      console.log(error)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: 'https://pv.sohu.com/cityjson?ie=utf-8',
      success: function (e) {
        console.log(e.data.split("=")[1].split(":")[1].split(",")[0]);
        that.setData({
          motto: e.data.split("=")[1].split(":")[1].split(",")[0]
        })
      }
    })
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