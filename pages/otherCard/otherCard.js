// pages/otherCard/otherCard.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const cardsApi = require("../../service/cards.js").allServerApi;
const errorFun = require("../../util/errorMsg.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataobj: null,
    numobj: null,
    showAlt: false,
    loadingIng: true,
    slf_uid: ''
  },
  showAltFun() {
    this.setData({
      showAlt: true
    })
  },
  hideAltFun(e) {
    var that = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.weixin,
      success: function(res) {
        that.setData({
          showAlt: false
        })
        // that.setData({copyTip:true}),
        // wx.showModal({
        //   title: '提示',
        //   content: '复制成功',
        //   success: function (res) {
        //     if (res.confirm) {
        //       this.setData({
        //         showAlt: false
        //       })
        //     } else if (res.cancel) {
        //       this.setData({
        //         showAlt: false
        //       })
        //     }
        //   }
        // })
      }
    });

  },
  checkLogin: function() {
    var that = this
    var openid = wx.getStorageSync('openid')
    if (!openid) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  callPhoneFun(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  edit() {
    wx.redirectTo({
      url: '/pages/edit/edit',
    })
  },
  getDataInit(option) {
    let that = this;
    cardsApi.getcardImg({
      mp_openid: wx.getStorageSync('openid'),
      userid: that.data.uid
    }, res => {
      that.setData({
        imgCard: res.data.data
      });
      console.log(res)
    }, error => {
      console.log(error)
    });
    cardsApi.cardOther({
      mp_openid: wx.getStorageSync('openid'),
      scene_id: 11,
      userid: option
    }, function(res) {
      console.log(res);
      that.setData({
        dataobj: res.data.data,
        loadingIng: false
      });
      cardsApi.getCardNum({
        mp_openid: wx.getStorageSync('openid'),
        scene_id: 11
      }, function(res) {
        console.log(res)
        that.setData({
          numobj: res.data.data,
          slf_uid: res.data.data.user_id
        });
        that.gzSee();
      }, function(error) {

      });
    }, function(error) {

    });

  },
  zanFun(e) {
    let that = this;
    if (that.data.dataobj.approval !== 0 || that.data.uid == that.data.numobj.user_id) {
      return false
    }
    let callBack = function() {
      that.data.dataobj.approval_num = that.data.dataobj.approval_num + 1;
      that.data.dataobj.approval = 1;
      that.setData({
        dataobj: that.data.dataobj
      })
    }
    this.dataTbpFun(2, that.data.uid, 11, callBack())
  },
  //关注
  gzFun(e) {
    let that = this;
    if (that.data.dataobj.follow !== 0 || that.data.uid == that.data.numobj.user_id) {
      return false
    }
    let callBack = function() {
      that.data.dataobj.follow_num = that.data.dataobj.follow_num + 1;
      that.data.dataobj.follow = 1;
      that.setData({
        dataobj: that.data.dataobj
      })
    }
    this.dataTbpFun(3, that.data.uid, 11, callBack())
  },
  //点赞关注接口
  dataTbpFun(...item) {
    let that = this;
    //相同uid不可以操作数量状态
    console.log(item[1] == that.data.numobj.user_id)
    if (item[1] == that.data.numobj.user_id) {
      // wx.showToast({
      //   title: '',
      // })
      return false
    } else {
      cardsApi.tapData({
        mp_openid: wx.getStorageSync('openid'),
        type: item[0],
        userid: item[1],
        scene_id: item[2]
      }, res => {
        wx.hideLoading();
        item[3];
        console.log(res)
      }, error => {
        wx.hideLoading();
        console.log(error)
      })
    }

  },
  //跳转信息
  navFun() {
    if (this.data.numobj.status == 1) {
      wx.navigateTo({
        url: '/pages/myConnection/myConnection',
      });
    } else {
      wx.navigateTo({
        url: '/pages/edit/edit',
      });
    }

  },
  //图片预览
  imgPre(e) {
    let src = e.currentTarget.dataset.src;
    let arr = new Array(src);
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  //查看
  gzSee() {
    let that = this;
    if (that.data.dataobj.visit !== 0 || that.data.uid == that.data.numobj.user_id) {
      return false
    }
    let callBack = function() {
      that.data.dataobj.visit_num = that.data.dataobj.visit_num + 1;
      that.data.dataobj.visit = 1;
      that.setData({
        dataobj: that.data.dataobj
      })
    }
    this.dataTbpFun(1, that.data.uid, 11, callBack())
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.checkLogin();
    that.setData({
      uid: options.uid
    });
    that.getDataInit(options.uid);

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
    let that = this;
    that.getDataInit(that.data.uid);
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
    let that = this;
    // cardsApi.getcardImg({
    //   mp_openid: wx.getStorageSync('openid'),
    // }, res => {
    //   that.setData({
    //     imgCard: res.data.data
    //   });
    //   //console.log(res)
    // }, error => {
    //   console.log(error)
    // });
    if (that.data.slf_uid == that.data.uid) {
      return {
        title: 'Hi～我是' + that.data.dataobj.real_name + '，很高兴认识您！',
        imageUrl: that.data.imgCard,
        path: '/pages/otherCard/otherCard?uid=' + that.data.uid + '&share=mine'
      }
    } else {
      return {
        title: 'Hi～我是' + that.data.dataobj.real_name + '，很高兴认识您！',
        imageUrl: that.data.imgCard,
        path: '/pages/otherCard/otherCard?uid=' + that.data.uid
      }
    }
    // return {
    //   title: 'Hi～我是' + that.data.dataobj.real_name + '，很高兴认识您！',
    //   imageUrl: 'https://www.yaobc.info/images/yyh/invitate.png',
    //   path: '/pages/index/index?gid=' + res.target.dataset.id + '&sdopenid=' + wx.getStorageSync("openid")
    // }
  }
})