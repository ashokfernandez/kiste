import os from 'os'
import path from 'path'

function getIconPath () {
  var pathToIcon

  // If OSX
  if (os.platform() === 'darwin') {
    pathToIcon = path.join('lib', 'assets', 'appicon.png')
    pathToIcon = path.resolve(pathToIcon)
  } else {
    throw new Error('Icon path not specified for this platform')
  }

  return pathToIcon
}

export default getIconPath
