"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getRequiredKey = function getRequiredKey(obj, key) {
  if (obj.hasOwnProperty(key)) {
    return obj[key];
  } else {
    console.error("[getRequiredKey] " + key + " not defined");
    process.exit(1);
    return false;
  }
};

exports.default = getRequiredKey;