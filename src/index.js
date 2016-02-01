const GOOGLE_MUSIC_URL = 'https://music.google.com/'
import app from 'app'  // Module to control application life.

import createMainWindow from './createMainWindow'
import createMainMenu from './menu'
import connectKeyboardShortcuts from './shortcuts/'
import TempImage from './TempImage'

import ipcMain from 'ipc'

import _ from 'lodash'
import globalShortcut from 'global-shortcut'
import notifier from 'node-notifier'

ipcMain.on('songChanged', function (event, payload) {
  var albumArt = new TempImage(payload.albumArtUrl)

  albumArt.download()
    .then((path) => {
      notifier.notify({
        title: payload.title,
        subtitle: payload.artist,
        message: payload.album,
        contentImage: path
      },
      function (err, response) {
        albumArt.done()
        if (!err) {
          console.log(response)
        }
      })
    })
})

ipcMain.on('shuffleChanged', function (event, payload) {
  console.log('shuffleChanged')
  console.log(payload)
})

ipcMain.on('repeatChanged', function (event, payload) {
  console.log('repeatChanged')
  console.log(payload)
})

ipcMain.on('playbackChanged', function (event, payload) {
  console.log('playbackChanged')
  console.log(payload)
})



// ipcMain.on('playbackTimeUpdate', function (event, payload) {
//   console.log('playbackTimeUpdate')
//   console.log(payload)
// })

// Report crashes to our server.
// require('crash-reporter').start()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null

// Quit when all windows are closed
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
  // Create the browser window.
  mainWindow = createMainWindow(true)
  mainWindow.loadUrl(GOOGLE_MUSIC_URL)

  globalShortcut.register('MediaNextTrack', () => {
    mainWindow.webContents.send('nextTrack')
  })

  globalShortcut.register('MediaPreviousTrack', () => {
    mainWindow.webContents.send('previousTrack')
  })

  globalShortcut.register('MediaStop', () => {
    mainWindow.webContents.send('togglePlay')
  })

  globalShortcut.register('MediaPlayPause', () => {
    mainWindow.webContents.send('togglePlay')
  })

  // Register the keyboard shortcuts
  connectKeyboardShortcuts(app, mainWindow)
  createMainMenu(app, mainWindow)
})

// app.on('will-quit', function () {
  // console.log('will quit')
  // if (mainWindow) {
    // mainWindow = null
    // app.quit()
  // }
// })

// app.on('activate', function () {
  // console.log('activate')
// })

// app.on('quit', function () {
  // console.log('quit')
// })
