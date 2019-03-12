// components/carousel/carousel.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const app = getApp();
const flockListApi = require("../../service/flockList.js").allServerApi;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    circular: true,
    imgUrls: [
      '/images/banner3.png',
      '/images/banner1.png',
      '/images/banner2.png'
    ],
    arrData: [],
    showText: '',
    showHead: '',
    showLetterAlt: false,
    sendId: null
  },
  ready() {
    let that = this;
    that.getCarousel();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //信息提醒
    changData() {
      let that = this;
      let indexNum = 1;
      if (that.data.arrData instanceof Array && that.data.arrData.length > 0) {
        that.data.timeFun = setInterval(function() {
          that.setData({
            showLetterAlt: false
          })
          if (indexNum > that.data.arrData.length - 1) {
            indexNum = 0
          }
          that.setData({
            showText: that.data.arrData[indexNum].nick_name + "在" + that.data.arrData[indexNum].time + "秒前加入了" + that.data.arrData[indexNum].chatroom_name,
            showHead: that.data.arrData[indexNum].hand_img,
            chatroom_id: that.data.arrData[indexNum].chatroom_id
          });
          that.headTs()
          indexNum++;

        }, 3000)
      }

    },
    //轮播图改变
    swiperChange() {

    },
    //加群
    addFlock(e) {
      //console.log(e.currentTarget.dataset.id)
      let that = this;
      that.setData({
        showAlt: true,
        sendId: e.currentTarget.dataset.id
      });
      flockListApi.recordAddFlock({
        mp_openid: wx.getStorageSync('openid'),
        room_id: e.currentTarget.dataset.id
      }, function(res) {
        // console.log(res)
      }, function(error) {
        //console.log(error)
      })
    },
    headAlt() {
      let that = this;
      that.setData({
        showAlt: false
      })
    },
    //隐藏提示框
    headTs() {
      let that = this;
      that.data.clearTimeFun = setTimeout(function() {
        that.setData({
          showLetterAlt: true
        });
      }, 2000)
    },
    //获取轮播图数据
    getCarousel() {
      let that = this;
      flockListApi.getCarouselList({
        appid: 'wx40a857971720fa97'
      }, function(res) {
        that.setData({
          imgUrls: res.data.data
        });
      }, function(errorMsg) {
        //console.log(errorMsg)
      });
      clearInterval(that.data.timeFun);
      clearTimeout(that.data.clearTimeFun)
      that.data.arrData = [];
      flockListApi.getMsgList({
        mp_openid: wx.getStorageSync('openid'),
        province: wx.getStorageSync('addressRes')
      }, function(res) {
        that.setData({
          arrData: res.data.data
        });
        that.setData({
          showText: that.data.arrData[0].nick_name + "在" + that.data.arrData[0].time + "秒前加入了" + that.data.arrData[0].chatroom_name,
          showHead: that.data.arrData[0].hand_img,
          chatroom_id: that.data.arrData[0].chatroom_id
        });
        that.changData();
      }, function(errorMsg) {
        //console.log(errorMsg)
      })
    },
    //跳转投票页
    voteFun(e) {
      //console.log(e.currentTarget.dataset.src)
      wx.navigateTo({
        url: '/' + e.currentTarget.dataset.src,
      });
    },
    pushFormSubmit(t) {
     // console.log("参数"Page())
      var myEventDetail = {
        val:t
      }
      this.triggerEvent('myevent', myEventDetail);
    }
  }
})