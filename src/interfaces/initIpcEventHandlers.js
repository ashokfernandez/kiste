import { currentSongUpdated,
  shuffleModeUpdated,
  repeatModeUpdated,
  playbackStateUpdated,
  playbackTimeUpdated,
  playbackQueueUpdated } from '../actions'
import { ipcMain } from 'electron' // Module to control application life.

function initIpcEventHandlers () {
  ipcMain.on('SONG_UPDATED', (event, newSong) => currentSongUpdated(newSong))
  ipcMain.on('SHUFFLE_MODE_UPDATED', (event, newShuffleMode) => shuffleModeUpdated(newShuffleMode))
  ipcMain.on('REPEAT_MODE_UPDATED', (event, newRepeatMode) => repeatModeUpdated(newRepeatMode))
  ipcMain.on('PLAYBACK_STATE_CHANGED', (event, newPlaybackState) => playbackStateUpdated(newPlaybackState))
  // ipcMain.on('PLAYBACK_TIME_UPDATED', (event, newPlaybackTime) => playbackTimeUpdated(newPlaybackTime))
  ipcMain.on('PLAYBACK_QUEUE_UPDATED', (event, newPlaybackQueue) => playbackQueueUpdated(newPlaybackQueue))
}

export default initIpcEventHandlers
