'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _sha = require('sha1');

var _sha2 = _interopRequireDefault(_sha);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _auth = require('./lib/auth.js');

var _auth2 = _interopRequireDefault(_auth);

var _messageList = require('./lib/message-list');

var _messageList2 = _interopRequireDefault(_messageList);

var _sendLoveMessage = require('./lib/send-love-message');

var _sendLoveMessage2 = _interopRequireDefault(_sendLoveMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 8080;
var SALT = process.env.SALT || 'def456';
var API_KEY = process.env.API_KEY || (0, _sha2.default)(SALT + 'abc123');
var MESSAGE_SENDER_NAME = process.env.MESSAGE_SENDER_NAME;
var MESSAGE_RECEIVER_NUMBER = process.env.MESSAGE_RECEIVER_NUMBER;
var GOOGLE_SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1hqAPPlbwHrf8E8MuJ6QJSobAEliT3UFwN0xA3vp5-2Y';
var ELKS_API_USERNAME = process.env.ELKS_API_USERNAME;
var ELKS_API_PASSWORD = process.env.ELKS_API_PASSWORD;

var app = (0, _express2.default)();

// Authentication middleware
var authMiddleware = function authMiddleware(req, res, next) {
  var givenApiKey = req.query['key'];
  var authorized = (0, _auth2.default)({
    given: givenApiKey,
    expected: API_KEY,
    salt: SALT
  });

  if (authorized) {
    next();
  } else {
    res.status(401);
    res.send('Invalid API key');
  }
};

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(authMiddleware);

// POST message
app.post('/message', function (req, res) {
  var todaysDate = (0, _moment2.default)().format('YYYY-MM-DD');

  console.log('Got message POST request');

  (0, _messageList2.default)(GOOGLE_SPREADSHEET_ID).then(function (messageList) {
    var message = messageList.filter(function (message) {
      return message.date === todaysDate;
    })[0];
    var messageText = message.message || '';

    if (messageText.length === 0) {
      console.log('No message of the day');
      res.send('No message of the day');
      res.status(204);
    } else {
      console.log('Trying to send message "' + messageText + '"');
      (0, _sendLoveMessage2.default)({
        senderName: MESSAGE_SENDER_NAME,
        receiverNumber: MESSAGE_RECEIVER_NUMBER,
        message: messageText,
        username: ELKS_API_USERNAME,
        password: ELKS_API_PASSWORD
      });
      res.send('Sent message ' + message);
      res.status(202);
    }
  }).catch(function () {
    res.send('Error getting messages');
    res.status(500);
  });
});

app.listen(PORT, function () {
  console.log('Server running on port ' + PORT);
  console.log('API key: ' + API_KEY);
});
