var allGlobal = require("../util/globalAjxa.js").serverGlobal;

var allServerApi = {
  // 获取城市列表
  getProvinceList: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=f5681222-20ff-4714-abb8-00d6f583e1c0'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  getCityList: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=d8bc1cbc-c21c-4308-a7d3-7bd9f9de5cd7'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  },
  getThemeOrBusiness: function (data, success, errorMsg) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=b75a49e0-290e-42aa-9836-3b7b6356f894'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: success,
      error: errorMsg
    })
  }
};

module.exports.allServerApi = allServerApi;