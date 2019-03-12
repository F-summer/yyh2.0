// pages/loginPage/loginPage.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const app = getApp();
const loginApi = require("../../service/login.js").allServerApi;
const errorFun = require("../../util/errorMsg.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //获取用户信息
  onGotUserInfo() {
    let that = this;
    wx.login({
      success: function(e) {
        var code = e.code
        //console.log(code)
        wx.getUserInfo({
          withCredentials: true,
          lang: 'zh_CN',
          success: function(res) {
            //console.log(res.encryptedData,res.iv)
            wx.setStorageSync('nickName', res.userInfo.nickName);
            wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
            wx.getImageInfo({ //  小程序获取图片信息API
              src: res.userInfo.avatarUrl,
              success: function(res) {
                that.data.head_img = res.path;
                that.data.allNum = 1 + that.data.allNum;
                wx.setStorageSync('head_img', res.path);
              },
              fail(err) {
                console.log(err)
              }
            })
            loginApi.getOppenId({
              code: code,
              encryptedData: res.encryptedData,
              iv: res.iv,
            }, function(res) {
              //console.log(res.data.data)
              wx.setStorageSync('openid', res.data.data);
              wx.setStorageSync('userInfo', '1');

              // 编辑名片
              let pages = getCurrentPages();
              let prevPage = pages[pages.length - 2];
             if (prevPage.getMingPianInfo()) {
               prevPage.getMingPianInfo()
             }
              // 编辑名片
              wx.navigateBack();




            }, function(errorMsg) {
              wx.setStorageSync('userInfo', '0');
              errorFun("授权失败,请稍后再试");
              wx.navigateBack();
            })
            //that.getOpenID(code, res.encryptedData, res.iv) //调用服务器api

          },
          fail: function() {
            that.setData({
              loginBtn_show: true
            })
            wx.setStorageSync('userInfo', '0');
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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