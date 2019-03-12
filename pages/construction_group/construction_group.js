// pages/construction_group/construction_group.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
let contruction = require('../../service/construction_group.js').allServerApi;
const loginApi = require("../../service/login.js").allServerApi;
const errorFun = require("../../util/errorMsg.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sort: "时间降序",
    sortIndex: 0,
    sortShow: false,
    searchWord: '',
    page_index: 1,
    load_more:"--- 正在加载更多 ---",
    more: true,
    groupList: [],
    FXRid: '',
    have:false
  },
  // 排序事件
  sortStart: function() {
    this.setData({
      sortShow: true
    })

  },
  // 排序改变
  sortStyle: function(e) {
    this.setData({
      sort: e.detail.text,
      sortIndex: e.detail.index,
      page_index: 1,
      groupList: []
    })
    this.getGroupList()
  },
  // 申请建群
  applyFun: function() {
    wx.navigateTo({
      url: '/pages/choiceFlock/choiceFlock',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let showLogin = app.getUserInfoFun();
    //this.getGroupList();
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
  },
  //获取手机号
  getPhoneNumber(e) {
    let that = this;
    let event = e;
    wx.login({
      success: function (e) {
        //console.log(e.code,event.detail.iv, event.detail.encryptedData)
        loginApi.getPhone({
          mp_openid: wx.getStorageSync('openid'),
          iv: event.detail.iv,
          encryptedData: event.detail.encryptedData,
          code: e.code
        }, function (successMsg) {
          wx.setStorageSync('hasPhoneNum', '0');
          that.setData({
            showApply: true
          });
          that.applyFun();
        }, function (errorMsg) {
          wx.setStorageSync('hasPhoneNum', '1');
          errorFun("很遗憾你无法建群，请重新授权手机号");
        })
      }
    });
  },
  searchWord: function(e) {
    this.setData({
      searchWord: e.detail.value,
      groupList: [],
      page_index: 1
    })
    this.getGroupList()
  },
  //获取待建群列表
  getGroupList: function() {
    let that = this
    const pageSize = 5
    contruction.getContructionList({
      mp_openid: wx.getStorageSync('openid'),
      province: wx.getStorageSync('addressRes'),
      sort: that.data.sortIndex, //排序方式 0 剩余时间降序 1 剩余时间升序 2 助力人数降序 3 助力人数升序 0 为默认(必填)
      search: that.data.searchWord,
      page_size: pageSize,
      page_index: that.data.page_index
    }, function(suc) {
      if (suc.data.data.length > 0 && that.data.page_index==1){
        that.setData({
          have: true
        })
      }
      if (suc.data.data.length > 0) {
        if (suc.data.data.length == pageSize) {
          that.setData({
            groupList: that.data.groupList.concat(suc.data.data),
            load_more: "--- 正在加载更多 ---",
            more: true
          })
        } else {
          that.setData({
            groupList: that.data.groupList.concat(suc.data.data),
            load_more: "--- 已经到底了 ---",
            more: false
          })
        }
      } else {
        that.setData({
          load_more: "--- 已经到底了 ---",
          more: false
        })
      }
    }, function(err) {

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
    let that = this
    that.setData({
      sort: "时间降序",
      sortIndex: 0,
      sortShow: false,
      searchWord: '',
      page_index: 1,
      more: true,
      load_more: "--- 正在加载更多 ---",
      groupList: []
    })
    that.getGroupList();
    if (wx.getStorageSync('hasPhoneNum') == '0') {
      that.setData({
        showApply: true
      })
    } else {
      that.setData({
        showApply: false
      });
    }
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
    let that = this
    wx.showNavigationBarLoading();
    that.setData({
      sort: "时间降序",
      sortIndex: 0,
      sortShow: false,
      searchWord: '',
      page_index: 1,
      more: true,
      load_more: "--- 正在加载更多 ---",
      groupList: []
    })
    that.getGroupList()
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    if (that.data.more) {
      wx.showLoading({
        title: '正在加载'
      })
      var page_index = that.data.page_index + 1;
      that.setData({
        page_index: page_index
      })

      that.getGroupList()

      wx.hideLoading()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(option) {

    if (option.target.dataset.openid.length > 0) {
      return {
        title: '我正在申请建立' + option.target.dataset.name + ',希望你能帮忙助力', // 转发标题（默认：当前小程序名称）
        path: '/pages/invitate/invitate?openid=' + wx.getStorageSync("openid") + "&id=" + option.target.dataset.id + "&img=" + wx.getStorageSync("avatarUrl") + "&name=" + wx.getStorageSync("nickName"), // 转发路径（当前页面 path ），必须是以 / 开头的完整路径
        imageUrl: 'https://www.yaobc.info/images/yyh/invitate.png',
        success(res) {
          if (res.shareTickets) {

          }
        }
      }
    }

  },
  // 邀请助力
  invitateZl: function(openid, id) {
    var that = this
    contruction.zhuli({
      mp_openid: wx.getStorageSync("openid"),
      id: id,
      openid: openid
    }, function(suc) {}, function(err) {})

  }

})