// pages/searchPage/searchPage.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const app = getApp();
const group_descApi = require("../../service/group_desc.js").allServerApi;
const flockListApi = require("../../service/flockList.js").allServerApi;
const errorFun = require("../../util/errorMsg.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headTop: true,
    haveResult: false,
    searchVal: '搜索您感兴趣的群',
    getAtherVal: '',
    pageIndex: 1,
    textcont: "---上拉加载更多---"
  },
  //输入内容记录
  oninputFun(e) {
    let that = this;
    let serachV = e.detail.value
    that.setData({
      getAtherVal: serachV
    });
  },
  //开始搜索
  onSearch(e) {
    let that = this;
    that.setData({
      haveResult: true
    });
    wx.showLoading({
      title: '查询中',
    });
    group_descApi.addGroupType({
      mp_openid: wx.getStorageSync("openid"),
      id: e.target.dataset.id,
      form_id: e.detail.formId,
      type: e.target.dataset.type
    }, function (res) {
      console.log(res)
    }, function (error) {
      console.log(error)
    })
    flockListApi.sendOldHertList({
      mp_openid: wx.getStorageSync('openid'),
      content: e.currentTarget.dataset.value
    }, function(successMsg) {
      wx.hideLoading();
      //console.log(successMsg)
    }, function(errorMsg) {
      wx.hideLoading();
      //console.log(errorMsg)
    })
    that.component();
    that.showClearFun()
  },
  //显示清除按钮
  showClearFun() {
    let that = this;
    that.setData({
      showClearBtn: true
    });
  },
  // 清除搜索框
  clearFun() {
    let that = this;
    that.component();
    that.setData({
      haveResult: false,
      showClearBtn: false,
      getAtherVal: '',
      searchVal: '搜索您感兴趣的群',
      serchType: false,
      pageIndex: 1,
      notHaveMsg: false,
      textcont: "---上拉加载更多---"
    });
  },
  // //取消
  // cancerFun(){
  //   wx.navigateBack({
  //     delta: 1
  //   })
  // },
  //接收热门搜索/搜索历史传来的值
  changSearchVal(e) {
    let that = this;
    that.setData({
      getAtherVal: e.detail.val,
      haveResult: true
    });
    wx.showLoading({
      title: '查询中',
    })
    that.component();
  },
  component() {
    let that = this;
    let flockList = that.selectComponent("#flockList");
    flockList.getFlockListFun();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log(options)
    if (options.name) {
      that.setData({
        searchVal: options.name,
        getAtherVal: options.name
      });
      that.setData({
        haveResult: true
      });
      that.component();
      that.showClearFun();
    }
  },
  addGroup(option) {
    var that = this
    that.setData({
      groupShow: true,
      gid: option.detail.val
    })
    var group = that.selectComponent("#groupDes");
    group.getInfo(option.detail.val);
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
    let that = this;
    if (that.data.notHaveMsg)
      return false
    that.setData({
      pageIndex: that.data.pageIndex + 1
    });
    wx.showLoading({
      title: '加载中',
    })
    that.component();
  },
  //改变提示文字
  changeText() {
    let that = this;
    that.setData({
      textcont: "找不到更多的群？查看待开通群列表",
      notHaveMsg: true
    });

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.target.dataset.kind == 'group') {
      return {
        title: '@我的好友，我发现一个好群，快来看看吧',
        imageUrl: '/images/invitate.png',
        path: '/pages/index/index'
      }
    } else if (res.target.dataset.kind == 'zhuli') {
      return {
        title: '@我的好友，我发现一个好群，需要' + res.target.dataset.total + '个好友助力，快来助力吧',
        imageUrl: '/images/invitate.png',
        path: '/pages/index/index?gid=' + res.target.dataset.id + '&sdopenid=' + wx.getStorageSync("openid")
      }
    }
  }
})