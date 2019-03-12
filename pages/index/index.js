// pages/index/index.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const app = getApp();
const group_descApi = require("../../service/group_desc.js").allServerApi;
const discoverApi = require('../../service/discover.js').allServerApi;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isfilex: false,
    showLoading: true,
    cityName: {
      name: '地区',
      id: 0
    },
    businessName: {
      name: '选业务',
      id: 0
    },
    themeName: {
      name: '按主题',
      id: 0
    },
    pageIndex: 1,
    address: wx.getStorageSync("addressRes"),
    bendi: wx.getStorageSync("addressRes") || '定位失败',
    showLogo: false
  },
  goBuild() {
    wx.navigateTo({
      url: '/pages/construction_group/construction_group',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },
  //显示登录弹框
  showLoginFunD() {
    let that = this;
    that.setData({
      showLogo: true
    })
  },
  hideLoginFunD() {
    let that = this;
    that.setData({
      showLogo: false
    });
    if (that.data.typeName === 'ybc') {
      let optionNum = {
        detail: {
          val: that.data.ybcId
        }
      }
      that.addGroup(optionNum)

    }
    if (that.data.roomid) {
      var groupDes = that.selectComponent("#groupDes");
      groupDes.getInfo(that.data.roomid);
      that.setData({
        groupShow: true,
        gid: that.data.roomid
      })
    }
    if (that.data.options) {
      that.tankuang(that.data.options);
    }

  },
  //调用组件获取数据方法
  getDataFun() {
    let that = this;
    let flockList = that.selectComponent("#flockList");
    flockList.getFlockListFun();
    // let indexAther = that.selectComponent("#indexAther");
    // indexAther.getDataList()
  },
  // 监听滚动条
  onPageScroll: function(e) {
    let that = this;
    //console.log(e);//{scrollTop:99}
    if (e.scrollTop > 250) {
      //console.log("置顶");
      that.setData({
        isfilex: true
      })
    } else {
      that.setData({
        isfilex: false
      })
    }

  },
  //显示选择地区以及选业务和主题
  //0:地区 1：业务 2：按主题
  setSelctFun(option) {
    // console.log(option.detail.val)
    //console.log(wx.getStorageSync("addressRes"))
    if (option.detail.val == 0) {
      this.setData({
        provinceShow: true,
        bendi: wx.getStorageSync("addressRes")
      })
    } else if (option.detail.val == 1) {
      this.getBusinessList();
    } else if (option.detail.val == 2) {
      this.getThemeName();
      //this.getThemeList()
    }
  },
  //控制城市显示
  getCityShow: function(e) {
    //console.log(e.detail)
    let that = this;
    that.changCityName(e.detail);
    that.setData({
      cityActive: true
    });
    if (e.detail.id > 0) {
      that.onLoadCityList(e.detail);
    } else {
      that.setData({
        cityShow: false,
        cityActive:true
      });
    }
  },
  //加载市列表
  onLoadCityList: function(provinces) {
    let that = this;
    discoverApi.getCityList({
      mp_openid: wx.getStorageSync('openid'),
      province: provinces.id
    }, function(suc) {
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
        that.getDataFun();
      }
    }, function(err) {
      // console.log(err);
    })
  },
  //改变组件内容
  changCityName(options) {
    let that = this;
    let gTheme = that.selectComponent("#gTheme");
    gTheme.changNmaeCity(options);
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
          businessList: suc.data.data[0].list,
          businessShow: true
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
          themeList: suc.data.data[0].list,
          themeShow: true
        })
      }
    }, function(err) {
      //console.log(err);
    })
  },
  returnCity: function(e) {
    let that = this;
    that.changCityName(e.detail);
    this.setData({
      provinceShow: false,
      cityShow: false
    });
    that.setData({
      cityShow: false,
      cityId: e.detail.id,
      cityName: e.detail.name,
      provinceShow: false,
      cityName: e.detail,
      pageIndex: 1,
      textcont: "---上拉加载更多---",
      notHaveMsg: false,
      cityActive:true
    });
    that.getDataFun()
  },
  //业务回调方法
  getBusinessName: function(e) {
    console.log(e)
    let that = this;
    that.setData({
      businessName: e.detail,
      showActive: 1,
      pageIndex: 1,
      textcont: "---上拉加载更多---",
      notHaveMsg: false,
      themeName: {
        name: '按主题',
        id: 0
      }
    });
    wx.showLoading({
      title: '加载中',
    })
    that.getDataFun()
  },
  //主题回调方法
  getThemeName: function(e) {
    let that = this;
    that.setData({
      themeName: { name: "按主题", id: 86 },
      showActive: 2,
      pageIndex: 1,
      textcont: "---上拉加载更多---",
      notHaveMsg: false,
      businessName: {
        name: '选业务',
        id: 0
      },
    });
    wx.showLoading({
      title: '加载中',
    })
    that.getDataFun()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(options)
    let that = this;
    //app.locationFun();
    //药百川跳转显示加群卡片
    if (options.typeName === 'ybc') {
      that.setData({
        typeName: options.typeName,
        ybcId: options.id
      })
      if (!wx.getStorageSync("openid")) {
        that.showLoginFunD();
      } else {
        let optionNum = {
          detail: {
            val: options.id
          }
        }
        that.addGroup(optionNum)
      }
    }
    //that.getUserInfoFun();
    setTimeout(function() {
      that.setData({
        showLoading: false
      })
    }, 1000);
    // 文末卡片跳转
    if (options.roomid) {
      if (!wx.getStorageSync("openid")) {
        that.showLoginFunD();
        that.setData({
          roomid: options.roomid
        })
      } else {
        var groupDes = that.selectComponent("#groupDes");
        groupDes.getInfo(options.roomid);
        that.setData({
          groupShow: true,
          gid: options.roomid
        })
      }
    }

    let typeBol;
    let arr = [];
    if (options.scene) {
      arr = decodeURIComponent(options.scene).split(",");
      typeBol = arr[2];
    }
    if (typeBol == "live") {
      wx.setStorageSync("erweimauid", arr[0])
    }
    if (options.sdopenid || (options.scene && typeBol == "help")) {
      if (!wx.getStorageSync("openid")) {
        that.showLoginFunD();
        that.setData({
          options: options
        })
      } else {
        that.tankuang(options);
      }
    }
    //显示业务内容
    if (options.typeName === 'yw') {
      that.setData({
        cityName: {
          name: options.cityNmae,
          id: options.cityId
        },
        businessName: {
          name: options.typeofname,
          id: options.id
        },
        themeName: {
          name: '按主题',
          id: 0
        },
        showActive: 1,
      });
    }
    //显示主题内容
    if (options.typeName === 'zt') {
      that.setData({
        cityName: {
          name: options.cityNmae,
          id: options.cityId
        },
        businessName: {
          name: '选业务',
          id: 0
        },
        themeName: {
          name: options.typeofname,
          id: options.id
        },
        showActive: 2,
      });
    }
    that.setData({
      pageIndex: 1,
      address: wx.getStorageSync("addressRes"),
      textcont: "---上拉加载更多---",
      notHaveMsg: false
    });
    that.getDataFun();
  },
  // 控制弹框
  tankuang(options) {
    let that = this;
    let linshiOpenid;
    let linshiGid;
    let linshiArr;
    if (options.scene) {
      linshiArr = decodeURIComponent(options.scene).split(",");
      linshiOpenid = linshiArr[0];
      linshiGid = linshiArr[1];
      wx.setStorageSync("uid", linshiOpenid)
    } else {
      linshiOpenid = options.sdopenid
      linshiGid = options.gid
    }
    // "is_self": 0 / 1,//是否发起助力的本人，0否，1是
    group_descApi.getGroupInfo({
      mp_openid: wx.getStorageSync("openid"),
      id: linshiGid,
      type: 0, // 1（ 头像取随机头像 / 头像取助力头像）
      uid: options.scene ? linshiOpenid : '',
      openid: options.sdopenid ? linshiOpenid : ''
    }, function(res) {
      if (res.data.data.total == 0) {
        var groupDes = that.selectComponent("#groupDes");
        groupDes.getInfo(linshiGid);
        that.setData({
          groupShow: true,
          gid: linshiGid
        })
      } else {
        if (res.data.data.is_self == 0) {
          wx.setStorageSync("sdopenid", options.sdopenid)
          var zhuligroup = that.selectComponent("#zhuliGroup");
          zhuligroup.getInfo(linshiGid);
          that.setData({
            zhuliGroupShow: true,
            gid: linshiGid
          })
        } else {
          var groupDes = that.selectComponent("#groupDes");
          groupDes.getInfo(linshiGid);
          that.setData({
            groupShow: true
          })
        }
      }
    }, function(error) {
      console.log(error)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // app.locationFun();
    app.getUserInfoFun();
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
    this.setData({
      groupShow: false,
      zhuliGroupShow: false
    })
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
    let that = this;
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    that.data.cityName = {
      name: '地区',
      id: 0
    };
    let carousel = that.selectComponent("#carousel");
    carousel.getCarousel();
    that.setData({
      cityName: that.data.cityName
    });
    that.changCityName(that.data.cityName);
    that.reset();
  },
  reset() {
    let that = this;
    that.data.businessName = {
      name: '选业务',
      id: 0
    }
    that.data.themeName = {
      name: '按主题',
      id: 0
    },
    
    that.setData({
      businessName: that.data.businessName,
      themeName: that.data.themeName,
      pageIndex: 1,
      textcont: "---上拉加载更多---",
      notHaveMsg: false,
      showActive: 0,
      cityActive:false
    });
    wx.showLoading({
      title: '加载中',
    })
    that.getDataFun();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    if (that.data.notHaveMsg)
      return false
    that.setData({
      pageIndex: parseInt(that.data.pageIndex) + 1
    });
    wx.showLoading({
      title: '加载中',
    })
    that.getDataFun();
  },
  //改变提示文字
  changeText() {
    let that = this;
    that.setData({
      notHaveMsg: true
    });
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {

    if (res.target.dataset.kind == 'group') {
      return {
        title: '@我的好友，我发现一个好群，快来看看吧',
        imageUrl: 'https://www.yaobc.info/images/yyh/invitate.png',
        path: '/pages/index/index?gid=' + res.target.dataset.id + '&sdopenid=' + wx.getStorageSync("openid")
      }
    } else if (res.target.dataset.kind == 'zhuli') {
      return {
        title: '@我的好友，我发现一个好群，需要' + res.target.dataset.total + '个好友助力，快来助力吧',
        imageUrl: 'https://www.yaobc.info/images/yyh/invitate.png',
        path: '/pages/index/index?gid=' + res.target.dataset.id + '&sdopenid=' + wx.getStorageSync("openid")
      }
    }
  }
})