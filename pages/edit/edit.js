// pages/edit/edit.js
const feedbackApi = require("../../service/feedback.js").allServerApi;
const cardsApi = require("../../service/cards.js").allServerApi;
const editApi = require("../../service/edit.js").allServerApi;
const errorFun = require("../../util/errorMsg.js"); 
const loginApi = require("../../service/login.js").allServerApi;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: wx.getStorageSync('openid'),
    user_type: "", //用户类型
    hideone: "隐藏",
    hidetwo: "隐藏",
    des: 0,
    biaoqian: 0,
    fuze: 0,
    want: 0,
    imgArr: [],
    phoneHide: 1,
    wxHide: 1,
    getImgMsg: '', //照片列表
    biaoqianArr: [],
    biaoqianTxt: '',
    biaoqianStr: ''
  },
  switch1Change(e) {
    let that = this;
    if (e.detail.value) {
      that.setData({
        hideone: "隐藏",
        phoneHide: 1
      })
    } else {
      that.setData({
        hideone: "显示",
        phoneHide: 0
      })
    }
  },
  switch2Change(e) {
    let that = this;
    if (e.detail.value) {
      that.setData({
        hidetwo: "隐藏",
        wxHide: 1
      })
    } else {
      that.setData({
        hidetwo: "显示",
        wxHide: 0
      })
    }
  },
  descibe(e) {
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最少字数限制
    this.setData({
      des: len
    })
  },
  fuze(e) {
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最少字数限制
    this.setData({
      fuze: len
    })
  },
  want(e) {
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最少字数限制
    this.setData({
      want: len
    })
  },
  biaoqian(e) {
    var arr = this.data.biaoqianArr;
    if (arr.length == 20) {
      wx.showToast({
        title: '最多20个标签!',
        icon: 'none',
        duration: 1500
      })
      this.setData({
        biaoqianTxt: ""
      })
      return;
    }
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最少字数限制
    this.setData({
      biaoqianTxt: value
    })
  },
  biaoqianSub(e) {
    var arr = this.data.biaoqianArr;
    if (this.data.biaoqianTxt.replace(/\s+/g, "").length > 0) {
      arr.push(this.data.biaoqianTxt);
      this.setData({
        biaoqianArr: arr,
        biaoqian: arr.length,
        biaoqianTxt: "",
        biaoqianStr: arr.toString()
      })
    }
  },
  // 删除标签
  delBianqian(e) {
    var arr = this.data.biaoqianArr;
    let indexNum = e.currentTarget.dataset.id;
    arr.splice(indexNum, 1);
    this.setData({
      biaoqianArr: arr,
      biaoqianStr: arr.toString()
    })
  },
  //选择图片
  chooseimage: function(event) {
    let that = this;
    wx.chooseImage({
      count: 8 - that.data.imgArr.length, // 默认8  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let arr = that.data.imgArr;
        //显示成功
        if (res.errMsg == "chooseImage:ok") {
          res.tempFilePaths.forEach((val, index) => {
            arr.push({
              status: 1,
              src: val
            });
          });
          that.setData({
            imgArr: arr
          })
        } else {
          error("操作失败请重试")
        }
      }
    })
  },
  //获取手机号
  getPhoneNumber(e) {
    let that = this;
    let event = e;
    wx.login({
      success: function (e) {
        loginApi.getPhone({
          mp_openid: wx.getStorageSync('openid'),
          iv: event.detail.iv,
          encryptedData: event.detail.encryptedData,
          code: e.code
        }, function (successMsg) {
        that.setData({
          phone_num: successMsg.data.data.phone
        })
        }, function (errorMsg) {
          
        })
      }
    });
  },
  //删除选中的照片
  delImgFun(e) {
    let that = this;
    let indexNum = e.currentTarget.dataset.index;
    that.data.imgArr.splice(indexNum, 1);
    that.setData({
      imgArr: that.data.imgArr
    })
  },
  formSubmit: function(e) {
    var that = this;
    let {
      name,
      company, //公司 
      post, //职务 
      address, //地址 
      phone, //手机 
      wechat, //微信 
      youxiang, //邮箱 
      des, //简介 
      fuze, //负责内容 
      want //想要什么 
    } = e.detail.value
    if (!name) {
      wx.showToast({
        title: '请输入您的姓名!',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!company) {
      wx.showToast({
        title: '请输入您的公司名称!',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!post) {
      wx.showToast({
        title: '请输入您的职位名称!',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!phone) {
      wx.showToast({
        title: '请输入你的手机号!',
        icon: 'none',
        duration: 1500
      })
      return;
    } else {
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone)) || phone.length > 11) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }
    if (!wechat) {
      wx.showToast({
        title: '请输入您的微信号!',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (youxiang) {
      if (!/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(youxiang)) {
        wx.showToast({
          title: '邮箱格式有误',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }
    if (!des) {
      wx.showToast({
        title: '请输入您的一句话简介!',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (that.data.biaoqianArr.length == 0) {
      wx.showToast({
        title: '请输入您的行业标签(至少一项)!',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!fuze) {
      wx.showToast({
        title: '请输入您的负责内容!',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    that.setData({
      rtnData: e.detail.value
    })
    that.sendDataFun();
  },
  //提交反馈
  sendDataFun() {
    wx.showLoading({
      title: '正在保存',
    })
    var that = this;
    if (wx.getStorageSync('openid')) {
      let getImgMsg = '';
      let newImgArr = [];
      //如果有图片就上传图片没有直接上传信息
      if (that.data.imgArr.length > 0) {
        feedbackApi.sendImgData(that.data.imgArr, 'file',
          function(res) {
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
          },
          function(error) {
            console.log(error)
          });
      } else {
        that.upAllMsg();
      }
    } else {
      error("请先登录");
    }
  },
  //上传所有信息
  upAllMsg() {
    let that = this;
    let {
      name,
      company, //公司 
      post, //职务 
      address, //地址 
      phone, //手机 
      wechat, //微信 
      youxiang, //邮箱 
      des, //简介 
      fuze, //负责内容 
      want //想要什么 
    } = that.data.rtnData;
    editApi.sendInfo({
        mp_openid: that.data.openid,
        scene_id: 11,
        real_name: name ? name : "", //真实姓名
        company: company ? company : "", //公司名称
        duty: post ? post : "", //职务
        company_address: address ? address : "", //公司地址
        phone_num: phone ? phone : "", //手机号
        phone_num_hide: that.data.phoneHide, //手机是否隐藏   0 隐藏 1 显示
        wechat_num: wechat ? wechat : "", //微信号
        wechat_num_hide: that.data.wxHide, //微信号是否隐藏  0 隐藏 1 显示
        mail: youxiang ? youxiang : "", //邮箱
        introduce: des ? des : "", //一句话简介
        trade_label: that.data.biaoqianStr, //行业标签 数组
        responsible: fuze ? fuze : "", //负责什么
        want: want ? want : "", //想要什么
        photo_list: that.data.getImgMsg //图片  数组
      },
      function(res) {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '您的名片已保存成功，分享好友或群聊天，结识更多人脉信息！',
          showCancel: false,
          success: function() {
            wx.redirectTo({
              url: '/pages/mycard/mycard',
            })
          }
        })

      },
      function(error) {
        wx.showModal({
          title: '提示',
          content: '保存失败',
          showCancel: false
        })

      });
  },
  imgPre(e) {
    let src = e.currentTarget.dataset.src;
    let arr = [];
    arr.push(src);
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  init() {
    let that = this;
    cardsApi.getCardNum({
      mp_openid: wx.getStorageSync('openid'),
      scene_id: 11
    }, function(res) {
      if (res.data.data.status == 1) {
        wx.redirectTo({
          url: '/pages/mycard/mycard',
        })
      }

    }, function(error) {

    });
  },
  checkLogin: function() {
    var that = this;
    var openid = wx.getStorageSync('openid')
    if (!openid) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.checkLogin();
    this.setData({
      head_img: wx.getStorageSync("head_img"),
      nickName: wx.getStorageSync("nickName")
    })
    wx.showLoading({
      title: '获取数据中',
    })
    this.getMingPianInfo();
    if (options.scene) {
      this.setData({
        user_type: options.scene
      })
    }
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
    this.setData({
      head_img: wx.getStorageSync("head_img"),
      nickName: wx.getStorageSync("nickName"),
      openid: wx.getStorageSync("openid")
    })
//    this.getMingPianInfo();
    if (this.data.user_type) {
      this.init();
    }
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
  onShareAppMessage: function() {

  },
  getMingPianInfo() {
    let that = this
    cardsApi.getCardsData({
      mp_openid: wx.getStorageSync('openid'),
      scene_id: 11
    }, function(res) {
      console.log(res)
      let str = res.data.data.trade_label.toString();
      let arr = str.length > 0 ? str.split(',') : [];
      let strT = res.data.data.photo_list.toString();
      let arrT = strT.length > 0 ? strT.split(',') : [];
      let bendiarr = []
      arrT.forEach(function(item, index) {
        wx.getImageInfo({
          src: item,
          success: function(res) {
            bendiarr.push({
              status: 1,
              src: res.path
            });
            that.setData({
              imgArr: bendiarr
            });
          }
        })
      })
      if (res.data.data.phone_num_hide != null) {
        that.setData({
          phoneHide: res.data.data.phone_num_hide
        })
      } else {
        that.setData({
          phoneHide: 1
        })
      }
      if (res.data.data.wechat_num_hide != null) {
        that.setData({
          wxHide: res.data.data.wechat_num_hide
        })
      } else {
        that.setData({
          wxHide: 1
        })
      }
      that.setData({
        head_img: res.data.data.hand_img,
        dataobj: res.data.data,
        hideone: res.data.data.phone_num_hide == 1 ? "隐藏" : '显示',
        hidetwo: res.data.data.wechat_num_hide == 1 ? "隐藏" : '显示',
        biaoqianArr: arr,
        biaoqian: arr.length,
        biaoqianStr: arr.toString(),
        des: res.data.data.introduce.length,
        fuze: res.data.data.responsible.length,
        want: res.data.data.want.length,
        phone_num: res.data.data.phone_num
      })
      wx.hideLoading()
    }, function(error) {

    });
  }
})