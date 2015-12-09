'use strict';

var GOOGLE_MUSIC_URL = 'https://music.google.com/';
var app = require('app'); // Module to control application life.

var createMainWindow = require('./createMainWindow');
var createMainMenu = require('./menu');
var connectKeyboardShortcuts = require('./shortcuts/');

// Report crashes to our server.
// require('crash-reporter').start()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
  // Create the browser window.
  mainWindow = createMainWindow(true);
  mainWindow.loadUrl(GOOGLE_MUSIC_URL);

  // Register the keyboard shortcuts
  connectKeyboardShortcuts(app, mainWindow);
  createMainMenu(app, mainWindow);
});

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
