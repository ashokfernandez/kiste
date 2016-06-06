import { CURRENT_SONG_UPDATED } from './types'
import dispatchNotification from '../notifications/'
import applicationStore from '../applicationStore'

function currentSongUpdated (newSong) {
  dispatchNotification(newSong)

  return {
    type: CURRENT_SONG_UPDATED,
    payload: newSong
  }
}

export default (newSong) => applicationStore.dispatch(currentSongUpdated(newSong))
