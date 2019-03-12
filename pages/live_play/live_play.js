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
    listArr: [],
    showAlt: false,
    showTs: false,
    showCard: false,
    banner: '/images/bannerzhibo.jpg',
    allNum: 0,
    logoImg:'/images/erweima.jpg',
    bg: '/images/bg11.png',
    id:null,
    uid:null,
    tvphide: false,
    vid: 'l0025mppim4',
    changingvid: '',
    controls: !!config.get('controls'),
    autoplay: !!config.get('autoplay'),
    playState: '',
    showProgress1: true,
    width: "100%",
    height: "auto"
  },
  getVid() {
    var url = 'https://apd-cb78c59af72b7290f7460f45ba686acc.v.smtcdns.com/vhot2.qqvideo.tc.qq.com/A9fiAzlhpd52s0D57iH-7bvC2E5pxzvpMRKQz43QI4PU/y0808511sck.mp4?sdtfrom=v1010&guid=3201a10194125a2ce7fa2237e1a9e703&vkey=8720509A9D1CFD3441CBAF09197713D8BA6C5B6477265EABFB0651CBC6FDDD3F8CD00C1784E941B005997032CC2DB045DF0ABE1D386301A6AB81F4730D7F6971F71BA5D743B8738662CA8DB9048937DB0EB0ED1CAD2EB69A530BF4647F7DA2F4FB75F7CCAA609C6D4A71A16ADF1D980CA99A125F53F23FB1#t=5'
    if (url.indexOf('%2F') === -1) {
      var splitdata = url.split('/');
    } else {
      var splitdata = url.split('%2F');
    }
    var length = splitdata.length;
    var vid = splitdata[length - 1].split('.')[0];
    return vid;
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
    that.setData({
      vid: vid
    })
    //去登录
    wx.showLoading({
      title: '加载中',
    });
    that.setData({
      listArr:[]
    })
    let getVal = wx.getStorageSync("userInfo");
    if (!getVal || getVal === '0') {
      wx.navigateTo({
        url: '/pages/login/login',
      });
      return false
    }
    liveApi.getLiveList({
      mp_openid: wx.getStorageSync('openid')
    }, function(res) {
      wx.hideLoading();
      that.setData({
        listArr: res.data.data
      });
    }, function(error) {

    })
  },
  //分享弹出框
  showALtFunFirst(options){
    let that = this;
    let date = new Date();
    date = parseInt(date.getTime() / 1000);
//    console.log(date)
    console.log("二维码参数", options);
    //显示弹框
    if (options.scene) {
      let newArrData = [];
      options.scene = decodeURIComponent(options.scene);
      options.scene.split(',');
      console.log(options.scene.split(','))
      that.data.id = options.scene.split(',')[1];
      that.data.uid = options.scene.split(',')[0];
      that.formSubmitOne(that.data.id);
      that.setData({
        showTs: false,
        showCard: true,
        id: options.scene.split(',')[1]
      });
    } else if (options.openid) {
      that.setData({
        showTs: false,
        showCard: true,
        id: options.id
      });
      that.formSubmitOne(options.id);
      that.data.openid = options.openid || '';
      that.data.id = options.id;
    }
  },
  //隐藏弹框
  backthat() {
    this.setData({
      showAlt: false,
      showTs: false,
      showCard: false
    })
  },
  backindex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //预约
  formSubmitOne(options) {
    let that = this;
    this.data.allNum = 0
    liveApi.getUid({
      mp_openid: wx.getStorageSync('openid'),
      id: options
    }, function(res) {
      that.setData({
        showAlt: true,
        topbg: res.data.data[0],
        titles: res.data.data[2],
        start: res.data.data[3],
        end:res.data.data[4]
      });
      //判断是否可以预约
      if (res.data.data[5]==4){
        wx.showModal({
          title: '提示',
          content: '您要观看的直播已经结束！点击确定按钮返回首页，加入药友荟社群，向群管理员索要回放地址。感谢您的支持！',
          showCancel: true,
          success: function () {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }
        });
        return false
     }
     let date = new Date();
      date = parseInt(date.getTime()/1000); 
//      console.log(date)
      if (date < res.data.data[3]){
        //要预约或已预约
        if (res.data.data[6]>0){
          //已预约
          that.setData({
            hideBtn: true
          });
        }else{
          //要预约
          that.setData({
            hideBtn: false
          });
        }
      }else{
        //观看或者可以回看
        that.setData({
          hideBtn: true
        });
      }
      that.getImageInfo(res.data.data);
      wx.hideLoading();
    }, function(error) {

    })
    return false;
  },
  //预约观看
  makeFun(e) {
//    console.log(e.detail.formId)
    let that = this;
    wx.showLoading({
      title: '预约中',
    });
    liveApi.sendMark({
      mp_openid: wx.getStorageSync('openid'),
      id: that.data.id,
      'type': 6,
      openid: that.data.openid||'',
      uid: that.data.uid || '',
      form_id: e.detail.formId
    }, function(res) {
      wx.hideLoading();
      wx.showModal({
        title: '预约成功',
        content: '快去加入社群观看直播吧！',
        showCancel: false,
        success(res) {
         that.setData({
           hideBtn:true
         })
        }
      })
      that.data.listArr.forEach((value, index) => {
        if (that.data.id == value.id) {
          value.apply = 1;
        }
      });
      that.setData({
        listArr: that.data.listArr
      })
    }, function(error) {
      errorFun(error)
    })
  },
  //观看
  formSubmitTwon(e) {
    console.log(e)
    let that = this;
    that.setData({
      showAlt: true,
      showTs: true,
      showCard: false,
      title: e.currentTarget.dataset.title,
      time: e.currentTarget.dataset.time
    });
  },
  //生成海报
  haibao(e) {
    let that = this;
    liveApi.sendMark({
      mp_openid: wx.getStorageSync('openid'),
      id: that.data.id,
      'type': 7,
      form_id: e.detail.formId
    }, function (res) {
      console.log(res)
    }, function (error) {
      errorFun(error)
    })
    if (that.data.allNum === 2) {
      wx.showLoading({
        title: '正在保存',
        allNum: 0
      });
      that.data.allNum = 0;
      that.drawFun();
     } else {
       wx.showToast({
         title: '下载失败，请重试！！',
       })
     }

  },
  //绘画过程
  drawFun() {
    let that = this;
    //that.getImageInfo(item)
    const ctx = wx.createCanvasContext('Canvas');
    ctx.setFillStyle('#ffffff');
    let canvasW = 690;
    let canvasH = 954;
    let userName = wx.getStorageSync('nickName')
    ctx.fillRect(0, 0, canvasW, canvasH);
   // console.log("二维码：",that.data.logoImg)
    that.drawBanner(ctx, that.data.banner);
    that.drawbg(ctx, that.data.bg)
    //that.drawLine(ctx)
    that.drawLogo(ctx, that.data.logoImg);
    that.drawEwmMsg(ctx, userName);
    ctx.draw();
    that.saveImg();
  },
  //绘制banner图
  drawBanner(...item) {
    item[0].save(); //保存当前环境的状态
    let that = this,
      bannerW = 690,
      bannerH = 664;
    item[0].drawImage(item[1], 0, 40, bannerW, bannerH);
    item[0].restore();
  },
  //绘制背景
  drawbg(...item) {
    item[0].save(); //保存当前环境的状态
    let that = this,
      bannerW = 690,
      bannerH = 284;
    item[0].drawImage(item[1],0 , 664, bannerW, bannerH);
    item[0].restore();
  },
  //绘制logo二维码
  drawLogo(...item) {
    let that = this,
      leftW = 32,
      topH = 684,
      logoWH = 140
    item[0].drawImage(item[1], leftW, topH, logoWH, logoWH);
  },
  //绘制底文
  drawEwmMsg(...item) {
    item[0].setTextAlign('left')
    item[0].setFontSize(24);
    item[0].setFillStyle('#333');
    item[0].fillText('长按识别小程序二维码', 220, 757);
    item[0].fillText('加入微信社群，观看直播', 220, 797);
  },
  drawLine(...item) {
    let that = this,
      leftW = 0,
      topH = 500;
    item[0].drawImage('/images/bgn1.png', leftW, topH, 690, 30);
  },
  //保存在本地
  saveImg() {
    let that = this;
    setTimeout(function() {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 690,
        height: 954,
        canvasId: 'Canvas',
        complete: res => {
//          console.log(res)
          if (res.errMsg === 'canvasToTempFilePath:ok') {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success(res) {
                wx.hideLoading()
                wx.showModal({
                  title: '海报已保存到系统相册',
                  content: '快去分享到朋友圈，叫小伙伴来围观吧！',
                  success(res) {
                    console.log("成功")
                  }
                })

              },
              fail(res) {
                console.log(res)
                wx.hideLoading()
              }
            })
          } else {

          }
        }
      })
    }, 500);
  },
  //  图片缓存本地的方法
  getImageInfo(item) {
    let that = this;
    //console.log(options)
    let imgArr = new Array();
    item.forEach((value, index) => {
      console.log(index, "图片", value)
      if(index<2){
        that.downloadFun(value, index);
      }
      console.log(value)
    });
  },
  //缓存
  downloadFun(...item) {
    console.log("参数", item[1])
    let that = this;
    wx.getImageInfo({ //  小程序获取图片信息API
      src: item[0],
      success: function(res) {
        //console.log("图片本地地址：", res.path, item[1], item[0]);
        if (item[1] === 1) {
          that.setData({
            logoImg: res.path,
          });
          that.data.allNum = 1 + that.data.allNum
        } else if (item[1] === 0) {
          that.setData({
            banner: res.path
          });
          that.data.allNum = 1 + that.data.allNum
        }
        console.log(that.data.allNum)
        if (that.data.allNum === 2) {
          // that.drawFun(that.data.dataArr);
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  //空方法组织冒泡
  nullFun() {},
  //点击单列
  showAltFun(e) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    //console.log(res);
    that.setData({
      showTs: false,
      showCard: true,
      id: e.currentTarget.dataset.id
    });
    that.formSubmitOne(e.currentTarget.dataset.id);
    // if (e.currentTarget.dataset.status == 1 && e.currentTarget.dataset.apply <= 0) {
    //   that.setData({
    //     hideBtn: false
    //   });
      
    // } else {
    //   that.setData({
    //     hideBtn: true
    //   });
    //   that.formSubmitOne(e.currentTarget.dataset.id);
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    //options.scene='0,7';
    console.log("程序参数", options);
    that.showALtFunFirst(options);
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
  shareFun(e){
    let that = this;
    that.data.id = e.target.dataset.id || that.data.id
    liveApi.sendMark({
      mp_openid: wx.getStorageSync('openid'),
      id: that.data.id,
      'type': e.target.dataset.type||7,
      form_id: e.detail.formId
    }, function (res) {
      console.log(res)
    }, function (error) {
      errorFun(error)
    })
  },
  onShareAppMessage: function(options) {
    console.log("分享参数",options)
    if (options.from == "menu") {
      return {
        title: "赛柏蓝直播间",
        imageUrl: 'https://www.yaobc.info/images/yyh/bannerwx1.jpg'
      }
    }


    return {
      title: options.target.dataset.title,
      imageUrl: options.target.dataset.img,
      mp_openid: wx.getStorageSync('openid'),
      path: '/pages/live_play/live_play?openid=' + wx.getStorageSync('openid') + '&&id=' + options.target.dataset.id
    }
  }
})