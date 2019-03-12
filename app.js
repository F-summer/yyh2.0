var App = require('./utils/ald-stat.js').App;
var App = require('./utils/pushsdk.js').pushSdk(App, 'App').App;
var QQMapWX = require('util/qqmap-wx-jssdk.js');
const loginApi = require("service/login.js").allServerApi;
const errorFun = require("util/errorMsg.js");
App({
  globalData: {
    userInfo: null,
    postUrl: 'https://www.yaobc.info/api/yyq/api.ashx?action=',

    postUrlTwo: 'https://www.yaobc.info/api/yyq/api.ashx?action=',

    /* postUrl: 'http://localhost:55708/api/sp/api.ashx?action=',  */

    /*获取新闻*/
    News: '48a63e63-576a-40fb-bd40-5c54bb074fa1',
    /*用户登录*/
    Login: 'f2971551-cae6-4810-94ec-fbcaeeb3763e',
    /*数据解密*/
    AESDecrypt: '20b735bc-6482-4614-9053-19651ab9244f',
    /*获取文章url*/
    NewsUrl: '2afe046a-c83a-4ac2-ae1a-69a2776b0b45',
    openid: wx.getStorageSync('openid'),
    addressRes: wx.getStorageSync('addressRes') || "定位失败"
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function() {
          wx.getUserInfo({
            success: function(res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
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
            success: function(res) {
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
  locationFun() {
    //定位地址
    var that = this
    // 实例化腾讯地图API核心类
    var qqmapsdk = new QQMapWX({
      key: 'IIDBZ-BZCC6-XVLSJ-E2CJM-N52RE-W2FER' // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        //console.log(res)
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(addressRes) {
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
              }, function(successMsg) {
                //console.log(successMsg)
              }, function(errorMsg) {
                errorFun(errorMsg)
              })
            }
          }
        })
      }
    });
  },
  //获取用户信息并授权
  getUserInfoFun() {
    let that = this;
    let showLogin = false;
    let getVal = wx.getStorageSync("userInfo");
    if (!getVal || getVal === '0') {
      showLogin = true;
      // wx.navigateTo({
      //   url: '/pages/login/login',
      // });
      wx.reLaunch({
        url: '/pages/login/login',
      });
      // wx.switchTab({
      //   url: '/pages/mine/mine',
      // });
    }
    return showLogin
  },
  fmtDate(obj) {

    var days = Math.floor(obj / (24 * 3600 * 1000))
    //计算出小时数
    var leave1 = obj % (24 * 3600 * 1000)
    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000)
    //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000)
    //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    if (days == 0) {
      return hours + "小时" + minutes + "分钟" + seconds + "秒"
    } else {
      return days + "天" + hours + "小时" + minutes + "分钟" + seconds + "秒"
    }

  },
  fmtDateT(obj) {
    var date = new Date(obj);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
  },
  //formid
  shareFun(e) {
    let that = this;
    //that.data.id = e.target.dataset.id || that.data.id
    liveApi.sendMark({
      mp_openid: wx.getStorageSync('openid'),
      id: e.target.dataset.id,
      'type': e.target.dataset.type || 7,
      form_id: e.detail.formId
    }, function (res) {
//      console.log(res)
    }, function (error) {
      errorFun(error)
    })
  },
})