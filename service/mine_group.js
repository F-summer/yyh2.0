var allGlobal = require("../util/globalAjxa.js").serverGlobal;
var allServerApi = {
  // 获取oppenId
  getMineGroup: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=8460efd0-1c43-4711-bb09-534313696fae'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  }
};
module.exports.allServerApi = allServerApi;