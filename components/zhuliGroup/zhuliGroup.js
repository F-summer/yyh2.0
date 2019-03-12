// components/groupDesc/groupDesc.js
const flockListApi = require("../../service/flockList.js").allServerApi;
const group_descApi = require("../../service/group_desc.js").allServerApi;
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    zhuliGroupShow: {
      type: Boolean
    },
    groupid: {
      type: Number,
      observer: function(newVal, oldVal, changedPath) {

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    zhuliGroupShow: true,
    content: true,
    rulers: false

  },
  /**
   * 组件的方法列表
   */
  methods: {
    //初始化数据
    getInfo(gid) {
      var that = this
      that.setData({
        groupid: gid
      })
      group_descApi.getGroupInfo({
        mp_openid: wx.getStorageSync("openid"),
        id: gid,
        type: 1, //（ 0 / 1,头像取随机头像/头像取助力头像）
        uid: wx.getStorageSync("uid") ? wx.getStorageSync("uid") : '',
        openid: wx.getStorageSync("sdopenid") ? wx.getStorageSync("sdopenid") : ''
      }, function(res) {
        console.log(res)
        that.setData({
          name: res.data.data.room_name,
          src: res.data.data.head_img,
          desc: res.data.data.intro,
          sum: res.data.data.room_count,
          erweima: res.data.data.wx_code,
          needHelp: res.data.data.need_help,
          hasHelp: res.data.data.has_help,
          total: res.data.data.total
        })

        //助力人数不足
        if (that.data.needHelp > 0) {
          let linshi = res.data.data.list;
          var obj = {
            "head_img": "/images/wait.png"
          }
          for (var i = 0; i < that.data.needHelp; i++) {
            linshi.push(obj);
          }
          that.setData({
            imgList: linshi
          })
        } else {
          that.setData({
            imgList: res.data.data.list
          })
        }





        let arr = [];
        arr.push(res.data.data.head_img);
        arr.push(res.data.data.wx_code);
        // let canvas = that.selectComponent("#canvas");
        // canvas.downloadFun(arr);
      }, function(error) {
        console.log(error)
      })
    },
    backmenu() {
      this.setData({
        zhuliGroupShow: false,
        content: true,
        zhulirulers: false,
        rulers: false
      })
    },
    // 立即入群
    addFlock(e) {
      app.aldstat.sendEvent('点击加群了');
      let showLogin = app.getUserInfoFun();
      if (!showLogin) {
        let that = this;
        that.setData({
          showAlt: true,
          sendId: e.currentTarget.dataset.id,
          groupname: e.currentTarget.dataset.name
        });
        flockListApi.recordAddFlock({
          mp_openid: wx.getStorageSync('openid'),
          room_id: e.currentTarget.dataset.id
        }, function(res) {

        }, function(error) {

        })

      }
    },
    //不同操作类型
    addGroupType(e) {

//      console.log(e.target.dataset.type);
      var that = this
     
      group_descApi.addGroupType({
        mp_openid: wx.getStorageSync("openid"),
        id: e.target.dataset.id,
        form_id: e.detail.formId,
        type: e.target.dataset.type,
        openid: e.target.dataset.type == 1360 ? wx.getStorageSync("sdopenid") : ''
      }, function(res) {
        console.log(res)
       
        if (e.target.dataset.type == 1360) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            success(res) {
              that.setData({
                zhuliGroupShow: false
              })
            }
          })
        }
      }, function(error) {
        console.log(error)
      })
    },
    //助力规则
    zhuliruler() {
      this.setData({
        content: false,
        rulers: false,
        zhulirulers: true
      })
    },
    //入群规则
    ruqun() {
      this.setData({
        content: false,
        zhulirulers: false,
        rulers: true
      })
    },
    // 知道了
    know() {
      this.setData({
        content: true,
        zhulirulers: false,
        rulers: false
      })
    },
  }
})