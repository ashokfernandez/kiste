const shortcutDefinitions = require('electron-shortcut-loader')('./src/shortcuts/shortcutDefinitions')
var handleShortcut = require('./shortcutHandlers')

function register (app, browserWindow) {
  shortcutDefinitions.register()

  app.on('shortcut-press', function (shortCutEvent) {
    handleShortcut(shortCutEvent, app, browserWindow)
  })

  app.on('will-quit', function () {
    shortcutDefinitions.unregister()
  })
}

module.exports = register
