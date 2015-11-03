var app = require('app')  // Module to control application life.
var BrowserWindow = require('browser-window')  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start()

const shortcuts = require('electron-shortcut-loader')('./src/shortcuts')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null

// Quit when all windows are closed.
// app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
    // app.quit()
  // }
// })

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
  // Register the keyboard shortcuts
  shortcuts.register()

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    'title-bar-style': 'hidden-inset',
    'web-preferences': {
      webgl: true,
      webaudio: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadUrl('https://music.google.com/')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('close', function (event) {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    event.preventDefault()
    mainWindow.hide()
    event.returnValue = true
  })

  app.on('activate', function () {
    mainWindow.show()
  })
})

app.on('will-quit', function () {
  // console.log('will quit')
  shortcuts.unregister()
  // if (mainWindow) {
    // mainWindow = null
    // app.quit()
  // }
})

app.on('before-quit', function (event) {
  // Drop the reference to the main window and quit the app
  // the destroy method of mainWindow skips the close event
  if (mainWindow) {
    event.preventDefault()
    mainWindow.destroy()
    mainWindow = null
    app.quit()
  }
})

app.on('quit', function () {
  // console.log('quit')
})

app.on('shortcut-press', function (e) {
  console.log(e.shortcut, e.event, 'key-event has been fired')
})
