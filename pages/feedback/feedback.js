// pages/feedback/feedback.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const app = getApp();
const feedbackApi = require("../../service/feedback.js").allServerApi;
const error = require('../../util/errorMsg.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showalt:false,
    textType:'请选择反馈类型',
    altArr:[],
    textareaTxt:'',
    imgArr:[],
    hasType:0,
    hasText:0,
    okBtn:false,
    disabledType:false
  },
  //显示弹框
  showAltFun(){
    let that = this;
    that.setData({
      showalt:true,
      disabledType:true
    });
  },
  //隐藏弹框
  hideAltFun(){
    let that = this;
    that.setData({
      showalt: false,
      disabledType: false
    });
  },
  //选择反馈类型
  selectFun(e){
    let that = this;
    that.setData({
      textType: e.currentTarget.dataset.name,
      typeId: e.currentTarget.dataset.id,
      hasType:1
    });
    if (that.data.hasText){
      that.setData({
        okBtn:true
      });
    }
   // console.log(e.currentTarget.dataset.name)
  },
  //选择图片
  chooseimage: function (event) {
    let thisId = event.currentTarget.dataset.imgid;
    let that = this;
    wx.chooseImage({
      count: 8 - that.data.imgArr.length, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //console.log(res.tempFilePaths)
        let arr = that.data.imgArr;
        //显示成功
        if (res.errMsg =="chooseImage:ok"){
          res.tempFilePaths.forEach((val,index)=>{
            arr.push({
              status:1,
              src:val
            });
          });
          that.setData({
            imgArr: arr
          })
          
        }else{
          error("操作失败请重试")
        }
      }
    })
  },
  //删除选中的照片
  delImgFun(e){
    let that = this;
    let indexNum = e.currentTarget.dataset.index;
    //console.log(e)
    that.data.imgArr.splice(indexNum,1);
    that.setData({
      imgArr: that.data.imgArr
    })
  },
  //获取文本框内容
  textareaFun(e){
    let that = this;
    //console.log(e.detail.value.replace(/^\s+$/g, "").length)
    if (e.detail.value.replace(/^\s+$/g, "").length == 0) {
      that.setData({
        textareaTxt: e.detail.value,
        hasText: 0,
        okBtn:false
      });
      return false
    }
    if (e.detail.value.length>=10){
      that.setData({
        textareaTxt: e.detail.value,
        hasText: 1
      });
      if (that.data.hasType) {
        that.setData({
          okBtn: true
        });
      }
    }else{
      that.setData({
        textareaTxt: e.detail.value,
        hasText: 0,
        okBtn: false
      });
      return false
    }
    //console.log(e.detail.value)
  },
  //去反馈记录页面
  feedbackList(){
    wx.navigateTo({
      url: '/pages/feedback_list/feedback_list',
    })
  },
  //提交反馈
  sendDataFun(){
    wx.showLoading({
      title: '提交中，请稍等'
    })
    let that = this;
    if (wx.getStorageSync('openid')){
      let getImgMsg = '';
      let newImgArr = [];
      //如果有图片就上传图片没有直接上传信息
      if (that.data.imgArr.length > 0) {
        feedbackApi.sendImgData(that.data.imgArr, 'file',
          function (res) {
            newImgArr.push(res.data.data)
            if (newImgArr.length == 1) {
              getImgMsg = res.data.data
            } else {
              getImgMsg = getImgMsg + ',' + res.data.data;
            }
            if (that.data.imgArr.length == newImgArr.length) {
              that.data.getImgMsg = getImgMsg;
              that.upAllMsg();
            }
          }, function (error) {
            console.log(error)
          });

//        console.log("所有图片", newImgArr)
      } else {
        that.upAllMsg();
      }
    }else{
      error("请先登录");
    }
    
  },
  //上传所有信息
  upAllMsg(){
    let that =this;
    feedbackApi.sendFileAllData({
      'mp_openid': wx.getStorageSync('openid'),
      'type': that.data.typeId,
      'added': that.data.textareaTxt,
      'images': that.data.getImgMsg ? that.data.getImgMsg:'',
      'form_id':''
    },function(res){
      wx.hideLoading();
      wx.showModal({
        title: '提交成功',
        content: '请稍候,客服人员会及时处理并回复,谢谢！',
        showCancel:false,
        success(res) {
          wx.switchTab({
            url: "/pages/index/index"
          });
        }
      });
    },function(error){
      error("提交失败，请稍后再试！");
    })
  },
  //获取手机号
  getPhoneNumber(e) {
    let that = this;
    let event = e;
    if (wx.getStorageSync('openid')){
      wx.login({
        success: function (e) {
          //console.log(e.code,event.detail.iv, event.detail.encryptedData)
          feedbackApi.sendPhone({
            mp_openid: wx.getStorageSync('openid'),
            iv: event.detail.iv,
            encryptedData: event.detail.encryptedData,
            code: e.code
          }, function (successMsg) {
            wx.setStorageSync('hasPhoneNum', '0');
            that.setData({
              showPhonebtn: false
            });
            that.sendDataFun();
          }, function (errorMsg) {
            wx.setStorageSync('hasPhoneNum', '1');
            error("操作失败，请重新授权手机号");
            that.setData({
              showPhonebtn: true
            });
          })
        }
      });
    }else{
      error("请先登录，谢谢")
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    feedbackApi.getFeedbackType(function(res){
      that.setData({
        altArr:res.data.data
      })
    },function(error){
      console.log(error)
    });
    //判断是否获取过手机号
    if (wx.getStorageSync('hasPhoneNum') == '0'){
      that.setData({
        showPhonebtn: false
      });
     }else{
      that.setData({
        showPhonebtn: true
      });
     }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})