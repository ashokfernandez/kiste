import Promise from 'bluebird'
import path from 'path'
import fs from 'fs'

Promise.promisifyAll(fs)

var FILE_CACHE = {}

function loadFileAsString (fileName) {
  var pathToJsFile = path.join(__dirname, fileName)
  var cachedJs = FILE_CACHE[pathToJsFile]

  if (cachedJs) {
    return Promise.resolve(cachedJs)
  } else {
    return fs.readFileAsync(pathToJsFile, 'utf8')
      .then((fileString) => {
        FILE_CACHE[pathToJsFile] = fileString
        return Promise.resolve(fileString)
      })
  }
}

export default loadFileAsString
