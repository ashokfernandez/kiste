// import { app, BrowserWindow } from 'electron'
import menubar from 'menubar'
import miniPlayerWindowCreated from '../actions/miniPlayerWindowCreated'
import Promise from 'bluebird'

var WINDOW_INSTANCE

function createMiniPlayerWindow (pathToContents) {
  return new Promise((resolve, reject) => {
    var miniPlayer = menubar({ dir: pathToContents, 'preload-window': true })

    miniPlayer.on('ready', () => {
      WINDOW_INSTANCE = miniPlayer.window
      miniPlayerWindowCreated(WINDOW_INSTANCE)
      resolve()
    })
  })
}

function miniPlayerWindowFactory (showDevTools) {
  if (!WINDOW_INSTANCE) {
    return createMiniPlayerWindow(showDevTools)
  }

  return Promise.resolve(WINDOW_INSTANCE)
}

export default miniPlayerWindowFactory
