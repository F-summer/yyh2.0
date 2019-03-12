var allGlobal = require("../util/globalAjxa.js").serverGlobal;
var allServerApi = {
  // 获取群列表
  loginServe: function(data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=824896ae-9bf3-4818-955c-babfd84c9d17'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  statusServer: function(data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=1d2e668a-1fff-4236-9d32-4757aa7db041'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
};
module.exports.allServerApi = allServerApi;