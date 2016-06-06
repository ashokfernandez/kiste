// import { app, BrowserWindow } from 'electron'
import menubar from 'menubar'
import miniPlayerWindowCreated from '../actions/miniPlayerWindowCreated'
import Promise from 'bluebird'

var WINDOW_INSTANCE

function createMiniPlayerWindow (showDevTools) {
  var googleMusicWindow = new BrowserWindow({
    width: 1400,
    height: 950,
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
    console.log('dom-ready')
  })

  if (showDevTools) {
    googleMusicWindow.webContents.openDevTools()
  }

  return googleMusicWindow
}

function miniPlayerWindowFactory (showDevTools) {
  if (!WINDOW_INSTANCE) {
    WINDOW_INSTANCE = createMiniPlayerWindow(showDevTools)
  }

  return WINDOW_INSTANCE
}

export default miniPlayerWindowFactory
