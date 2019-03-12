// components/theme/theme.js
const flockListApi = require("../../service/flockList.js").allServerApi;
const group_descApi = require("../../service/group_desc.js").allServerApi;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array
    },
    province: {
      type: Array
    },
    dataType: {
      type: String
    },
    themeShow: {
      type: Boolean
    },
    address: {
      type: String,
      value: wx.getStorageSync("addressRes")
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    id:null
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close: function() {
      let that =this;
      this.setData({
        themeShow: false
      });
    },
    //有结果返回首页
    backIndex(e){
      let that = this;
      console.log(e)
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
      this.setData({
        themeShow: false
      });
      if (that.data.id) {
        var name = {
          name: that.data.name,
          id: that.data.id
        };
        this.triggerEvent("name", name);
      }
    },
    // 点击筛选
    choice: function(e) {
      var ids = e.target.dataset.ids;
      this.setData({
        indexCho: ids,
        name: e.target.dataset.name,
        id: e.target.dataset.id
      })
      if (this.properties.dataType == "business") {
        this.setData({
          businessId: e.target.dataset.id
        })
      } else {
        this.setData({
          themeId: e.target.dataset.id
        })
      }
      this.setData({
        themeShow: false
      });
      var that = this;
      if (that.data.id) {
        var name = {
          name: that.data.name,
          id: that.data.id
        };
        this.triggerEvent("name", name);
      }
    },
//     getList: function() {
//       var that = this;
//       let name = that.properties.province.name ? that.properties.province.name:''
//       flockListApi.getflockList({
//         mp_openid: wx.getStorageSync('openid'),
//         province: wx.getStorageSync('addressRes'),
//         search: "",
//         areaid: that.properties.province.id,
//         categoryid: that.data.businessId ? that.data.businessId : 0,
//         themeid: that.data.themeId ? that.data.themeId : 0,
//         page_size: 10,
//         page_index: 1
//       }, function(successMsg) {
// //        console.log(successMsg.data.total)
//         if (successMsg.data.total > 0) {
//           that.setData({
//             showContent: name
//              + "有" + successMsg.data.total + "个群",
//             showRet: true,
//             showMore: false
//           })
//         } else {
//           that.setData({
//             showRet: false,
//             showMore: true
//           })
//         }

//         //console.log(successMsg)
//       }, function(errorMsg) {

//         //console.log(errorMsg)
//       })
//     },
    //获得改变的数
    changNmaeCity(options){
      let that =this;
      that.properties.province = options;
      console.log(that.properties.province)
    },
    more:function(){
      wx.navigateTo({
        url: '/pages/construction_group/construction_group',
      })
    }
  }
})