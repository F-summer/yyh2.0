var allGlobal = require("../util/globalAjxa.js").serverGlobal;
var allServerApi = {
  // 获取oppenId
  getLiveList: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=edd95a85-760b-448a-bd2c-1350d9edb796'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  getUid: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=476fcda9-f399-46d4-aac9-246a87d59187'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  sendMark: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=a63975a8-ca91-48c1-8173-ec668b0eafc4'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  getVoteed: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=99fe6137-ad12-4864-8efc-68b988ee8048'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  }
};
module.exports.allServerApi = allServerApi;