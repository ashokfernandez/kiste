import { MINIPLAYER_WINDOW_CREATED } from '../actions/types'

const INITIAL_STATE = null

function miniPlayerWindow (state = INITIAL_STATE, action) {
  switch (action.type) {
    case MINIPLAYER_WINDOW_CREATED:
      return action.payload

    default:
      return state
  }
}

export default miniPlayerWindow
