import { SHUFFLE_MODE_UPDATED } from './types'
import applicationStore from '../applicationStore'

function shuffleModeUpdated (newShuffleMode) {
  return {
    type: SHUFFLE_MODE_UPDATED,
    payload: newShuffleMode
  }
}

export default (newShuffleMode) => applicationStore.dispatch(shuffleModeUpdated(newShuffleMode))
