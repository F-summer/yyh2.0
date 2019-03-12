var allGlobal = require("../util/globalAjxa.js").serverGlobal;

var allServerApi = {
  // 获取城市列表
  sendInfo: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=4608a62f-8677-4bdf-b206-26cc886463ed'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  }
};
module.exports.allServerApi = allServerApi;