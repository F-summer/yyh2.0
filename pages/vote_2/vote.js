// pages/vote/vote.js
var Page = require('../../utils/ald-stat.js').Page;
var Page = require('../../utils/pushsdk.js').pushSdk(Page).Page;
const voteApi = require("../../service/vote.js").allServerApi;
const loginApi = require("../../service/login.js").allServerApi;
const errorFun = require("../../util/errorMsg.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showAlt: true,
    listArr: [],
    showClear: false,
    noSearch: true,
    showBack: true,
    showVote: false,
    voteListArr: [],
    searchArr: [],
    showLogin: true,
    showPhonebtn: true,
    rule: [],
    piao: 5,
    maxPiao: 5,
    minPiao: 3,
    noPiao: false
  },
  //显示规则
  showAltFun() {
    let that = this;
    that.setData({
      showAlt: true
    })
  },
  hideAlt() {
    let that = this;
    that.setData({
      showAlt: false
    })
  },
  //获取列表数据
  getDatafun() {
    let that = this;
    // if (wx.getStorageSync('openid')) {
    //   that.dayChangFun();
    // }
    voteApi.getVoteList({
      type: 2
    }, function(res) {
      res.data.data.forEach((value, index) => {
        value.kingNum = index;
        value.showBtnFun = value.status == 1 ? true : false;
      });
      //已经投票
      if (wx.getStorageSync("rotees")) {
        res.data.data.forEach((value, index) => {
          value.showBtnFun = false;
        });
      }

      //无法投票

      if (that.data.noPiao) {
        res.data.data.forEach((value, index) => {
          value.showBtnFun = false;
        });
      }
      that.setData({
        listArr: res.data.data
      });
      //console.log(res)
    }, function(error) {
      console.log(error)
    });
  },
  //输入搜索
  blurFun(e) {
    let that = this;
    let arr = [];
    //console.log(e.detail.value)
    that.setData({
      showClear: true,
      textInput: e.detail.value,
      noSearch: false
    });
    //str.indexOf("3") != -1
    that.data.listArr.forEach((value, index) => {
      if (value.name.indexOf(e.detail.value) != -1)
        arr.push(value)
      that.setData({
        searchArr: arr
      })
    })
  },
  //清除输入框
  clearFun() {
    let that = this;
    that.setData({
      showClear: false,
      textInput: '',
      noSearch: true
    })
  },
  //初始化
  init() {
    let that = this;
    if (wx.getStorageSync('openid')) {
      that.setData({
        showLogin: false
      });
      //时间差
      that.dayChangFun();
    }
    if (wx.getStorageSync('hasPhoneNum') == '0') {
      that.setData({
        showPhonebtn: false
      });
    }
    voteApi.getInitData({

    }, function(res) {
      if (res.data.data.vote_num[0].max_numner <= 0) {
        that.data.noPiao = true;
      } else {
        that.data.noPiao = false;
      }
      let startTime = parseInt(res.data.data.start_time);
      let endTime = parseInt(res.data.data.end_time);
      if (startTime < 0) {
        //活动还没有开始423328
        startTime = Math.abs(startTime) * 1000;
        let timeover = app.fmtDate(startTime);
        that.data.baginTime = setInterval(function() {
          startTime = startTime - 1000;
          if (startTime < 0) {
            clearInterval(that.data.baginTime);
            that.init();
            return false
          }
          timeover = app.fmtDate(startTime);
          that.setData({
            timeText: '距投票活动开始 剩余：' + timeover
          });
        }, 1000);
        that.setData({
          timeText: '距投票活动开始 剩余：' + timeover
        })
        that.data.noPiao = true;
      } else {
        if (endTime < 0) {
          endTime = Math.abs(endTime) * 1000;
          let timeover = app.fmtDate(endTime);
          that.data.baginTime = setInterval(function() {
            endTime = endTime - 1000;
            if (endTime < 0) {
              clearInterval(that.data.baginTime);
              that.init();
              return false
            }
            timeover = app.fmtDate(endTime);
            that.setData({
              timeText: '距投票活动结束 剩余：' + timeover
            });
          }, 1000);
          that.data.noPiao = false;
        } else {
          that.setData({
            timeText: '投票活动已经结束，感谢您的支持！'
          });
          that.data.noPiao = true;
        }

      }
      that.setData({
        rule: res.data.data.rule.item,
        maxPiao: res.data.data.vote_num[0].max_numner,
        minPiao: res.data.data.vote_num[0].min_number,
        showBtnShear: res.data.data.button == 0 ? false : true
      });
      that.getDatafun();
    }, function(error) {
      console.log(error)
    });
  },
  preventTouchMove() {},
  //判断是否已经投票
  voteedFun() {
    let that = this;
    // console.log(!wx.getStorageSync('rotees'))
    if (!wx.getStorageSync('rotees')) {
      voteApi.getVoteed({
        mp_openid: wx.getStorageSync('openid')
      }, function(res) {
        if (res.data.data.vote_id) {
          that.data.listArr.forEach((value, index) => {
            value.showBtnFun = false;
          });
          that.setData({
            listArr: that.data.listArr
          });
          wx.setStorageSync("rotees", true);
          errorFun("您今日已投票，请明日继续为企业助力！")
        }
      }, function(error) {
        console.log(error)
      })
    }
  },
  //获取手机号
  getPhoneNumber(e) {
    let that = this;
    let event = e;
    wx.login({
      success: function(e) {
        //console.log(e.code,event.detail.iv, event.detail.encryptedData)
        loginApi.getPhone({
          mp_openid: wx.getStorageSync('openid'),
          iv: event.detail.iv,
          encryptedData: event.detail.encryptedData,
          code: e.code
        }, function(successMsg) {
          wx.setStorageSync('hasPhoneNum', '0');
          that.setData({
            showPhonebtn: false
          });
          that.voteFun();
        }, function(errorMsg) {
          wx.setStorageSync('hasPhoneNum', '1');
          errorFun("操作失败，请重新授权手机号");
          that.setData({
            showPhonebtn: true
          });
        })
      }
    });
  },
  //返回首页
  backIndexFun() {
    // wx.reLaunch({
    //   url: '/pages/index/index',
    // })
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //点击支持
  zhichiFun(e) {
    console.log(e.detail.formId)
    let that = this;
    let companyId = e.currentTarget.dataset.id;
    let compangImg = e.currentTarget.dataset.img;
    let typeText = e.currentTarget.dataset.type;
    that.data.voteListArr.push({
      id: companyId,
      logo: compangImg
    });
    //搜索的情况下
    if (typeText == 'search') {
      if (that.data.maxPiao - that.data.voteListArr.length == 0) {
        that.data.searchArr.forEach((value, index) => {
          value.showBtnFun = false
        });
      } else {
        that.data.searchArr.forEach((value, index) => {
          if (value.id == companyId)
            value.showBtnFun = false
        });
      }
      that.setData({
        searchArr: that.data.searchArr
      })
    }
    console.log(that.data.maxPiao - that.data.voteListArr.length == 0)
    if (that.data.maxPiao - that.data.voteListArr.length == 0) {
      that.data.listArr.forEach((value, index) => {
        value.showBtnFun = false
      });
    } else {
      that.data.listArr.forEach((value, index) => {
        if (value.id == companyId)
          value.showBtnFun = false
      });
    }
    that.setData({
      voteListArr: that.data.voteListArr,
      listArr: that.data.listArr,
      showVote: true,
      piao: that.data.maxPiao - that.data.voteListArr.length,
      formIdVal: e.detail.formId
    })
  },
  //删除支持的公司
  deletedFun(e) {
    let that = this;
    let companyId = e.currentTarget.dataset.id;
    that.data.voteListArr.forEach((value, index) => {
      if (value.id === companyId)
        that.data.voteListArr.splice(index, 1)
    });
    console.log(that.data.piao)
    if (that.data.piao == 0) {
      that.data.searchArr.forEach((value, index) => {
        value.showBtnFun = true
        that.data.voteListArr.forEach((val, ind) => {
          if (val.id == value.id)
            value.showBtnFun = false
        })
      });
      that.data.listArr.forEach((value, index) => {
        value.showBtnFun = true
        that.data.voteListArr.forEach((val, ind) => {
          if (val.id == value.id) {
            value.showBtnFun = false
          }
        })
      });
    } else {
      that.data.searchArr.forEach((value, index) => {
        if (value.id === companyId)
          value.showBtnFun = true
      });
      that.data.listArr.forEach((value, index) => {
        if (value.id === companyId)
          value.showBtnFun = true
      });
    }
    if (that.data.voteListArr.length < 1) {
      that.setData({
        showVote: false
      });
    }
    that.setData({
      voteListArr: that.data.voteListArr,
      listArr: that.data.listArr,
      searchArr: that.data.searchArr,
      piao: that.data.maxPiao - that.data.voteListArr.length
    });
  },
  //formid
  formSubmit(e) {
    let that = this;
    that.setData({
      formIdVal: e.detail.formId
    })
    // console.log(e.detail.formId);
  },
  //投票
  voteFun() {
    let that = this;
    let stringId = '';
    that.data.voteListArr.forEach((value, index) => {
      stringId += value.id + ','
    });
    //console.log(that.data.formIdVal, stringId, wx.getStorageSync('openid'))
    voteApi.sendVoteData({
      mp_openid: wx.getStorageSync('openid'),
      vote_id: stringId,
      form_id: that.data.formIdVal
    }, function(res) {
      console.log(res)
      wx.showModal({
        title: '投票成功，谢谢您的参与',
        content: '即将返回首页',
        showCancel: false,
        success(res) {
          let time = new Date().getTime();
          let voteed = {
            time: time
          }
          //wx.setStorageSync("rotees", true);
          wx.setStorageSync('voteed', voteed);
          wx.switchTab({
            url: '/pages/index/index',
          })
          // wx.reLaunch({
          //   url: '/pages/index/index',
          // })
        }
      });
    }, function(error) {
      errorFun(error)
    })
  },
  //判断用户是否是当天投票
  dayChangFun() {
    let that = this;
    let oldTime = parseInt(wx.getStorageSync('voteed').time);
    //console.log(new Date().getTime())
    if (oldTime) {
      let time = new Date().getTime();
      let newTime = app.fmtDateT(time);
      let oldTimeS = app.fmtDateT(oldTime);
      //console.log(oldTime,oldTimeS, newTime);
      if (newTime == oldTimeS) {
        wx.setStorageSync("rotees", true)
      } else {
        wx.setStorageSync("rotees", false)
      }
    } else {
      wx.setStorageSync("rotees", false)
    }
    that.voteedFun();
  },
  //获取用户信息
  onGotUserInfo() {
    let that = this;
    wx.login({
      success: function(e) {
        var code = e.code
        //console.log(code)
        wx.getUserInfo({
          withCredentials: true,
          lang: 'zh_CN',
          success: function(res) {
            //console.log(res.encryptedData,res.iv)
            wx.setStorageSync('nickName', res.userInfo.nickName);
            wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
            wx.getImageInfo({ //  小程序获取图片信息API
              src: res.userInfo.avatarUrl,
              success: function(res) {
                that.data.head_img = res.path;
                that.data.allNum = 1 + that.data.allNum;
                wx.setStorageSync('head_img', res.path);
              },
              fail(err) {
                console.log(err)
              }
            });
            loginApi.getOppenId({
              code: code,
              encryptedData: res.encryptedData,
              iv: res.iv,
            }, function(res) {
              wx.setStorageSync('openid', res.data.data);
              wx.setStorageSync('userInfo', '1');
              that.setData({
                showAlt: false,
                showLogin: false
              });
              that.dayChangFun();
              // console.log(res.data.data)
            }, function(errorMsg) {
              wx.setStorageSync('userInfo', '0');
              errorFun("授权失败,请稍后再试");
              that.setData({
                showAlt: false,
                showLogin: true
              });
            })
            //that.getOpenID(code, res.encryptedData, res.iv) //调用服务器api

          },
          fail: function() {
            that.setData({
              loginBtn_show: true
            })
            wx.setStorageSync('userInfo', '0');
          }
        })
      }
    })
  },
  //分享
  shearFun(e) {
    let that = this;
    let canvasEle = that.selectComponent("#canvasEle");
    canvasEle.showFun(e.target.dataset.id, e.target.dataset.name, e.target.dataset.num)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.init();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
    let that = this;
    clearInterval(that.data.baginTime)
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
  onShareAppMessage: function(options) {
    //console.log(options)
    //var path = '/pages/content/content?nid=' + options.target.dataset.id
    return {
      title: options.target.dataset.title,
      imageUrl: options.target.dataset.img
    }
  },
})