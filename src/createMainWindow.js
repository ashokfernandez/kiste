import app from 'app'
import BrowserWindow from 'browser-window'
import client from './client'

var WINDOW_INSTANCE

function createMainWindow (showDevTools) {
  var mainWindow = new BrowserWindow({
    width: 1400,
    height: 950,
    'title-bar-style': 'hidden-inset',
    'web-preferences': {
      webgl: true,
      webaudio: true
    }
  })

  // Emitted when the x is pressed on the main window
  mainWindow.on('close', function (event) {
    event.preventDefault()
    mainWindow.hide()
    event.returnValue = true
  })

  // Handles case when x icon has been clicked on the main window and then
  // the icon on the dock is clicked
  app.on('activate', function () {
    if (!mainWindow.isVisible()) {
      mainWindow.show()
    }
  })

  // Drop the reference to the main window and quit the app
  // the destroy method of mainWindow skips the close event
  app.on('before-quit', function (event) {
    if (mainWindow) {
      event.preventDefault()
      mainWindow.destroy()
      mainWindow = null
      app.quit()
    }
  })

  // Inject in our js API for the controls
  mainWindow.webContents.on('dom-ready', () => {
    client('appInterface.js')
      .then((appInterface) => {
        mainWindow.webContents.executeJavaScript(appInterface)
      })

    client('styling/main.css')
      .then((customStyles) => {
        mainWindow.webContents.insertCSS(customStyles)
      })
  })

  if (showDevTools) {
    mainWindow.webContents.openDevTools()
  }

  return mainWindow
}

function mainWindowFactory (showDevTools) {
  if (!WINDOW_INSTANCE) {
    WINDOW_INSTANCE = createMainWindow(showDevTools)
  }

  return WINDOW_INSTANCE
}

export default mainWindowFactory
