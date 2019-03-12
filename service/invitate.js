var allGlobal = require("../util/globalAjxa.js").serverGlobal;
var allServerApi = {
    getZhuli: function(data, success, errorMsg) {
        allGlobal.request({
          url: allGlobal.getServerUrl('api.ashx?action=774d981d-e85a-43d6-ad22-54f0060cfcf7'),
            contType: 'application/x-www-form-urlencoded',
            method: 'POST',
            data: data,
            success: success,
            error: errorMsg
        })
    }

};
module.exports.allServerApi = allServerApi;