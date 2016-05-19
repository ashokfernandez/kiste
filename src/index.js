const GOOGLE_MUSIC_URL = 'https://music.google.com/'
import { app, ipcMain, globalShortcut } from 'electron'  // Module to control application life.

import createMainWindow from './createMainWindow'
import createMainMenu from './menu'

// BACK AND FORWARD BROWSER SHORTCUTS ARE BROKEN
// import connectKeyboardShortcuts from './shortcuts'
import * as desktopNotifications from './desktopNotifications'

// import _ from 'lodash'

const SHOW_DEVELOPER_TOOLS_ON_LAUNCH = true
// Report crashes to our server.
// require('crash-reporter').start()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null

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
  mainWindow = createMainWindow(SHOW_DEVELOPER_TOOLS_ON_LAUNCH)
  mainWindow.loadURL(GOOGLE_MUSIC_URL)

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

  // // Register the keyboard shortcuts
  // connectKeyboardShortcuts(app, mainWindow) // electron-shortchut-loader is out of date
  createMainMenu(app, mainWindow)
})

app.on('will-quit', function () {
  // console.log('will quit')
  if (mainWindow) {
    mainWindow = null
    app.quit()
  }
})

app.on('activate', function () {
  // console.log('activate')
})

app.on('quit', function () {
  // console.log('quit')
})

// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// Events fired from web context
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------

ipcMain.on('songChanged', function (event, newSongDetails) {
  if (!mainWindow.isFocused()) {
    desktopNotifications.songChanged(newSongDetails)
  }
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

ipcMain.on('playbackTimeUpdate', function (event, payload) {
  console.log('playbackTimeUpdate')
  console.log(payload)
})
