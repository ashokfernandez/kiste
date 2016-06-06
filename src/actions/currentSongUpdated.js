import { CURRENT_SONG_UPDATED } from './types'
import applicationStore from '../applicationStore'

function currentSongUpdated (newSong) {
  return {
    type: CURRENT_SONG_UPDATED,
    payload: newSong
  }
}

export default (newSong) => applicationStore.dispatch(currentSongUpdated(newSong))
