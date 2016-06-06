import { globalShortcut } from 'electron'
import playbackControls from '../actions/playbackControls'

function initGlobalShortcuts () {
  globalShortcut.register('MediaNextTrack', playbackControls.clickNextSong)
  globalShortcut.register('MediaPreviousTrack', playbackControls.clickPreviousSong)
  globalShortcut.register('MediaStop', playbackControls.clickPlayPause)
  globalShortcut.register('MediaPlayPause', playbackControls.clickPlayPause)
}

export default initGlobalShortcuts
