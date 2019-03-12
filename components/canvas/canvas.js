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
    },
    typeNum: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    width: 750,
    height: 1218,
    headR: 55,
    pX: 40,
    headY: 364,
    logoY: 898,
    bannerH: 341,
    logoW: 140,
    lineH: 880,
    LineWidth: 670,
    title: '纪念“改革开放40年”为医药行业点赞',
    head_img: wx.getStorageSync('head_img'),
    allNum: 0,
    showFixed: false,
    sendData: []
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //转换单位
    changRpx() {
      //海报宽度
      let that = this,
        rpxNum = that.data.rpxNum;
      that.setData({
        pW: 750 / rpxNum,
        pH: 918 / rpxNum,
        imgH: 340 / rpxNum,
        headT: 24 / rpxNum + that.data.imgH,
        leftW: 40 / rpxNum,
        userNameT: 40 / rpxNum + that.data.imgH,
        textT: 16 / rpxNum + that.data.userNameT,
        lineT: 720 / rpxNum,
        logoT: 748 / rpxNum,
        logoTextT: 68 / rpxNum + that.data.lineT
      })

    },
    //生成海报
    haibao() {
      wx.showLoading({
        title: '正在保存'
      });
      let that = this;
      that.data.allNum = 0;
      //that.getImageInfo(headImgInfo);
      that.drawFun();
    },
    //绘画过程
    drawFun() {
      let that = this;
      let title = that.data.title;
      let bannerImg = wx.getStorageSync('card_img');
      let logoImg = wx.getStorageSync('votelogo');
      //console.log(that.data.head_img);
      const ctx = wx.createCanvasContext('myCanvas', that);
      ctx.setFillStyle('#ffffff');
      let canvasW = that.data.width;
      let canvasH = that.data.height;
      let userName = wx.getStorageSync('nickName')
      ctx.fillRect(0, 0, canvasW, canvasH);
      //that.getImageInfo(ctx,item)
      that.drawBanner(ctx, bannerImg);
      that.drawLogo(ctx, logoImg);
      that.drawHead(ctx, that.data.head_img);
      that.drawLine(ctx);
      that.drawEwmMsg(ctx, userName);
      that.drawUserName(ctx, userName);
      if (that.data.sendData[1]) {
        that.drawTitle(ctx, that.data.sendData[1], 94);
        that.drawpiaonum(ctx, that.data.sendData[2], 246)
      } else {
        that.drawTitle(ctx, title, 40);
      }
      ctx.draw();
      that.saveImg();
    },
    //绘制logo二维码
    drawLogo(...item) {
      let that = this,
        leftW = that.data.pX,
        topH = that.data.logoY,
        logoWH = that.data.logoW
      item[0].drawImage(item[1], leftW, topH, logoWH, logoWH);
    },
    //绘制头像
    drawHead(...item) {
      item[0].save(); //保存当前环境的状态
      let that = this,
        r = that.data.headR,
        d = r * 2,
        leftW = that.data.pX,
        topH = that.data.headY;
      item[0].arc(leftW + r, topH + r, r, 0, 2 * Math.PI);
      item[0].clip();
      item[0].drawImage(item[1], leftW, topH, d, d);
      item[0].restore();
    },
    //绘制banner图
    drawBanner(...item) {
      item[0].save(); //保存当前环境的状态
      let that = this,
        bannerW = that.data.width,
        bannerH = that.data.bannerH;
      item[0].drawImage(item[1], 0, 0, bannerW, bannerH);
      item[0].restore();
    },
    //绘制底线
    drawLine(ctx) {
      let that = this,
        leftW = that.data.pX,
        lineTop = that.data.lineH,
        lineW = that.data.LineWidth;
      ctx.setFillStyle('#ebebeb');
      ctx.moveTo(leftW, lineTop);
      ctx.lineTo(lineW + leftW, lineTop);
      ctx.stroke()
    },
    //绘制用户名称
    drawUserName(...item) {
      let that = this;
      item[0].setTextAlign('left')
      item[0].setFontSize(36);
      item[0].setFillStyle('#333')
      item[0].fillText(item[1], 173, 401);
      item[0].setFontSize(26);
      item[0].setFillStyle('#999999')
      item[0].fillText('我为改革开放40周年点赞', 173, 450);
    },
    //绘制文章标题
    drawTitle(...item) {
      let that = this;
      if (item[1].length > 50) {
        item[1] = item[1].substring(0, 50) + "…"
      }
      const CONTENT_ROW_LENGTH = 24; // 正文 单行显示字符长度
      let [contentLeng, contentArray, contentRows] = this.textByteLength(item[1], CONTENT_ROW_LENGTH);
      item[0].setTextAlign('left');
      item[0].setFillStyle('#333')
      item[0].setFontSize(48);
      let contentHh = 48 * 1.3;
      for (let m = 0; m < contentArray.length; m++) {
        item[0].fillText(contentArray[m], item[2], 543 + contentHh * m);
      }
    },
    //绘制票数
    drawpiaonum(...item) {
      let that = this;
      const CONTENT_ROW_LENGTH = 24; // 正文 单行显示字符长度
      let [contentLeng, contentArray, contentRows] = this.textByteLength("点赞数：" + item[1], CONTENT_ROW_LENGTH);
      item[0].setTextAlign('left');
      item[0].setFillStyle('#ff5252')
      item[0].setFontSize(48);
      let contentHh = 48 * 1.3;
      for (let m = 0; m < contentArray.length; m++) {
        item[0].fillText(contentArray[m], item[2], 840 + contentHh * m);
      }
    },
    //绘制底文
    drawEwmMsg(...item) {
      item[0].setTextAlign('left')
      item[0].setFontSize(28);
      item[0].setFillStyle('#333');
      item[0].fillText('长按识别小程序二维码', 220, 960);
      item[0].fillText('进入药友荟，向改革开放致敬', 220, 1000);
    },
    //封装文字折行
    textByteLength(text, num) { // text为传入的文本  num为单行显示的字节长度
      let strLength = 0; // text byte length
      let rows = 1;
      let str = 0;
      let arr = [];
      for (let j = 0; j < text.length; j++) {
        if (text.charCodeAt(j) > 255) {
          strLength += 2;
          if (strLength > rows * num) {
            strLength++;
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        } else {
          strLength++;
          if (strLength > rows * num) {
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        }
      }
      arr.push(text.slice(str, text.length));
      return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
    },
    //保存在本地
    saveImg() {
      let that = this;
      setTimeout(function() {
        console.log("下载")
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 1216,
          height: 1942,
          canvasId: 'myCanvas',
          complete: res => {
            console.log(res)
            if (res.errMsg === 'canvasToTempFilePath:ok') {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(res) {
                  wx.hideLoading();
                  wx.showModal({
                    title: '海报已保存到系统相册',
                    content: '快去分享到朋友圈，叫小伙伴来围观吧！',
                    success(res) {
                      if (res.confirm) {
                        that.hideFun();
                      } else {
                        that.hideFun();
                      }
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
        }, that)
      }, 500);
    },
    //  图片缓存本地的方法
    getImageInfo(item) {
      let that = this;
      //console.log(options)
      let imgArr = new Array();
      item.forEach((value, index) => {
        //       console.log(index,"图片",value)
        if (index > 0) {
          that.downloadFun(value, index)
        }
      });
    },
    //尺寸转换
    rpxFun() {
      let that = this;
      wx.getSystemInfo({
        success: function(res) {
          console.log(res.windowHeight) // 获取可使用窗口高度
          let windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
          that.setData({
            rpxNum: 750 / res.windowWidth
          });
        }
      })
    },
    //获取数据
    getDataFun() {
      let that = this;
      creatorAPI.getPosterData({
        id: that.properties.contId
      }, function(res) {
        res.data.data.push(wx.getStorageSync('avatarUrl'))
        let dataVal = res.data.data;
        //that.getImageInfo(data)
        that.setData({
          news_title: dataVal[0],
          thumb_url: dataVal[1],
          news_id: that.properties.contId,
          dataArr: dataVal
        });
        that.downloadFun(1, dataVal[1]);
        that.downloadFun(2, dataVal[2]);
        that.downloadFun(3, dataVal[3]);
        //that.drawFun(data)
        console.log("获取的数据", res)
      }, function(error) {

      })
    },
    //隐藏
    hideFun() {
      let that = this;
      that.setData({
        showFixed: false
      })
    },
    //下载图片到本地
    downloadFun(...item) {
      //      console.log("参数",item)
      let that = this;
      wx.getImageInfo({ //  小程序获取图片信息API
        src: item[1],
        success: function(res) {
          //          console.log("图片本地地址：", res.path, item[1], item[0]);
          if (item[0] === 1) {
            that.setData({
              bannerImg: res.path,
            });
            that.data.allNum = 1 + that.data.allNum
          } else if (item[0] === 2) {
            that.setData({
              erweima: res.path
            });
            that.data.allNum = 1 + that.data.allNum
          } else {
            that.setData({
              head_img: res.path
            });
            that.data.allNum = 1 + that.data.allNum
          }
          console.log(that.data.allNum)
          if (that.data.allNum === 3) {
            that.drawFun(that.data.dataArr);
          }
        },
        fail(err) {
          //          console.log(err)
        }
      })
    },
    //展示
    showFun(...option) {
      let that = this;
      if (wx.getStorageSync('openid')) {
        that.setData({
          showFixed: true,
          head_img: wx.getStorageSync('head_img')
        });
        if (option[0]) {
          let sendData = option;
          that.setData({
            sendData: sendData
          });
        } else {
          that.setData({
            sendData: []
          });
        }
      } else {
        wx.showToast({
          title: '请登录后转发',
          icon: 'none'
        })
      }

    }
  }
})