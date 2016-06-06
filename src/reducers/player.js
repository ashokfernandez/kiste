import { SHUFFLE_MODE_UPDATED, REPEAT_MODE_UPDATED, PLAYBACK_STATE_UPDATED, PLAYBACK_TIME_UPDATED } from '../actions/types'

const STOPPED = 'STOPPED'
// const PAUSED = 'PAUSED'
// const PLAYING = 'PLAYING'

const NO_REPEAT = 'NO_REPEAT'
// const LIST_REPEAT = 'LIST_REPEAT'
// const SINGLE_REPEAT = 'SINGLE_REPEAT'

const NO_SHUFFLE = 'NO_SHUFFLE'
// const ALL_SHUFFLE = 'ALL_SHUFFLE'

const INITIAL_STATE = {
  playback: {
    state: STOPPED,
    currentTime: 0,
    totalTime: 0
  },
  shuffle: NO_REPEAT,
  repeat: NO_SHUFFLE
}

function playbackOptions (state = INITIAL_STATE, action) {
  switch (action.type) {
    case PLAYBACK_STATE_UPDATED:
      return Object.assign({}, state, {
        playback: {
          state: action.payload,
          currentTime: state.playback.currentTime,
          totalTime: state.playback.totalTime
        }
      })

    case PLAYBACK_TIME_UPDATED:
      return Object.assign({}, state, {
        playback: {
          state: state.playback.state,
          currentTime: action.payload.currentTime,
          totalTime: action.payload.totalTime
        }
      })

    case SHUFFLE_MODE_UPDATED:
      console.log('shuffle changed to ', action.payload)
      return Object.assign({}, state, { shuffle: action.payload })

    case REPEAT_MODE_UPDATED:
      return Object.assign({}, state, { repeat: action.payload })

    default:
      return state
  }
}

export default playbackOptions
