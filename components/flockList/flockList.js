// components/flockList/flockList.js
const app = getApp();
const flockListApi = require("../../service/flockList.js").allServerApi;
const group_descApi = require("../../service/group_desc.js").allServerApi;
const errorFun = require("../../util/errorMsg.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isfilex: {
      type: Boolean,
      value: false
    },
    headTop: {
      type: Boolean,
      value: false
    },
    cityName: {
      type: Object,
      value: {
        id: 0,
        name: '选地区'
      }
    },
    businessName: {
      type: Object,
      value: {
        name: '选业务',
        id: 0
      }
    },
    themeName: {
      type: Object,
      value: {
        name: '选主题',
        id: 0
      }
    },
    getAtherVal: {
      type: String,
      value: ''
    },
    pageIndex: {
      type: Number,
      value: 1
    },
    showActive: {
      type: Number,
      value: 1
    },
    cityActive:{
      type: Boolean,
      value: false
    }
    ,
    address: {
      type: String,
      value: wx.getStorageSync("addressRes")
    },
    textcont: {
      type: String,
      value: "---上拉加载更多---"
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showAlt: false,
    peopleNum: null,
    peopleNumArr: ['5-8万', '8-15万', '15-20万', '20万以上'],
    flockArr: [],
    sendId: null,
    haveMsg: true,
    arrLength: null
  },
  ready() {
    let that = this;
    //that.getDataList();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //获取列表
    getFlockListFun() {
      let that = this;
      if (that.data.typeNum == 1) {
        that.properties.themeName.id = 0
      } else if (that.data.typeNum == 2) {
        that.properties.businessName.id = 0
      }
      //重置数据
      if (that.properties.pageIndex == 1) {
        that.data.flockArr = [];
        that.setData({
          showTsBtn: false
        });
      }
      flockListApi.getflockList({
        mp_openid: wx.getStorageSync('openid'),
        province: wx.getStorageSync('addressRes') || that.properties.address,
        search: that.data.getAtherVal,
        areaid: that.properties.cityName ? that.properties.cityName.id : 0,
        categoryid: that.properties.businessName ? that.properties.businessName.id : 0,
        themeid: that.properties.themeName ? that.properties.themeName.id : 0,
        page_size: 10,
        page_index: that.properties.pageIndex
      }, function(successMsg) {
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        that.loadingInfoFun();
        if (successMsg.data.data instanceof Array) {
          if (successMsg.data.data.length > 0) {
            that.data.flockArr = that.data.flockArr.concat(successMsg.data.data)
            that.setData({
              haveMsg: true,
              flockArr: that.data.flockArr,
              arrLength: successMsg.data.total
            })
          }
          if (successMsg.data.data.length < 10) {
            that.tishiMsg()
          }
        } else {
          if (that.properties.pageIndex <= 1) {
            that.setData({
              haveMsg: false
            });
            that.tishiMsg()
          } else {
            that.tishiMsg()
          }
        }
        //console.log(successMsg)
      }, function(errorMsg) {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        errorFun(errorMsg)
        that.loadingInfoFun();
        wx.hideLoading();
        //console.log(errorMsg)
      })
    },
    //加群
    addFlock(e) {
      console.log(e)
      app.aldstat.sendEvent('点击加群了');
      //console.log(app.aldstat)
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
      if (!wx.getStorageSync("openid")) {
        var myEventDetail = {
          val: true
        }
        //this.triggerEvent('showLoginFun', myEventDetail);
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
      // let showLogin = app.getUserInfoFun();
      var myEventDetail = {
        val: e.currentTarget.dataset.id
      }
      this.triggerEvent('addGroup', myEventDetail);
      // if (!showLogin) {
      let that = this;
      that.setData({
        // showAlt: true,
        sendId: e.currentTarget.dataset.id,
        groupname: e.currentTarget.dataset.name
      });
      flockListApi.recordAddFlock({
        mp_openid: wx.getStorageSync('openid'),
        room_id: e.currentTarget.dataset.id
      }, function(res) {
        // console.log(res)
      }, function(error) {
        //console.log(error)
      });
      

      //}
    },
    headAlt() {
      let that = this;
      that.setData({
        showAlt: false
      })
    },
    formSubmit(e) {
      console.log(e.detail.formId);
    },
    //选择信息
    goSelectPag(e) {
      let that = this;
      // wx.navigateTo({
      //   url: '/pages/discover/discover?index=' + e.currentTarget.dataset.index
      // });
      that.data.typeNum = e.currentTarget.dataset.index;
      // if (that.data.typeNum == 1) {
      //   that.properties.themeName.name = '选主题'
      //   that.setData({
      //     themeName: that.properties.themeName
      //   })
      // } else if (that.data.typeNum == 2) {
      //   that.properties.businessName.name = '选业务'
      //   that.setData({
      //     businessName: that.properties.businessName
      //   })
      // }
      var myEventDetail = {
        val: e.currentTarget.dataset.index
      }
      this.triggerEvent('selectFun', myEventDetail);
    },
    //按人数选择
    peopleFun(e) {
      let that = this;
      that.setData({
        peopleNum: e.currentTarget.dataset.index
      })
    },
    //文字提示信息
    tishiMsg() {
      let that = this;
      that.setData({
        textcont: "找不到群？点击查看助力群列表",
        showTsBtn: true
      });
      that.triggerEvent('myevent');
    },
    //重置
    resetFun() {
      let that = this;
      if (that.data.loadingInfo) {
        that.triggerEvent('resetFun');
        that.setData({
          loadingInfo: false
        });
      }
    },
    //禁止多次加载
    loadingInfoFun() {
      let that = this;
      that.setData({
        loadingInfo: true
      });
    }
  }
})