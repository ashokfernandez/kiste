const GOOGLE_MUSIC_URL = 'https://music.google.com/'
import { app } from 'electron' // Module to control application life.
import initIpcEventHandlers from './interfaces/initIpcEventHandlers'
import initGlobalShortcuts from './shortcuts/initGlobalShortcuts'
import { createGoogleMusicWindow, createMiniPlayerWindow } from './windowFactories'
import getGoogleMusicWindow from './utils/getGoogleMusicWindow'
import createMainMenu from './menu'
import path from 'path'
// BACK AND FORWARD BROWSER SHORTCUTS ARE BROKEN
// import connectKeyboardShortcuts from './shortcuts'
// import * as desktopNotifications from './desktopNotifications'

const SHOW_DEVELOPER_TOOLS_ON_LAUNCH = false
const PATH_TO_MINIPLAYER_CONTENTS = path.join(__dirname, 'miniplayer', 'dist/')

createMiniPlayerWindow(PATH_TO_MINIPLAYER_CONTENTS)
  // .then(() => console.log('miniplayer created'))

createGoogleMusicWindow(SHOW_DEVELOPER_TOOLS_ON_LAUNCH)
  .then(() => {
    getGoogleMusicWindow().loadURL(GOOGLE_MUSIC_URL)
    createMainMenu(app, getGoogleMusicWindow())
  })

// Quit when all windows are closed
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {
  initIpcEventHandlers()
  initGlobalShortcuts()
})

// app.on('will-quit', function () {
//   if (getGoogleMusicWindow()) {
//     app.quit()
//   }
// })

// app.on('activate', function () {
//   // console.log('activate')
// })

// app.on('quit', function () {
//   // console.log('quit')
// })
