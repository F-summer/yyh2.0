// components/province/province.js
const app = getApp();
const discoverApi = require('../../service/discover.js').allServerApi;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    province: {
      type: Array
    },
    bendi: {
      type: String,
      value: wx.getStorageSync("addressRes")
    },
    provinceShow: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    letter: []
  },
  ready: function() {
    let that = this;
    that.onLoadProvince();
    var windowHeight = wx.getSystemInfoSync().windowHeight;
    that.setData({
      cityHeight: windowHeight * (750 / wx.getSystemInfoSync().windowWidth) - 100,
    });
    //console.log(wx.getStorageSync("addressRes"))

  },
  /**
   * 组件的方法列表
   */
  methods: {
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
    choiceLetter: function(e) {
      var ids = e.target.dataset.letter;
      this.setData({
        ids: ids
      })
    },
    choiceProvince: function(e) {
      var province = {
        id: e.target.dataset.id,
        name: e.target.dataset.province
      };
      // wx.setStorageSync("provinceid", e.target.dataset.id);
      // wx.setStorageSync("addressNow", e.target.dataset.province);
      this.triggerEvent("getProvince", province);
    },
    close(){
      this.setData({
        provinceShow:false
      })
      var province = {
        id: 0,
        name: ""
      };
      this.triggerEvent("getProvince", province);
    },
    //从新定位
    resetBendi() {
      let that = this;
      app.locationFunMore();
    }
  }
})