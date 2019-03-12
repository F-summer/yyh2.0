// pages/applyPage/applyPage.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const app = getApp();
const loginApi = require("../../service/login.js").allServerApi;
const applyApi = require("../../service/apply.js").allServerApi;
const errorFun = require("../../util/errorMsg.js");
const discoverApi = require('../../service/discover.js').allServerApi;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAlt: false,
    typenum:0,
    typeArr: [],
    typeindex:0,
    typeindexT:0,
    showApply:false,
    cityName: {
      name: '选地区',
      id: null
    },
    businessName: {
      name: '业务型',
      id: null
    },
    themeName: {
      name: '选主题',
      id: null
    },
    sendId:null,
    showBtn:false,
    showThem:false,
    themArr:[]
  },
  goSelectPag(e) {
    let that= this;
    if (e.currentTarget.dataset.index == 0) {
      this.setData({
        provinceShow: true,
        bendi: wx.getStorageSync("addressRes")
      })
    }
    // wx.navigateTo({
    //   url: '/pages/discover/discover?index=' + e.currentTarget.dataset.index + '&url=' + 'apply' + '&typenum=' + that.data.typenum
    // })
  },
  //控制城市显示
  getCityShow: function (e) {
    let that = this;
    if (e.detail.id > 0) {
      that.onLoadCityList(e.detail);
    }
  },
  //加载市列表
  onLoadCityList: function (provinces) {
    let that = this;
    discoverApi.getCityList({
      mp_openid: wx.getStorageSync('openid'),
      province: provinces.id
    }, function (suc) {
      // console.log(suc);
      if (suc.data.result == 0 && suc.data.data.length > 0) {
        that.setData({
          cityList: suc.data.data,
          cityShow: true
        })
      } else {
        that.setData({
          cityShow: false,
          cityId: provinces.id,
          cityName: provinces.name,
          provinceShow: false,
          cityName: provinces
        });
        that.getDataFun()
      }
    }, function (err) {
      // console.log(err);
    })
  },
  returnCity: function (e) {
    let that = this;
    this.setData({
      provinceShow: false,
      cityShow: false
    });
    that.setData({
      cityShow: false,
      cityId: e.detail.id,
      cityName: e.detail.name,
      provinceShow: false,
      cityName: e.detail
    });
  },
  showAltFun() {
    let that = this;
    if (that.data.typenum==1){
      that.setData({
        showAlt: true
      })
    }else{
      that.setData({
        showThem: true
      })
    }
    
  },
  hideAltFun() {
    let that = this;
    that.setData({
      showAlt: false,
      themeName: that.data.themeName,
      showThem: false,
      businessName: that.data.businessName
    });
    
  },
  //验证信息
  testFun(e){
    let that = this;
    if (that.data.cityName.name == "选地区") {
      errorFun("请选择地区");
      return false
    }
    if (that.data.businessName.name == "业务型" && that.data.typenum == 0) {
      errorFun("请选择业务型");
      return false
    }
    if (that.data.themeName.name == "选主题" && that.data.typenum == 1) {
      errorFun("请选择选主题");
      return false
    } 
    that.data.sendId = that.data.typenum == 0 ? that.data.businessName.id : that.data.themeName.id;
    //创建群
    console.log("formid", e.detail.formId)
    applyApi.applyServe({
      'mp_openid': wx.getStorageSync('openid'),
      'type': that.data.typenum,
      'type_id': that.data.sendId,
      'areaid': that.data.cityName.id,
      'form_id': e.detail.formId
    }, function (successMsg) {
     // errorFun("已经提交创建群申请");
      wx.showModal({
        title: '提示',
        content: '您的申请已提交，6天内助力成功即开群，马上邀请好友帮忙助力吧',
        success: function (res) {
          // wx.reLaunch({
          //   url: '/pages/index/index',
          // });
          wx.switchTab({
            url: '/pages/index/index',
          });
        },
        fail: function (res) {
          // wx.reLaunch({
          //   url: '/pages/index/index',
          // })
          wx.switchTab({
            url: '/pages/index/index',
          });
         }
      })
     
    }, function (errorMsg) {
      errorFun(errorMsg);
    })
  },
  //选择主题
  getTypeFun(e) {
    //console.log(e)
    let that = this;
    if (that.data.typenum == 1){
      that.setData({
        typeindex: e.currentTarget.dataset.index
      });
      that.data.themeName.id = e.currentTarget.dataset.id;
      that.data.themeName.name = e.currentTarget.dataset.name
    }else{
      that.data.businessName.id = e.currentTarget.dataset.id;
      that.data.businessName.name = e.currentTarget.dataset.name;
      that.setData({
        typeindexT: e.currentTarget.dataset.index
      });
    }
  },
  //获取手机号
  getPhoneNumber(e){
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
          })
        }, function (errorMsg) {
          wx.setStorageSync('hasPhoneNum', '1');
          errorFun(errorMsg);
        })
       }
    });
  },
  getDataFun(){
    let that = this;
    discoverApi.getThemeOrBusiness({
      mp_openid: wx.getStorageSync('openid'),
      type: 2
    }, function (suc) {
      if (suc.data.result == 0) {
        that.setData({
          typeArr: suc.data.data[0].list
        })
      }
    }, function (err) {
      //console.log(err);
    });
    discoverApi.getThemeOrBusiness({
      mp_openid: wx.getStorageSync('openid'),
      type: 1
    }, function (suc) {
      if (suc.data.result == 0) {
        that.setData({
          themArr: suc.data.data[0].list
        })
      }
    }, function (err) {
      //console.log(err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that =this;
    if (wx.getStorageSync('hasPhoneNum')=='0'){
      that.setData({
        showApply:true
      })
    }else{
      that.setData({
        showApply: false
      });
    }
    that.setData({
      typenum: options.type
    });
    that.getDataFun();
    //console.log(options.type)
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

  }
})