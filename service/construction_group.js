var allGlobal = require('../util/globalAjxa.js').serverGlobal;
var allServerApi = {
  getContructionList:function(data,suc,err){
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=92f653a3-5643-49bd-917b-e69e68cad61a'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: suc,
      error: err
    })
  },
  zhuli: function (data, suc, err) {
    allGlobal.request({
      url: allGlobal.getServerUrl('api.ashx?action=bf9c9f78-4045-4be9-acf4-76183ef9d375'),
      contType: 'application/x-www-form-urlencoded',
      method: 'POST',
      data: data,
      success: suc,
      error: err
    })
  }

};
module.exports.allServerApi = allServerApi;