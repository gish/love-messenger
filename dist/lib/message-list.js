'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var request = require('request');
var getMessageList = function getMessageList(spreadsheetId) {
  return new Promise(function (resolve, reject) {
    var url = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetId + '/od6/public/values?alt=json';
    request.get(url, function (error, response, body) {
      if (error) {
        reject(error);
        return;
      }

      var bodyAsJson = JSON.parse(body);
      var messages = bodyAsJson.feed.entry.map(function (entry) {
        var date = entry.gsx$date.$t;
        var message = entry.gsx$message.$t;

        return {
          date: date,
          message: message
        };
      });

      resolve(messages);
    });
  });
};
exports.default = getMessageList;