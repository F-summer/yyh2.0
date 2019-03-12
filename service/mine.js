var allGlobal = require("../util/globalAjxa.js").serverGlobal;
var allServerApi = {
  // 获取oppenId
  getMoney: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=aedf3d92-37f1-4aeb-b756-1c5de037c966'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  }
};
module.exports.allServerApi = allServerApi;