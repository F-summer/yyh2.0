var allGlobal = require('../util/globalAjxa.js').serverGlobal;
//接口同意
var allServerApi = {
  //图片信息处理
  sendImgData: function (data, name, success, errorMsg) {
    allGlobal.uploadFile({
      url: allGlobal.getServerUrl('/api.ashx?action=07b3b050-1c62-4581-b9f1-7b3ce4dd5cbe'),
      src: data,
      name:name,
      success: success,
      error: errorMsg
    });
  },
  //上传所有内容
  sendFileAllData: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('/api.ashx?action=9b21df76-a2d0-4531-afb9-925f0f7bbcf0'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    });
  },
  //获取反馈类型
  getFeedbackType: function (success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('/api.ashx?action=598b9237-509f-482c-ba1e-7f9026ec9d78'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      success: success,
      error: errorMsg
    });
  },
  //获取反馈列表
  getFeedbackList: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('/api.ashx?action=433878dd-8481-4ccd-bebb-6b51472920f3'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    });
  },
  //手机号上传
  sendPhone: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('/api.ashx?action=c21fbc3c-ab56-4cf8-8ffd-34ef43f53106'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    });
  }
}

module.exports.allServerApi = allServerApi;