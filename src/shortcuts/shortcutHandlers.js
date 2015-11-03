const _ = require('lodash')

function handleShortcut (shortCutEvent, app, browserWindow) {
  var eventHandlers = eventHandlerMap[shortCutEvent.event]

  if (eventHandlers === undefined) {
    var error = 'No handlers defined for event ' + shortCutEvent.event
    error += ' trigger by the shortcut ' + shortCutEvent.shortcut
    console.error(error)
  } else {
    _.forEach(eventHandlers, function (eventHandler) {
      eventHandler(app, browserWindow)
    })
  }
}

const eventHandlerMap = {
  'browser-back': [browserBack],
  'browser-forward': [browserForward]
}

// -------------------------------------------------------------------------------------------
// SHORTCUT HANDLERS
// -------------------------------------------------------------------------------------------

function browserBack (app, browserWindow) {
  if (browserWindow.webContents.canGoBack()) {
    browserWindow.webContents.goBack()
  }
}

function browserForward (app, browserWindow) {
  if (browserWindow.webContents.canGoForward()) {
    browserWindow.webContents.goForward()
  }
}

module.exports = handleShortcut
