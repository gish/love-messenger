'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _winstonSlack = require('winston-slack');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setupLogger = function setupLogger() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _winston2.default.level = options.level || 'debug';

  if (options.slack && options.slack.apiToken) {
    _winston2.default.add(_winstonSlack.Slack, {
      domain: options.slack.domain,
      apiToken: options.slack.apiToken,
      channel: options.slack.channel,
      username: options.slack.username,
      level: options.slack.level,
      handleExceptions: true
    });
  }

  return _winston2.default;
};

exports.default = function (options) {
  return setupLogger(options);
};