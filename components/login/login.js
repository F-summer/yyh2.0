// components/login/login.js
const app = getApp();
const loginApi = require("../../service/login.js").allServerApi;
const errorFun = require("../../util/errorMsg.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showLogo: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取用户信息
    onGotUserInfo() {
      let that = this;
      wx.login({
        success: function (e) {
          var code = e.code
          //console.log(code)
          wx.getUserInfo({
            withCredentials: true,
            lang: 'zh_CN',
            success: function (res) {
              //console.log(res.encryptedData,res.iv)
              wx.setStorageSync('nickName', res.userInfo.nickName);
              wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
              wx.getImageInfo({ //  小程序获取图片信息API
                src: res.userInfo.avatarUrl,
                success: function (res) {
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
              }, function (res) {
//                console.log(res.data.data)
                wx.setStorageSync('openid', res.data.data);
                wx.setStorageSync('userInfo', '1');
                //wx.navigateBack();
                that.triggerEvent('hideLoginFun');
              }, function (errorMsg) {
                wx.setStorageSync('userInfo', '0');
                errorFun("授权失败,请稍后再试");
                that.triggerEvent('hideLoginFun');
                //wx.navigateBack();
              })
             
            },
            fail: function () {
              that.setData({
                loginBtn_show: true
              })
              wx.setStorageSync('userInfo', '0');
            }
          })
        }
      })
    },
  }
})
