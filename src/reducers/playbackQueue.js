import { PLAYBACK_QUEUE_UPDATED } from '../actions/types'
const INITIAL_STATE = []

function playbackQueue (state = INITIAL_STATE, action) {
  switch (action.type) {
    case PLAYBACK_QUEUE_UPDATED:
      return action.payload
    default:
      return state
  }
}

export default playbackQueue
