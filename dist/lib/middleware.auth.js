'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var authMiddleware = function authMiddleware(config) {
  return function (req, res, next) {
    var givenApiKey = req.query['key'];
    var authorized = givenApiKey === config.apiKey;

    if (authorized) {
      next();
    } else {
      res.status(401);
      res.send('Invalid API key');
    }
  };
};

exports.default = authMiddleware;