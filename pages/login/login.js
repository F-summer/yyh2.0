// pages/login/login.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const loginApi = require("../../service/login.js").allServerApi;
var QQMapWX = require('../../util/qqmap-wx-jssdk.js');
const errorFun = require("../../util/errorMsg.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showloging: true,
    showPhone: false,
    showBack: false,
    showAddress: true,
    showAddressBtn: false,
    resetLoaction: false
  },
  getUserInfo: function () {
    var that = this
    wx.login({
      success: function (e) {
        var code = e.code
        console.log(code)
        wx.getUserInfo({
          withCredentials: true,
          lang: 'zh_CN',
          success: function (res) {
            var nickName = res.userInfo.nickName
            var avatarUrl = res.userInfo.avatarUrl
            that.setData({
              showloging: false,
              showPhone: true
            })
            wx.setStorageSync('nickName', nickName)
            wx.setStorageSync('avatarUrl', avatarUrl)
            loginApi.getOppenId({
              code: code,
              encryptedData: res.encryptedData,
              iv: res.iv,
            }, function (res) {
              //console.log(res.data.data)
              wx.setStorageSync('openid', res.data.data);
              wx.setStorageSync('userInfo', '1');
              // wx.navigateBack();
            }, function (errorMsg) {
              wx.setStorageSync('userInfo', '0');
              errorFun("授权失败,请稍后再试");
              //wx.navigateBack();
            })
            wx.getImageInfo({ //  小程序获取图片信息API
              src: avatarUrl,
              success: function (res) {
                that.data.head_img = res.path;
                that.data.allNum = 1 + that.data.allNum;
                wx.setStorageSync('head_img', res.path);
              },
              fail(err) {
                console.log(err)
              }
            })
          },
          fail: function () {
            that.setData({
              loginBtn_show: true
            })
          }
        })
      }
    })
  },
  //获取手机号
  getAdderss() {
    if (this.data.resetLoaction) {
      this.locationFunMore();
    } else {
      this.locationFun();
    }

  },
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
          wx.setStorageSync('phoneNum', successMsg.data.data.phone);
          that.setData({
            showloging: false,
            showPhone: false,
            showAddress: false,
            showAddressBtn: true
          })
          //that.voteFun();
        }, function (errorMsg) {
          wx.setStorageSync('hasPhoneNum', '1');
          errorFun("应国家法律要求，需获取您手机号用于认证");
          that.setData({
            showPhonebtn: true
          });
        })
      }
    });
  },
  locationFun() {
    //定位地址
    var that = this
    // 实例化腾讯地图API核心类
    var qqmapsdk = new QQMapWX({
      key: 'IIDBZ-BZCC6-XVLSJ-E2CJM-N52RE-W2FER' // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //console.log(res)
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            //console.log(addressRes)
            let address = addressRes.result.address_component.province;
            wx.setStorageSync('addressRes', address);
            // console.log(wx.getStorageSync("addressRes"))
            // console.log(addressRes.result.address_component.nation)
            if (wx.getStorageSync('openid')) {
              loginApi.sendMyPlace({
                mp_openid: wx.getStorageSync('openid'),
                latitude: res.latitude,
                longitude: res.longitude,
                country: addressRes.result.address_component.nation,
                province: addressRes.result.address_component.province,
                city: addressRes.result.address_component.city
              }, function (successMsg) {
                that.setData({
                  showloging: false,
                  showPhone: false,
                  showAddress: false,
                  showAddressBtn: false,
                  showBack: true,
                })
                //console.log(successMsg)
              }, function (errorMsg) {
                errorFun(errorMsg)
              })
            }
          }
        })
      },
      fail(res) {
        that.setData({
          resetLoaction: true
        })
      }
    });
  },
  //定位
  locationFunMore() {
    var that = this
    //1、获取当前位置坐标
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userLocation"] == true) {
          console.log("用户已开启定位授权");
        } else {
          wx.showModal({
            title: '位置信息授权',
            content: '位置授权暂未开启，无法加入本地群',
            confirmText: '开启授权',
            confirmColor: '#345391',
            cancelText: '仍然拒绝',
            cancelColor: '#999999',
            success: function (res) {
              if (res.confirm) {
                //that.locationFunMore();
                wx.openSetting({
                  success(res) {
                    //console.log(res.authSetting)
                    res.authSetting = {
                      "scope.userLocation": true
                    }
                    that.locationFun();
                  }
                })
              }
              if (res.cancel) {
                wx.showModal({
                  title: '加入本地群将失败',
                  content: '无法使用定位权限，加入本地群失败',
                  confirmText: '太遗憾了',
                  confirmColor: '#345391',
                  showCancel: false
                })
              }
            }
          })
        }

      }
    })

  },
  // locationFun() {
  //   //定位地址
  //   var that = this
  //   // 实例化腾讯地图API核心类
  //   wx.getLocation({
  //     type: 'wgs84',
  //     success: function (res) {
  //       console.log(res)
  //       that.setData({
  //         showloging: false,
  //         showPhone: false,
  //         showAddress:false,
  //         showAddressBtn:false,
  //         showBack:true,
  //       })
  //     }
  //   });
  // },
  backFun() {
    wx.switchTab({
      url: '/pages/index/index',
    })
    //wx.navigateBack();
    // wx.navigateBack({
    //   delta: 1
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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