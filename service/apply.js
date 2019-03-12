var allGlobal = require("../util/globalAjxa.js").serverGlobal;
var allServerApi = {
  // 获取群列表
  applyServe: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=782238ca-2681-4a60-b0a5-ed5dfba3f279'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  }

};
module.exports.allServerApi = allServerApi;