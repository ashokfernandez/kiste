const SHORTCUT_DEFINITIONS = {
  'Command+[': {
    event: 'browser-back'
  },
  'Command+]': {
    event: 'browser-forward'
  }
  // 'Command+w': {
  //   event: 'command-w',
  //   cmdOrCtrl: true
  // }
}

// For some reason electron crashes if we use the `export default` ES6 syntax here
// so don't change this
module.exports = SHORTCUT_DEFINITIONS
