var allGlobal = require("../util/globalAjxa.js").serverGlobal;
var allServerApi = {
  // 获取群信息
  getGroupInfo: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=99d5b376-74ea-4891-accc-e2e8d075d735'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  //不同类型的群操作
  addGroupType: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=90cfeed7-877e-4fca-a4a5-621908c3a27b'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  // 药友荟助力加群生成分享小程序码
  getErweimaImg: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=d4b4d137-c561-4690-9415-510cac9a423b'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  // 药友荟助力加群生成海报
  getAddGroupHaiBao: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=ac1d6de9-98d5-447c-a60b-f2a33707b51f'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  }
};
module.exports.allServerApi = allServerApi;