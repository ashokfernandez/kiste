import { PLAYBACK_TIME_UPDATED } from './types'
import applicationStore from '../applicationStore'

function playbackTimeUpdated (newPlaybackTime) {
  return {
    type: PLAYBACK_TIME_UPDATED,
    payload: newPlaybackTime
  }
}

export default (newPlaybackTime) => applicationStore.dispatch(playbackTimeUpdated(newPlaybackTime))
