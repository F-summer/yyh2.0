// components/groupDesc/groupDesc.js
import SlotMachine from '../../components/slotMachine/slotMachine.js'
const flockListApi = require("../../service/flockList.js").allServerApi;
const group_descApi = require("../../service/group_desc.js").allServerApi;
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    groupShow: {
      type: Boolean
    },
    groupid: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    width: 622,
    height: 760,
    showFixed: false,
    name: "",
    desc: "",
    title: "",
    bg_img: "/images/canvas/bg.png",
    enjoy: "/images/canvas/enjoy.png",
    titleImg: "/images/canvas/find.png",
    logoImg: "/images/canvas/logo.jpg",
    erweima: "",
    renshu: "",
    content: true,
    rulers: false,
    showEnjoyBtn:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //初始化数据
    getInfo(gid) {
      var that = this
      let arr = [];
      let numArr=[];
      that.setData({
        showText: "正在为您生成入群口令",
        showEnjoyBtn: false
      })
      if (gid < 10) {
        numArr.splice(0, 0, "0");
        numArr.splice(1, 0, "0");
        numArr.splice(2, 0, "0");
        numArr.splice(3, 0, gid);
        that.createNumber(numArr);
      } else if (gid >= 10 && gid < 100) {
        numArr = String(gid).split('');
        numArr.splice(0, 0, "0");
        numArr.splice(1, 0, "0");
        that.createNumber(numArr);
      } else if (gid >= 100 && gid < 1000) {
        numArr = String(gid).split('');
        numArr.splice(0, 0, "0");
        that.createNumber(numArr);
      } else if (gid >= 1000 && gid < 10000) {
        numArr = String(gid).split('');
        that.createNumber(numArr);
      }
      group_descApi.getGroupInfo({
        mp_openid: wx.getStorageSync("openid"),
        id: gid,
        type: 1 //（ 0 / 1,头像取随机头像/头像取助力头像）
      }, function(res) {

        if (res.data.data.total == 0) {
          that.setData({
            jieshu: true,
            shenqing: false,
            zhulizhong: false,
            success: false,
            name: res.data.data.room_name,
            src: res.data.data.head_img,
            desc: res.data.data.intro,
            sum: res.data.data.room_count,
            erweima: res.data.data.wx_code,
            needHelp: res.data.data.need_help,
            hasHelp: res.data.data.has_help,
            total: res.data.data.total
          })
          that.getImgList(0, gid); //随机头像
        }
        if (res.data.data.status == 0 && res.data.data.total != 0) {
          that.setData({
            jieshu: false,
            shenqing: true,
            zhulizhong: false,
            success: false,
            name: res.data.data.room_name,
            src: res.data.data.head_img,
            desc: res.data.data.intro,
            sum: res.data.data.room_count,
            erweima: res.data.data.wx_code,
            needHelp: res.data.data.need_help,
            hasHelp: res.data.data.has_help,
            total: res.data.data.total
          })
          that.getImgList(0, gid); //随机头像
        }
        if (res.data.data.status == 1 && res.data.data.need_help > 0 && res.data.data.total != 0) {
          that.setData({
            jieshu: false,
            shenqing: false,
            zhulizhong: true,
            success: false,
            name: res.data.data.room_name,
            src: res.data.data.head_img,
            desc: res.data.data.intro,
            sum: res.data.data.room_count,
            erweima: res.data.data.wx_code,
            needHelp: res.data.data.need_help,
            hasHelp: res.data.data.has_help,
            total: res.data.data.total
          })
          that.getImgList(1, gid); //助力头像
        }
        if (res.data.data.need_help == 0 && res.data.data.total != 0) {
          that.setData({
            jieshu: false,
            shenqing: false,
            zhulizhong: false,
            success: true,
            name: res.data.data.room_name,
            src: res.data.data.head_img,
            desc: res.data.data.intro,
            sum: res.data.data.room_count,
            erweima: res.data.data.wx_code,
            needHelp: res.data.data.need_help,
            hasHelp: res.data.data.has_help,
            total: res.data.data.total
          })
          that.getImgList(1, gid); //助力头像
        }
      }, function(error) {
        console.log(error)
      })
    },
    getImgList(num, gid) {
      var that = this
      group_descApi.getGroupInfo({
          mp_openid: wx.getStorageSync("openid"),
          id: gid,
          type: num //（ 0 / 1,头像取随机头像/头像取助力头像）
        }, function(res) {

          if (num == 1) {
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
          } else {
            that.setData({
              imgList: res.data.data.list
            })
          }
        },
        function(error) {
          console.log(error)
        })
    },

    //生成数字
    createNumber(arr) {
      let that = this;
      var slotMachine = new SlotMachine(that, {
        height: 70, // 单个数字高度
        len: 10,
        transY1: 0,
        num1: arr[0],
        transY2: 0,
        num2: arr[1],
        transY3: 0,
        num3: arr[2],
        transY4: 0,
        num4: arr[3],
        speed: 24,
        callback: () => {
          that.setData({
            showText: "您的入群口令是",
            showEnjoyBtn:true
          })
        }
      })
      slotMachine.start()
    },
    backmenu() {
      this.setData({
        groupShow: false,
        content: true,
        zhulirulers: false,
        rulers: false,
        shenqinged: false
      })
      var slotMachine = new SlotMachine(this, {
        height: 70, // 单个数字高度
        len: 10,
        transY1: 0,
        num1: 0,
        transY2: 0,
        num2: 0,
        transY3: 0,
        num3: 0,
        transY4: 0,
        num4: 0,
        speed: 100
      })
      slotMachine.reset()
      wx.removeStorageSync("src")
      wx.removeStorageSync("erweima")
    },

    //不同操作类型
    addGroupType(e) {
//      console.log(e.target.dataset.type);
      var that = this
      if (e.target.dataset.allow == "allow") {
        that.setData({
          allow: true,
          shenqinged: true
        })
      }
      if (e.target.dataset.allow == "allowShow") {
        that.setData({
          shenqinged: false
        })
      }
      group_descApi.addGroupType({
        mp_openid: wx.getStorageSync("openid"),
        id: e.target.dataset.id,
        form_id: e.detail.formId,
        type: e.target.dataset.type,
        openid: wx.getStorageSync("sdopenid") ? wx.getStorageSync("sdopenid") : ''
      }, function(res) {
//        console.log(res)

      }, function(error) {
        console.log(error)
      })
    },
    // 立即入群
    addFlock(e) {
      app.aldstat.sendEvent('点击加群了');
      let showLogin = app.getUserInfoFun();
      if (!showLogin) {
        flockListApi.recordAddFlock({
          mp_openid: wx.getStorageSync('openid'),
          room_id: e.currentTarget.dataset.id
        }, function(res) {

        }, function(error) {
        })
      }
    },
    //生成海报
    haibao(e) {
      let that = this;
      wx.showLoading({
        title: '正在保存'
      });
      group_descApi.getAddGroupHaiBao({
        mp_openid: wx.getStorageSync("openid"),
        id: e.target.dataset.id,
        posterid:1
      }, function (res) {
        // console.log(res)
        wx.getImageInfo({
          src: res.data.data.poster_url,
          success: function (suc) {
            // console.log(suc)
            wx.saveImageToPhotosAlbum({
              filePath: suc.path,
              success: function (res) {
                wx.hideLoading();
                wx.showModal({
                  title: '海报已保存到系统相册',
                  content: '快去分享到朋友圈，叫小伙伴来围观吧！',
                  showCancel: false,
                  success(res) {
                  }
                })
              },
              fail: function (err) {
                console.log(err)
              }
            })
          },
          fail: function (err) {
            console.log(err)
          }
        })       
      }, function (error) {
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
    headAlt() {
      let that = this;
      that.setData({
        showAlt: false
      })
    },
    firstshenqing() {
      wx.showModal({
        title: '提示',
        content: '请先申请入群！',
        showCancel: false,
        success(res) {
          if (res.confirm) {
//            console.log('用户点击确定')
          } else if (res.cancel) {
    //        console.log('用户点击取消')
          }
        }
      })
    }
  }
})