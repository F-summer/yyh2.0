// pages/mycard/mycard.js
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
    numobj: null
  },
  edit(){
    wx.redirectTo({
      url: '/pages/edit/edit',
    })
  },
  myPoster(){
    wx.showLoading({
      title: '生成下载在本地中，请稍等！',
    })
    let that =this;
    cardsApi.havePoster({
      mp_openid: wx.getStorageSync('openid'),
    }, function (res) {
      console.log(res)
      that.setData({
        posterImg: res.data.data
      });
      that.downloadFun(res.data.data)
    }, function (error) {

    });
  },
  //下载图片到本地
  downloadFun(src) {
    let that = this;
    wx.getImageInfo({ //  小程序获取图片信息API
      src: src,
      success: function (res) {
        if (res.errMsg="getImageInfo:ok"){
          wx.saveImageToPhotosAlbum({
            filePath: res.path,
            success(res) {
              wx.hideLoading();
              wx.showModal({
                title: '海报已保存到系统相册',
                content: '快去分享到朋友圈，叫小伙伴来围观吧！',
                success(res) {
                  if (res.confirm) {
                    wx.hideLoading()
                  } else {
                    wx.hideLoading()
                  }
                }
              })

            },
            fail(res) {
              console.log(res)
              wx.hideLoading()
            }
          })
        }else{
          wx.hideLoading();
          wx.showToast({
            title: '下载失败，请重试！',
          })
        }
      },
      fail(err) {
        //          console.log(err)
      }
    })
  },
  imgPre(e){
    let src = e.currentTarget.dataset.src;
    let arr = new Array(src);
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  getDataInit() {
    let that = this;
    cardsApi.getCardsData({
      mp_openid: wx.getStorageSync('openid'),
      scene_id: 11
    }, function(res) {
      console.log(res)
      wx.hideLoading();
      that.setData({
        dataobj: res.data.data
      })
    }, function(error) {

    });
    cardsApi.getCardNum({
      mp_openid: wx.getStorageSync('openid'),
      scene_id: 11
    }, function(res) {
      console.log(res)
      that.setData({
        numobj: res.data.data
      })
    }, function(error) {

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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.showLoading({
      title: '获取数据中',
    })
    that.getDataInit();
    wx.showShareMenu({
      withShareTicket: true
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

    return {
      title: 'Hi～我是'+that.data.dataobj.real_name+'，很高兴认识您！',
      imageUrl: that.data.imgCard,
      path: '/pages/otherCard/otherCard?uid=' + that.data.numobj.user_id +'&share=mine'
    }
  }
})