// pages/group_desc/group_desc.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const flockListApi = require("../../service/flockList.js").allServerApi;
const group_descApi = require("../../service/group_desc.js").allServerApi;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(options)
    var that = this
    var gid = options.id ? options.id : options.scene;
    console.log(options)
    that.setData({
      id: gid
    })
    that.getInfo();
  },
  getInfo() {
    var that = this
    group_descApi.getGroupInfo({
      id: that.data.id,
      mp_openid: wx.getStorageSync("openid"),
      type: 1    
    }, function(res) {
      console.log(res)
      that.setData({
        name: res.data.data.room_name,
        src: res.data.data.head_img,
        desc: res.data.data.intro,
        sum: res.data.data.room_count,
        erweima: res.data.data.wx_code
      })
      let arr = [];
      arr.push(res.data.data.head_img);
      arr.push(res.data.data.wx_code);
      let canvas = that.selectComponent("#canvas");
      canvas.downloadFun(arr);
    }, function(error) {
      console.log(error)
    })
  },
  backmenu() {
    // wx.reLaunch({
    //   url: '/pages/index/index',
    // })
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  enjoygroup(e) {
    let that = this;
    console.log(e)
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
  //分享
  shearFun(e) {
    let that = this;
    let canvas = that.selectComponent("#canvas");
    console.log(e)
    let op = that.data;
    canvas.showFun(op)
  },
  headAlt() {
    let that = this;
    that.setData({
      showAlt: false
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
    wx.removeStorageSync("src")
    wx.removeStorageSync("erweima")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.removeStorageSync("src")
    wx.removeStorageSync("erweima")
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
  onShareAppMessage: function(e) {

    var that = this
    return {
      //生成海报部分代码
      // title: options.target.dataset.title, // 转发标题（默认：当前小程序名称）
      // path: '/pages/group_desc/group_desc?id=' + options.target.dataset.id, // 转发路径（当前页面 path ），必须是以 / 开头的完整路径
      // imageUrl: '/images/invitate.png',
      // success(res) {
      //   if (res.shareTickets) {
      //   }
      // }


      title: '邀请你加入' + that.data.name, // 转发标题（默认：当前小程序名称） 
      path: '/pages/group_desc/group_desc?id=' + that.data.id, // 转发路径（当前页面 path ），必须是以 / 开头的完整路径 



    }

  }
})