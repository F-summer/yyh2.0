var allGlobal = require("../util/globalAjxa.js").serverGlobal;
var allServerApi = {
  // 获取oppenId
  pay: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=9ac3681c-f573-4a27-91f6-82dfe2ace275'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
};
module.exports.allServerApi = allServerApi;