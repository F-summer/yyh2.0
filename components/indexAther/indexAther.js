// components/indexAther/indexAther.js
const app = getApp();
const group_descApi = require("../../service/group_desc.js").allServerApi;
const flockListApi = require("../../service/flockList.js").allServerApi;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cityName: {
      type: Object,
      value: {
        id: 0,
        name:'地区'
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    arr: []
  },
  ready() {
    let that = this;
    that.getDataList();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goSearch() {
      wx.navigateTo({
        url: '/pages/searchPage/searchPage',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      });
    },
    goBuild() {
      wx.navigateTo({
        url: '/pages/construction_group/construction_group',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      });
    },
    //搜索
    searchFun(e) {
      let that= this;
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
      wx.navigateTo({
        url: '/pages/searchPage/searchPage?name=' + e.currentTarget.dataset.name
      });
    },
    //获取数据
    getDataList() {
      let that = this;
      flockListApi.getOldHertList({
        mp_openid: wx.getStorageSync('openid')
      }, function(successMsg) {
        let newArr = [];
        successMsg.data.data.hot_search.forEach((value,index)=>{
          let name = value;
          let newName = value;
          if (value.length>4){
            newName = value.substring(0, 4)+"…"
          }
          newArr.push({
            name: name,
            newname: newName
          })
        });
        that.setData({
          arr: newArr
        })
      }, function(errorMsg) {
        //console.log(errorMsg)
      })
    }
  }
})