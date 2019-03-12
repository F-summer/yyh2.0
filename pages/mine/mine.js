// pages/mine/mine.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const loginApi = require("../../service/login.js").allServerApi;
const cardsApi = require("../../service/cards.js").allServerApi;
const mineApi = require("../../service/mine.js").allServerApi;
const errorFun = require("../../util/errorMsg.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numobj:null,
    imgCard:''
  },
  getMoney(){
    mineApi.getMoney({
      mp_openid: wx.getStorageSync('openid'),
      total_fee:100
    }, function (res) {
    wx.showModal({
      title: '提示',
      content: '提现成功',
    })
    }, function (error) {
      wx.showModal({
        title: '提示',
        content: '提现失败',
      })
    });
  },
  init(){
    let that = this;
    cardsApi.getCardNum({
      mp_openid: wx.getStorageSync('openid'),
      scene_id: 11
    }, function (res) {
      //console.log(res)
      that.setData({
        numobj: res.data.data
      })
    }, function (error) {

    });
    cardsApi.getcardImg({
      mp_openid: wx.getStorageSync('openid'),
    }, res => {
      that.setData({
        imgCard: res.data.data
      });
      console.log(res)
    }, error => {
      console.log(error)
    });
  },
  //跳转connection
  connectionFun(){
    wx.navigateTo({
      url: '/pages/myConnection/myConnection',
    })
  },
  onLoad: function() {
    this.checkLogin()
    this.init();
    this.setData({
      avatarUrl: wx.getStorageSync("avatarUrl"),
      nickName: wx.getStorageSync("nickName")
    })
  },
  onShow:function(){
    this.init();
    this.setData({
      avatarUrl: wx.getStorageSync("avatarUrl"),
      nickName: wx.getStorageSync("nickName")
    })
  },
  checkLogin: function() {
    var that = this;
    var openid = wx.getStorageSync('openid')
    if (!openid) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  yijian:function(){
    wx.navigateTo({
      url: '/pages/feedback/feedback',
    }) 
  },
  mineGroup(){
    wx.navigateTo({
      url: '/pages/mine_group/mine_group',
    }) 
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (e) {
    var that = this
    return {
      title: '药友荟', // 转发标题（默认：当前小程序名称）
      imageUrl: "https://www.yaobc.info/images/yyh/yyh.png", 
      path: '/pages/index/index', // 转发路径（当前页面 path ），必须是以 / 开头的完整路径 
    }
  }

})