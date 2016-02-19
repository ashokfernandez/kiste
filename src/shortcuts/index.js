import shortcutDefinitions from 'electron-shortcut-loader'
import handleShortcut from './shortcutHandlers'
import path from 'path'

// Load shortcuts from file
const SHORTCUT_DEFINITIONS = path.resolve(path.join(__dirname, 'shortcutDefinitions'))
// shortcutDefinitions(SHORTCUT_DEFINITIONS)

function register (app, browserWindow) {
  shortcutDefinitions.load(SHORTCUT_DEFINITIONS, {
    autoRegister: true,
    cmdOrCtrl: true
  }, app)

  app.on('shortcut-press', function (shortCutEvent) {
    handleShortcut(shortCutEvent, app, browserWindow)
  })

  app.on('will-quit', function () {
    shortcutDefinitions.unregister()
  })
}

export default register
