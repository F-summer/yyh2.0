var allGlobal = require("../util/globalAjxa.js").serverGlobal;
var allServerApi = {
  // 获取群列表
  getflockList: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=0403aa8e-c821-45b4-b4d2-676bca300c0a'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  //记录搜索历史以及热门搜索
  sendOldHertList: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=be1a03d0-af61-483f-8185-e3b9504574c3'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  //获取搜索历史以及热门搜索
  getOldHertList: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=c8794054-07c0-4d8b-9519-b2af750321fb'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  //获取轮播图
  getCarouselList:function(data,success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=e919b53b-37a8-410e-90a4-c723f6485973'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  //获取消息
  getMsgList: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=2d42f68a-2878-4fac-bd82-9bb5dfed3c31'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  //清除历史记录
  clearOldList: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=484d0b65-ece8-464a-b9ce-3fbe894277fe'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  //记录加群信息
  recordAddFlock: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=655baf87-17b0-4cbc-9599-39abacea1a04'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
};
module.exports.allServerApi = allServerApi;