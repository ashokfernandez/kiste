import { REPEAT_MODE_UPDATED } from './types'
import applicationStore from '../applicationStore'

function repeatModeUpdated (newRepeatMode) {
  return {
    type: REPEAT_MODE_UPDATED,
    payload: newRepeatMode
  }
}

export default (newRepeatMode) => applicationStore.dispatch(repeatModeUpdated(newRepeatMode))
