import { PLAYBACK_STATE_UPDATED } from './types'
import applicationStore from '../applicationStore'

function playbackStateUpdated (newPlaybackState) {
  return {
    type: PLAYBACK_STATE_UPDATED,
    payload: newPlaybackState
  }
}

export default (newPlaybackState) => applicationStore.dispatch(playbackStateUpdated(newPlaybackState))
