var allGlobal = require("../util/globalAjxa.js").serverGlobal;
var allServerApi = {
  // 获取oppenId
  getVoteList: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=85e58fbe-8041-41b1-97da-4d1ea7d3cad4'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  getInitData: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=2079601e-8f7d-4349-883f-dcd3d2cbf2cb'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  sendVoteData: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=31007e2a-4340-48dc-8f72-4f2d66cc46f2'),
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