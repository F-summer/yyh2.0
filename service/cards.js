var allGlobal = require("../util/globalAjxa.js").serverGlobal;
var allServerApi = {
  // 获取我的卡片信息
  getCardsData: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=247b1952-fa6e-4916-9fc8-f345c47da1f5'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  //获取关注，认可，访客信息
  getCardNum: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=d40e8b21-cdd1-4782-beb9-95ce8a80f1f4'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  //获取我的人脉列表信息
  getMyconnection: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=6644e5d5-773c-422c-9b51-c2c51b7947ad'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  //获取自己卡片信息
  getcardImg: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=c6aa36da-fa86-4d63-8a4c-9f76ba338c8e'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  //关注，点赞
  tapData: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=e7ed4b8d-a7e1-4d9d-b3ec-fd5a3fd58c4e'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  //卡片详情页
  cardOther: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=31d5f7fd-1340-48ee-857c-f908b0cbf725'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  //生成海报
  havePoster: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=a44ab501-6236-49f9-8f22-3bcec047f316'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },

};
module.exports.allServerApi = allServerApi;