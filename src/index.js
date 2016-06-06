const GOOGLE_MUSIC_URL = 'https://music.google.com/'
import { app } from 'electron' // Module to control application life.
import initIpcEventHandlers from './interfaces/initIpcEventHandlers'
import initGlobalShortcuts from './shortcuts/initGlobalShortcuts'
import createGoogleMusicWindow from './windowFactories/createGoogleMusicWindow'
import getGoogleMusicWindow from './utils/getGoogleMusicWindow'
import createMainMenu from './menu'

// BACK AND FORWARD BROWSER SHORTCUTS ARE BROKEN
// import connectKeyboardShortcuts from './shortcuts'
// import * as desktopNotifications from './desktopNotifications'

const SHOW_DEVELOPER_TOOLS_ON_LAUNCH = true

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
  createGoogleMusicWindow(SHOW_DEVELOPER_TOOLS_ON_LAUNCH)
    .then(() => {
      getGoogleMusicWindow().loadURL(GOOGLE_MUSIC_URL)
      createMainMenu(app, getGoogleMusicWindow())
    })

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
