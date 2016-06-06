import { CURRENT_SONG_UPDATED } from '../actions/types'
const INITIAL_STATE = null

function currentSong (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CURRENT_SONG_UPDATED:
      return action.payload
    default:
      return state
  }
}

export default currentSong
