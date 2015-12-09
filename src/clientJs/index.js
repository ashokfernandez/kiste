import _ from 'lodash'
import Promise from 'bluebird'
import path from 'path'
import fs from 'fs'

Promise.promisifyAll(fs)

var FILE_CACHE = {}

function loadJsFileAsString (jsFileName) {
  // Add the SQL suffix to the queries filename if it isn't there already
  if (!_.endsWith(jsFileName, '.js')) {
    jsFileName += '.js'
  }

  var pathToJsFile = path.join(__dirname, jsFileName)
  var cachedJs = FILE_CACHE[pathToJsFile]

  if (cachedJs) {
    return Promise.resolve(cachedJs)
  } else {
    return fs.readFileAsync(pathToJsFile, 'utf8')
  }
}

module.exports = loadJsFileAsString
