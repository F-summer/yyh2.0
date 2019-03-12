// pages/discover/discover.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const app = getApp();
const discoverApi = require('../../service/discover.js').allServerApi;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    choiceList: ["选地区", "选业务", "选主题"],
    indexCho: 0,
    cityShow: false,
    provinceList: [],
    cityList: [],
    bendi: wx.getStorageSync("addressRes") || '定位失败'
  },

  // 点击筛选
  choice: function(e) {
    let that = this;
    var ids = e.target.dataset.ids;
    that.loadType(ids);
    this.setData({
      indexCho: ids
    })
  },
  getCityShow: function(e) {
    let that = this;
    if (e.detail.id >0) {
      that.onLoadCityList(e.detail);
    }else{
      that.returnCity({ detail: { "name": e.detail.name, "id": "0" } });
    }
  },
  returnCity: function(e) {
    let that = this;
    if (e.detail.name.length > 0) {
      let pages = getCurrentPages();
      let currPage = null; //当前页面
      let prevPage = null; //上一个页面
      if (pages.length >= 2) {
        currPage = pages[pages.length - 1]; //当前页面
        prevPage = pages[pages.length - 2]; //上一个页面
      }
      if (prevPage) {
        prevPage.setData({
          cityName: e.detail
        });
      }
      wx.navigateBack();
    } else {
      that.setData({
        cityShow:false
      })
    }
  },
  getBusinessName: function(e) {
    let that = this;
    let pages = getCurrentPages();
    let currPage = null; //当前页面
    let prevPage = null; //上一个页面
    if (pages.length >= 2) {
      currPage = pages[pages.length - 1]; //当前页面
      prevPage = pages[pages.length - 2]; //上一个页面
    }
    if (prevPage) {
      prevPage.setData({
        businessName: e.detail
      });
    }
    wx.navigateBack();
  },
  getThemeName: function(e) {
    let that = this;
    let pages = getCurrentPages();
    let currPage = null; //当前页面
    let prevPage = null; //上一个页面
    if (pages.length >= 2) {
      currPage = pages[pages.length - 1]; //当前页面
      prevPage = pages[pages.length - 2]; //上一个页面
    }
    if (prevPage) {
      prevPage.setData({
        themeName: e.detail
      });
    }
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    app.locationFun();
    var that = this;

    //var index = options.index;
    that.setData({
      indexCho: 0
    })
    that.loadType(0);
  },
  loadType: function(index) {
    if (index == 0) {
      this.onLoadProvince();
    } else if (index == 1) {
      this.getBusinessList();
    } else {
      this.getThemeList()
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onReady: function() {

  },
  //加载省列表
  onLoadProvince: function() {
    let that = this;
    discoverApi.getProvinceList({
      mp_openid: wx.getStorageSync('openid')
    }, function(suc) {
      //console.log(suc);
      if (suc.data.result == 0) {
        that.setData({
          provinceList: suc.data.data,
        })
      }
    }, function(err) {
      //console.log(err);
    })
  },
  //加载市列表
  onLoadCityList: function(provinces) {
    let that = this;
    discoverApi.getCityList({
      mp_openid: wx.getStorageSync('openid'),
      province: provinces.id
    }, function(suc) {
     // console.log(suc);
      if (suc.data.result == 0 && suc.data.data.length>0) {
        that.setData({
          cityList: suc.data.data,
          cityShow: true
        })
      }else{
        that.setData({
          cityShow: false
        })
        that.returnCity({ detail: { "name": provinces.name, "id": provinces.id}});
      }
    }, function(err) {
     // console.log(err);
    })
  },
  //加载业务列表
  getBusinessList: function() {
    let that = this;
    discoverApi.getThemeOrBusiness({
      mp_openid: wx.getStorageSync('openid'),
      type: 1
    }, function(suc) {
      //console.log(suc.data.data);
      if (suc.data.result == 0) {
        that.setData({
          businessList: suc.data.data[0].list
        })
      }
    }, function(err) {
      //console.log(err);
    })
  },
  //加载主题列表
  getThemeList: function() {
    let that = this;
    discoverApi.getThemeOrBusiness({
      mp_openid: wx.getStorageSync('openid'),
      type: 2
    }, function(suc) {
      //console.log(suc.data.data);
      if (suc.data.result == 0) {
        that.setData({
          themeList: suc.data.data[0].list
        })
      }
    }, function(err) {
      //console.log(err);
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that =this;
    //app.locationFun();
    that.setData({
      bendi: wx.getStorageSync("addressRes")
    });
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