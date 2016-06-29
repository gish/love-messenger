'use strict';

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _middleware = require('./lib/middleware.auth');

var _middleware2 = _interopRequireDefault(_middleware);

var _messageList = require('./lib/message-list');

var _messageList2 = _interopRequireDefault(_messageList);

var _sendLoveMessage = require('./lib/send-love-message');

var _sendLoveMessage2 = _interopRequireDefault(_sendLoveMessage);

var _getRequiredKey = require('./lib/get-required-key');

var _getRequiredKey2 = _interopRequireDefault(_getRequiredKey);

var _logger = require('./lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

if (isDevelopment) {
  _dotenv2.default.load();
}

var requiredKeys = ['API_KEY', 'ELKS_API_PASSWORD', 'ELKS_API_USERNAME', 'GOOGLE_SPREADSHEET_ID', 'MESSAGE_RECEIVER_NUMBER', 'MESSAGE_SENDER_NAME'];

var config = requiredKeys.reduce(function (obj, requiredKey) {
  obj[requiredKey] = (0, _getRequiredKey2.default)(process.env, requiredKey);
  return obj;
}, {});

config.PORT = process.env.PORT || 8080;

var logger = (0, _logger2.default)({
  level: 'debug',
  slack: {
    apiToken: process.env.SLACK_API_TOKEN,
    domain: process.env.SLACK_DOMAIN,
    logLevel: process.env.SLACK_LOG_LEVEL,
    channel: process.env.SLACK_CHANNEL,
    userName: process.env.SLACK_USERNAME
  }
});

var app = (0, _express2.default)();

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use((0, _middleware2.default)({
  apiKey: config.API_KEY
}));

// POST message
app.post('/message', function (req, res) {
  var todaysDate = (0, _moment2.default)().format('YYYY-MM-DD');

  logger.debug('Got message POST request');

  (0, _messageList2.default)(config.GOOGLE_SPREADSHEET_ID).then(function (messageList) {
    var message = messageList.filter(function (message) {
      return message.date === todaysDate;
    })[0];
    var messageText = message.message || '';

    if (messageText.length === 0) {
      logger.info('No message of the day');

      res.status(204);
      res.send('No message of the day');
    } else {
      logger.debug('Trying to send message "' + messageText + '"');
      (0, _sendLoveMessage2.default)({
        senderName: config.MESSAGE_SENDER_NAME,
        receiverNumber: config.MESSAGE_RECEIVER_NUMBER,
        message: messageText,
        username: config.ELKS_API_USERNAME,
        password: config.ELKS_API_PASSWORD,
        logger: logger
      }).then(function () {
        var receiverNumber = config.MESSAGE_RECEIVER_NUMBER;
        logger.info('Sent message "' + messageText + '" to ' + receiverNumber);

        res.status(202);
        res.send('Sent message "' + messageText + '"');
      }).catch(function () {
        res.status(500);
        res.send('Error sending message');
      });
    }
  }).catch(function () {
    res.status(500);
    res.send('Error getting messages');
  });
});

app.listen(config.PORT, function () {
  logger.debug('Server running on port ' + config.PORT);
  logger.debug('Config: %j', config);
});