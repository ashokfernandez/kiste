import { GOOGLE_MUSIC_WINDOW_CREATED, CLICK_PLAY_PAUSE, CLICK_PREVIOUS_SONG, CLICK_NEXT_SONG } from '../actions/types'

const INITIAL_STATE = null

function googleMusicWindow (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GOOGLE_MUSIC_WINDOW_CREATED:
      return action.payload

    case CLICK_PLAY_PAUSE:
      if (state !== null) state.webContents.send('togglePlay')
      return state

    case CLICK_NEXT_SONG:
      if (state !== null) state.webContents.send('nextTrack')
      return state

    case CLICK_PREVIOUS_SONG:
      if (state !== null) state.webContents.send('previousTrack')
      return state

    default:
      return state
  }
}

export default googleMusicWindow
