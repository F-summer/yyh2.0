// components/canvas/canvas.js
//const creatorAPI = require("../../service/index.js").allServerApi;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    contId: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    width: 622,
    height: 760,
    showFixed: false,
    groupName: "",
    group_des: "",
    group_img: "",
    group_id: 0,
    title: "",
    bg_img: "/images/canvas/bg.png",
    enjoy: "/images/canvas/enjoy.png",
    titleImg: "/images/canvas/find.png",
    erweima: "",
    renshu: ""
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //展示
    showFun(option) {
      let that = this;
      that.setData({
        showFixed: true,
        groupName: option.name,
        group_des: option.desc,
        group_img: option.src,
        title: "",
        group_id: option.id,
        renshu: "(共" + option.sum + "人）",
        erweima: option.erweima
      });
      // that.getImageInfo(option);
    },

    //下载图片到本地
    downloadFun(item) {
      item.forEach((value, index) => {
        wx.getImageInfo({ //  小程序获取图片信息API
          src: value,
          success: function(res) {
            if (index == 0) {
              wx.setStorageSync("src", res.path)
            } else if (index == 1) {
              wx.setStorageSync("erweima", res.path)
            }
          },
          fail(err) {
            console.log(err)
          }
        })

      });
    },
    //隐藏
    hideFun() {
      let that = this;
      that.setData({
        showFixed: false
      })
    },
    //生成海报
    haibao() {
      wx.showLoading({
        title: '正在保存',
        allNum: 0
      });
      let that = this;
      that.data.allNum = 0;
      that.drawFun();


    },
    //绘画过程
    drawFun() {
      let that = this;
      const ctx = wx.createCanvasContext('myCanvas', that);
      // ctx.setFillStyle(0);
      ctx.setFillStyle("rgba(225,225,225)");
      let canvasW = that.data.width;
      let canvasH = that.data.height;
      ctx.fillStyle = 'rgba(255,225,225)';
      ctx.fillRect(0, 0, canvasW, canvasH);
      that.drawTop(ctx, that.data.bg_img);
      that.drawGroupDes(ctx);
      that.erweima(ctx);
      ctx.draw();
      that.saveImg();
    },
    //顶部图
    drawTop(...item) {
      item[0].save(); //保存当前环境的状态
      let that = this
      item[0].drawImage(item[1], 0, 0, 622, 760);
      item[0].restore();
    },
    //群介绍图
    drawGroupDes(...item) {
      item[0].save(); //保存当前环境的状态
      let that = this
      let name = "";
      item[0].drawImage(wx.getStorageSync("src"), 32, 48, 100, 100);

      if (that.data.groupName.length > 13) {
        name = that.data.groupName.substring(0, 12) + "..."
      } else {
        name = that.data.groupName;
      }
      item[0].font = "bold";
      item[0].setFontSize(30);
      item[0].setFillStyle('#333')
      item[0].fillText(name, 155, 78);
      let des1 = "";
      let des2 = "";
      if (that.data.group_des.length >= 14) {
        des1 = that.data.group_des.substring(0, 14);
        if (that.data.group_des.length > 14 && that.data.group_des.length < 28) {
          des2 = that.data.group_des.substring(14, 26) + "...";
        } else if (that.data.group_des.length > 28) {
          des2 = that.data.group_des.substring(14, 26) + "...";
        }
      } else {
        des1 = that.data.group_des;
      }
      item[0].setFontSize(28);
      item[0].setFillStyle('#666')
      item[0].fillText(des1, 155, 123);
      if (des2.length > 0) {
        item[0].setFontSize(28);
        item[0].setFillStyle('#666')
        item[0].fillText(des2, 155, 160);
      }
      item[0].setFontSize(24);
      item[0].setFillStyle('red')
      item[0].fillText(that.data.renshu, 155, 200);
      item[0].restore();
    },
    // 二维码
    erweima(...item) {
      item[0].save(); //保存当前环境的状态
      let that = this
      // item[0].textAlign = "center";
      // item[0].font = "bold";
      // item[0].setFontSize(38);
      // item[0].setFillStyle('#000')
      // item[0].fillText(that.data.title, 311, 320);
      item[0].drawImage(that.data.titleImg, 45, 310, 548, 34);
      item[0].drawImage(wx.getStorageSync("erweima"), 200, 385, 225, 225);
      item[0].drawImage(that.data.enjoy, 172, 640, 280, 64);
      item[0].restore();
    },
    //保存在本地
    saveImg() {
      let that = this;
      wx.hideLoading();
      setTimeout(function() {
        //console.log("下载")
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 1216,
          height: 1942,
          canvasId: 'myCanvas',
          complete: res => {
            //console.log(res)
            if (res.errMsg === 'canvasToTempFilePath:ok') {
              wx.removeStorageSync("src")
              wx.removeStorageSync("erweima")
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(res) {
                  wx.hideLoading();
                  wx.showModal({
                    title: '海报已保存到系统相册',
                    content: '快去分享到朋友圈，叫小伙伴来围观吧！',
                    showCancel: false,
                    success(res) {
                      if (res.confirm) {
                        wx.switchTab({
                          url: '/pages/index/index',
                        })
                      }
                    }
                  })

                },
                fail(res) {
                  //console.log(res)
                  wx.hideLoading()
                }
              })
            } else {

            }
          }
        }, that)
      }, 500);
    },
  }
})