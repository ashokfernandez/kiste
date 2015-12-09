'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_fs2.default);

var FILE_CACHE = {};

function loadJsFileAsString(jsFileName) {
  // Add the SQL suffix to the queries filename if it isn't there already
  if (!_lodash2.default.endsWith(jsFileName, '.js')) {
    jsFileName += '.js';
  }

  var pathToJsFile = _path2.default.join(__dirname, jsFileName);
  var cachedJs = FILE_CACHE[pathToJsFile];

  if (cachedJs) {
    return _bluebird2.default.resolve(cachedJs);
  } else {
    return _fs2.default.readFileAsync(pathToJsFile, 'utf8');
  }
}

module.exports = loadJsFileAsString;
