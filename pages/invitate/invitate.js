// pages/invitate/invitate.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const invitateAPI = require("../../service/invitate.js").allServerApi;
let contruction = require('../../service/construction_group.js').allServerApi;
const flockListApi = require("../../service/flockList.js").allServerApi;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    FXRid: '',
    groupID: 0,
    userInfoList: []

  },
  getZhuliInfo: function() {
    var that = this
    invitateAPI.getZhuli({
      mp_openid: wx.getStorageSync("openid"),
      id: that.data.groupID
    }, function(suc) {
      // console.log(suc);
      if (suc.data.result == 0) {
        if (suc.data.data.list.length > 3) {
          that.setData({
            userInfoList: suc.data.data.list,
            objInfo: suc.data.data,
            lenth: 3
          })
        } else {
          that.setData({
            userInfoList: suc.data.data.list,
            objInfo: suc.data.data,
            lenth: suc.data.data.list.length
          })
        }

        that.daojishi(suc.data.data.help_finish_time)
      }
    }, function(err) {
      //console.log(err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let showLogin = app.getUserInfoFun();
    let that = this;
    //console.log(options)
    if (options.openid && options.id) {
      wx.setStorageSync("fxrID", options.openid);
      wx.setStorageSync("groupID", options.id);
      this.setData({
        FXRid: options.openid,
        groupID: options.id,
        username: options.name,
        avatarUrl:options.img
      })
    }
   

  },
  onShow: function() {
    let that = this;
    that.getZhuliInfo()
  },
  headAlt() {
    let that = this;
    that.setData({
      showAlt: false
    })
  },
  daojishi: function(date) {
    var that = this;
    this.data.intervarID = setInterval(function() {

      var leftTime = date - Date.parse(new Date()) / 1000;
      if (leftTime > 0) {
        var days = parseInt(leftTime / 60 / 60 / 24, 10); //计算剩余的天数 
        var hours = parseInt(leftTime / 60 / 60 % 24, 10); //计算剩余的小时 
        var minutes = parseInt(leftTime / 60 % 60, 10); //计算剩余的分钟 
        var seconds = parseInt(leftTime % 60, 10); //计算剩余的秒数 

        that.setData({
          clock: "剩余时间" + days + " 天 " + hours + " : " + minutes + " : " + seconds
        })
        // console.log(that.data.clock);
        if (days == '00' && hours == '00' && minutes == '00' && seconds == '00') {
          clearInterval(that.data.intervarID);
          that.setData({
            clock: '已结束'
          })
        }
      } else {
        that.setData({
          clock: ''
        })
      }
    }, 1000)
  },

  // 我要助力
  zhuliFun: function() {
    //console.log("我要助力");
    var that = this
    contruction.zhuli({
      mp_openid: wx.getStorageSync("openid"),
      id: that.data.groupID,
      openid: that.data.FXRid
    }, function(suc) {
      //console.log(suc);
      wx.showModal({
        title: '提示',
        content: suc.data.message,
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // wx.reLaunch({
            //   url: '/pages/index/index',
            // })
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    }, function(err) {
      //console.log(err);
      wx.showModal({
        title: '提示',
        content: suc.data.message,
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // wx.reLaunch({
            //   url: '/pages/index/index',
            // })
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    })
  },
  // 加入该群
  injoygroup: function(e) {
    // console.log(e)
    let that = this;
    that.setData({
      showAlt: true,
      sendId: e.currentTarget.dataset.id
    });
    flockListApi.recordAddFlock({
      mp_openid: wx.getStorageSync('openid'),
      room_id: e.currentTarget.dataset.id
    }, function(res) {
      // console.log(res)
    }, function(error) {
      //console.log(error)
    })
  },
  // 更多群
  moreGroup: function() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
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
  onShareAppMessage: function(options) {
    return {
      title: '有关医保招标等政策闭门座谈会登记表',
      imageUrl: 'https://www.yaobc.info/images/yyh/hiyi-top.png'
    }
  }
})