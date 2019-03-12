//flj 2018/9/7
//调用底层封装对象
var allGlobal = require("../util/globalAjxa.js").serverGlobal;
var allServerApi = {
  //获取群信息
  getData: function( success, error) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=107772f8-b13e-400b-8b77-d57fa5b84f0b'),
      contType: "application/x-www-form-urlencoded",
      method: 'POST',
      success: success,
      error: error,
    })
  },
}


module.exports.allServerApi = allServerApi;