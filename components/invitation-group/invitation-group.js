// components/invitation-group.js
let contruction = require('../../service/construction_group.js').allServerApi;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    group: {
      type: Object,
      value: {
        city: "",
        help: 0,
        help_num: 0,
        id: 0,
        name: "",
        open_id: "",
        province: "",
        remaining_time: 0,
        set_num: 0,
        type: 0,
        type_id: 0
      }
    },
    fxrid: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    help_num: 0,
    help: 0,
    percent: 0

  },
  ready: function() {
    this.daojishi();
    this.setData({
      help_num: this.properties.group.help_num,
      help: this.properties.group.help,
      percent: this.properties.group.help_num / this.properties.group.set_num * 100
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    daojishi: function() {
      var that = this;
      this.data.intervarID = setInterval(function() {

        var leftTime = that.properties.group.remaining_time - Date.parse(new Date()) / 1000;
        var days = parseInt(leftTime / 60 / 60 / 24, 10); //计算剩余的天数 
        var hours = parseInt(leftTime / 60 / 60 % 24, 10); //计算剩余的小时 
        var minutes = parseInt(leftTime / 60 % 60, 10); //计算剩余的分钟 
        var seconds = parseInt(leftTime % 60, 10); //计算剩余的秒数 

        that.setData({
          clock: days + " 天 " + hours + " : " + minutes + " : " + seconds
        })
        // console.log(that.data.clock);
        if (days == '00' && hours == '00' && minutes == '00' && seconds == '00') {
          clearInterval(that.data.intervarID);

          that.setData({
            clock: '已结束'
          })
        }
      }, 1000)
    },
    formSubmit(e) {
      let that =this;
      that.data.formId = e.detail.formId;
      //console.log("formid:",e.detail.formId);
      let openid = '';
      if (that.properties.fxrid.length > 0) {
        openid = that.properties.fxrid.length
      } else {
        openid = e.currentTarget.dataset.openid
      }
//      console.log("getformid:",that.data.formId)
      contruction.zhuli({
        mp_openid: wx.getStorageSync("openid"),
        id: e.currentTarget.dataset.id,
        openid: openid,
        form_id: that.data.formId
      }, function (suc) {
        // console.log(suc);
        if (suc.data.result == 0) {
          that.setData({
            help_num: that.data.help_num + 1,
            help: 1,
            percent: (that.data.help_num + 1) / that.properties.group.set_num * 100
          })
        }
      }, function (err) { })
    },
    zhuli: function(e) {
      var that = this
      let openid = '';
      if (that.properties.fxrid.length > 0) {
        openid = that.properties.fxrid.length
      } else {
        openid = e.currentTarget.dataset.openid
      }
      console.log(that.data.formId)
      contruction.zhuli({
        mp_openid: wx.getStorageSync("openid"),
        id: e.currentTarget.dataset.id,
        openid: openid,
        form_id: that.data.formId
      }, function(suc) {
        // console.log(suc);
        if (suc.data.result == 0) {
         
          that.setData({
            help_num: that.data.help_num + 1,
            help: 1,
            percent: (that.data.help_num + 1) / that.properties.group.set_num * 100
          })
        }
      }, function(err) {})
    }
  }


})