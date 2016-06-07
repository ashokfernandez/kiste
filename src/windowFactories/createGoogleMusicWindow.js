import { app, BrowserWindow } from 'electron'
import loadFileAsString from '../utils/loadFileAsString'
import googleMusicWindowCreated from '../actions/googleMusicWindowCreated'
import Promise from 'bluebird'

var WINDOW_INSTANCE

function _createGoogleMusicWindow (showDevTools) {
  var googleMusicWindow = new BrowserWindow({
    width: 1400,
    height: 950
    // titleBarStyle: 'hidden'
  })

  // Emitted when the x is pressed on the main window
  googleMusicWindow.on('close', function (event) {
    event.preventDefault()
    googleMusicWindow.hide()
    event.returnValue = true
  })

  // Handles case when x icon has been clicked on the main window and then
  // the icon on the dock is clicked
  app.on('activate', function () {
    if (!googleMusicWindow.isVisible()) {
      googleMusicWindow.show()
    }
  })

  // Drop the reference to the main window and quit the app
  // the destroy method of googleMusicWindow skips the close event
  app.on('before-quit', function (event) {
    if (googleMusicWindow) {
      event.preventDefault()
      googleMusicWindow.destroy()
      googleMusicWindow = null
      app.quit()
    }
  })

  // Inject in our js API for the controls
  googleMusicWindow.webContents.on('dom-ready', () => {
    loadFileAsString('../interfaces/googleMusicToElectronInterface.js')
      .then((appInterface) => {
        googleMusicWindow.webContents.executeJavaScript(appInterface)
      })
  })

  if (showDevTools) {
    googleMusicWindow.webContents.openDevTools()
  }

  return googleMusicWindow
}

const createGoogleMusicWindow = (showDevTools) => {
  return new Promise((resolve, reject) => {
    app.on('ready', () => {
      WINDOW_INSTANCE = _createGoogleMusicWindow(showDevTools)
      resolve()
    })
  })
}

function googleMusicWindowFactory (showDevTools) {
  if (!WINDOW_INSTANCE) {
    return createGoogleMusicWindow(showDevTools)
      .then(() => {
        googleMusicWindowCreated(WINDOW_INSTANCE)
        return Promise.resolve(WINDOW_INSTANCE)
      })
  }

  return Promise.resolve(WINDOW_INSTANCE)
}

export default googleMusicWindowFactory
