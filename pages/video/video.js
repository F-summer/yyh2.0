// pages/video/video.js
// pages/live_play/live_play.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const TxvContext = requirePlugin("tencentvideo");
const config = require('../../modules/config')
const liveApi = require("../../service/live.js").allServerApi;
const loginApi = require("../../service/login.js").allServerApi;
const errorFun = require("../../util/errorMsg.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listArr: [{
        name: '孙大正',
        zhiwei: '副总裁',
        title: '飞龙品牌复出，营销战略焕发新生机',
        complay: '沈阳飞龙医药控股集团有限公司',
        start:0,
        end:605,
        url:'https://www.yaobc.info/images/live/hand/1.png'
      }, {
        name: '邢厚恂',
        zhiwei: '总经理',
        title: '医药行业新趋势下企业应对策略',
        complay: '深圳奥萨制药有限公司',
        start: 640,
        end: 1700,
        url: 'https://www.yaobc.info/images/live/hand/2.png'
      },
      {
        name: '马士锋',
        zhiwei: '总裁',
        title: '山西振东制药股份有限公司',
        complay: '处方药、OTC营销和精细化招商策略',
        start: 1718,
        end: 2700,
        url: 'https://www.yaobc.info/images/live/hand/3.png'
      },
      {
        name: '张戎梅',
        zhiwei: '常务副总经理',
        title: '解密藿香正气液营销策划案例',
        complay: '太极集团有限公司',
        start: 2880,
        end:4160,
        url: 'https://www.yaobc.info/images/live/hand/4.png'
      },
      {
        name: '胡静',
        zhiwei: 'CEO',
        title: '家用医疗耗材、快消品销售团队管理策略',
        complay: '青岛海诺生物工程有限公司',
        start: 4170,
        end: 5240,
        url: 'https://www.yaobc.info/images/live/hand/5.png'
      },
      {
        name: '林信涌',
        zhiwei: 'CEO',
        title: '氢分子医学产品总体战略布局与规划',
        complay: '上海潓美医疗科技有限公司',
        start: 5313,
        end:5900 ,
        url: 'https://www.yaobc.info/images/live/hand/6.png'
      },
      {
        name: '孙景成',
        zhiwei: '副总裁',
        title: '传统品牌的成长之路',
        complay: '东北制药股份有限公司',
        start: 5910,
        end: 6500,
        url: 'https://www.yaobc.info/images/live/hand/7.png'
      },
      {
        name: '吴泰来',
        zhiwei: '首席会长',
        title: '香港药品、保健品企业如何扩展内地市场？',
        complay: '香港馆-香港药行商会',
        start: 6550,
        end: 7100,
        url: 'https://www.yaobc.info/images/live/hand/8.png'
      },
      {
        name: '周小玲',
        zhiwei: '副总经理',
        title: '产品线上线下全渠道推广实战经验',
        complay: '深圳市金活医药有限公司',
        start: 7315,
        end: 8000,
        url: 'https://www.yaobc.info/images/live/hand/9.png'
      },
      {
        name: '戴子善',
        zhiwei: '副总经理',
        title: '互联网+商业模式创新探索',
        complay: '康美药业股份有限公司',
        start: 8210,
        end: 9200,
        url: 'https://www.yaobc.info/images/live/hand/10.png'
      },
    ],
    showAlt: false,
    showTs: false,
    showCard: false,
    banner: '/images/bannerzhibo.jpg',
    allNum: 0,
    logoImg: '/images/erweima.jpg',
    bg: '/images/bg11.png',
    id: null,
    uid: null,
    tvphide: false,
    vid: 'l0025mppim4',
    changingvid: '',
    controls: !!config.get('controls'),
    autoplay: !!config.get('autoplay'),
    playState: '',
    showProgress1: false,
    width: "100%",
    height: "auto",
    timeS: 0,
    playing:false,
    playingid:0
  },
  onTimeUpdate(e) {
    let that = this;
    that.data.timeS = that.data.timeS + 1;
   // console.log("进度事件", e)
    if (e.detail.duration>20){
      that.data.playing = true;
      that.data.listArr.forEach((value,index)=>{
        if (e.detail.currentTime > value.start && e.detail.currentTime > value.end){
          that.setData({
            playingid:index+1
          })
          return false
        }
      })
    }else{
      that.data.playing = false
    }
  },
  onStateChange(e) {
    console.log("播放状态", e)
  },
  statusmoreFun(e){
    let that = this;
    that.data.playing = false
  },
  getVid() {
    var url = 'https://apd-661a66e86c8c46c19543a73984de6619.v.smtcdns.com/vhot2.qqvideo.tc.qq.com/A7-D_dU3XioQVLcLFAbY1PM3SpeQ0MSJNHAu6dv_KWU8/k08085pw6os.m701.mp4?sdtfrom=v1010&guid=3201a10194125a2ce7fa2237e1a9e703&vkey=5BDD56451D5422F7EEA1095BB451930429F026D31C9348E49E381C94E01CD88D56706D42F9D85B39217BB886E4F6ECAABFBE88184582928D9AE91A910B0F829DB920DAFCD13B9B3BA46E89B0B826555F3256DB28ACED91B3F6A5159E5FD9A964BD42DAD99598BB85257D963AB6C72E2E2B3047103883F176'
    if (url.indexOf('%2F') === -1) {
      var splitdata = url.split('/');
    } else {
      var splitdata = url.split('%2F');
    }
    var length = splitdata.length;
    var vid = splitdata[length - 1].split('.')[0];
    return vid;
  },
  statusFun(e){
   let that = this;
   that.data.playing = true
  },
  //切换播放视频
  changPlay(e){
    let that = this;
    if (that.data.playing){
      // let time = e.currentTarget.dataset.time;
      // let txvContext = TxvContext.getTxvContext('txv0') // txv1即播放器组件的playerid
      // that.setData({
      //   playingid: e.currentTarget.dataset.id
      // })
      let time = e.currentTarget.dataset.time;
      let txvContext = wx.createVideoContext('txv0')
      that.setData({
        playingid: e.currentTarget.dataset.id
      });
      txvContext.seek(time);  //快进到某个时间
     }else{
       wx.showToast({
         title: '请播放视频再选择',
         icon:'none'
       })
     }
    
  },
  timeFun() {
    //let txvContext = TxvContext.getTxvContext('txv0') // txv1即播放器组件的playerid值
    // txvContext.play();  // 播放
    // txvContext.pause(); // 暂停
    // txvContext.requestFullScreen(); // 进入全屏
    // txvContext.exitFullScreen();    // 退出全屏
    // txvContext.playbackRate(+e.currentTarget.dataset.rate); // 设置播放速率
    //txvContext.seek(10);  //快进到某个时间
  },
  //初始化
  init() {
    let that = this;
    //视频播放相关方法
    let vid = that.getVid();
   // let txvContext = TxvContext.getTxvContext('txv0');
    //var currPlayerId = TxvContext.getLastPlayId();     //获取当前播放视频的playerid
    //var currPlayerContxt = TxvContext.getTxvContext(currPlayerId);
    that.setData({
      vid: vid
    })
    //去登录
    let getVal = wx.getStorageSync("userInfo");
    if (!getVal || getVal === '0') {
      wx.navigateTo({
        url: '/pages/login/login',
      });
      return false
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    //options.scene='0,7';
    console.log("程序参数", options);
    // let that = this;
    // that.init();
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
    let that = this;
    that.init();
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

  },

  /**
   * 用户点击右上角分享
   */
  shareFun(e) {
    let that = this;
    that.data.id = e.target.dataset.id || that.data.id
    liveApi.sendMark({
      mp_openid: wx.getStorageSync('openid'),
      id: that.data.id,
      'type': e.target.dataset.type || 7,
      form_id: e.detail.formId
    }, function(res) {
      console.log(res)
    }, function(error) {
      errorFun(error)
    })
  },
  onShareAppMessage: function(options) {
    console.log("分享参数", options)
    return {
      title: options.target.dataset.title,
      imageUrl: options.target.dataset.img,
    }
  }
})