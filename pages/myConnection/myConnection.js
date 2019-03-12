// pages/myConnection/myConnection.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const cardsApi = require("../../service/cards.js").allServerApi;
const errorFun = require("../../util/errorMsg.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAlt: false,
    selectArr: [{
      id: 1,
      name: '我的关注'
    }, {
      id: 2,
      name: '谁关注了我'
    }, {
      id: 3,
      name: '我看过谁'
    }, {
      id: 4,
      name: '谁看过我'
    }],
    dataArr:[],
    showVal:'我的关注',
    imgCard:null,
    textMsg:'---上拉加载更多---',
    pagesize:10,
    pageindex: 1,
    indexnum:1,
    typeNum:1,
    noMore:false,
    showLoading:true,
    noMsg:false
  },
  //显示弹框
  showAltFun() {
    this.setData({
      showAlt: true
    })
  },
  //隐藏弹框
  hideAlt() {
    this.setData({
      showAlt: false
    });
  },
  //选择
  selectFun(e){
    //console.log(e.currentTarget.dataset.type)
    this.setData({
      showVal:e.currentTarget.dataset.val
    })
    this.resset(e.currentTarget.dataset.type)
  },
  //初始化
  resset(option){
    let that = this;
    wx.showLoading({
      title: '加载中',
    });
    this.setData({
      dataArr: [],
      textMsg: '---上拉加载更多---',
      pageindex:1,
      typeNum: option,
      noMore:false
    });
    //let option = [1, '', 11, 10,1]
    // type: 1 我关注谁, 2 谁关注我, 3 我看过谁, 4 谁看过我
    // keyword：搜索条件
    // scene_id: 11
    // pagesize: 10
    // pageindex: 1
    this.init(option, '', 11, that.data.pagesize, that.data.pageindex);
  },
  //获取数据
  init(...item){
    let that = this;
    cardsApi.getMyconnection({
      mp_openid: wx.getStorageSync('openid'),
      type: item[0],
      keyword: item[1],
      scene_id: item[2],
      pagesize: item[3],
      pageindex: item[4],
    },res=>{
      wx.hideLoading();
      if (res.data.data.length == 0 && that.data.pageindex==1) {
        that.setData({
          noMsg: true
        });
      }else{
        that.setData({
          noMsg: false
        });
      }
      res.data.data.forEach((val, index) => {
        cardsApi.getcardImg({
          mp_openid: wx.getStorageSync('openid'),
          userid: val.uid
        }, success => {
          val.shearImg = success.data.data;
          that.data.dataArr.push(val);
          that.setData({
            dataArr: that.data.dataArr
          });
        }, error => {
          console.log(error)
        });
      });
      that.setData({
        showLoading: false
      });
      if (res.data.data.length < that.data.pagesize) {
        that.setData({
          textMsg: '---已经到底了---',
          noMore: true
        });
      };
    },error=>{
      wx.hideLoading();
      console.log(error)
    })
  },
  //认可
  zanFun(e){
    let that =this;
    let callBack = function () {
      that.data.dataArr.forEach((val, index) => {
        console.log(val)
        if (val.uid === e.currentTarget.dataset.uid) {
          if (val.approval !== 0) {
            return false
          }
          val.approval_num = val.approval_num + 1;
          val.approval=1;
        }
      })
      that.setData({
        dataArr: that.data.dataArr
      })
    }
    this.dataTbpFun(2, e.currentTarget.dataset.uid, 11, callBack())
  },
  //关注
  gzFun(e) {
    let that = this;
    let callBack=function(){
      that.data.dataArr.forEach((val,index)=>{
        if (val.uid === e.currentTarget.dataset.uid){
          if (val.follow !== 0) {
            return false
          }
          val.follow_num = val.follow_num+1;
          val.follow=1;
        }
      })
      that.setData({
        dataArr: that.data.dataArr
      })
    }
    this.dataTbpFun(3, e.currentTarget.dataset.uid, 11, callBack())
  },
  //点赞关注接口
  dataTbpFun(...item){
    let that = this;
    cardsApi.tapData({
      mp_openid: wx.getStorageSync('openid'),
      type: item[0],
      userid:item[1],
      scene_id: item[2]
    }, res => {
      wx.hideLoading();
      item[3];
      //console.log(res)
    }, error => {
      wx.hideLoading();
      console.log(error)
    })
  },
  //展示详情页
  showOtherCard(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/otherCard/otherCard?uid=' + e.currentTarget.dataset.uid,
    })
  },
  //搜索
  inputSearch: function (e) {  //输入框根据查询条件搜索点击事件
    // 获取用户输入框中的值
    let that =this;
    let inputVaue = e.detail.value['search-input'] ? e.detail.value['search-input'] : e.detail.value;
    this.setData({
      dataArr: [],
      textMsg: '---上拉加载更多---',
      pagesize: 10,
      pageindex: 1,
    });
    //let searchUrl = "/product/index?keyword=" + inputVaue + "&fromindex=true";
    this.init(that.data.typeNum, inputVaue, 11, that.data.pagesize, that.data.pageindex);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.resset(1);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
    let that = this;
    if (!that.data.noMore){
      this.setData({
        pageindex: that.data.pageindex + that.data.indexnum
      })
      this.init(that.data.typeNum, '', 11, that.data.pagesize, that.data.pageindex);
    }
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    //console.log(res)
    let that =this;
    if (e.from ==="button"){
      return {
        title: e.target.dataset.title,
        imageUrl: e.target.dataset.img,
        path: '/pages/otherCard/otherCard?uid=' + e.target.dataset.id
      }
    }else{
      return {
        title: '我在药友荟的人脉信息'
      }
    }
    
  }
})