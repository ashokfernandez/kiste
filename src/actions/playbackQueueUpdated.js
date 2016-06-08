import { PLAYBACK_QUEUE_UPDATED } from './types'
import applicationStore from '../applicationStore'

function playbackQueueUpdated (newPlaybackQueue) {
  return {
    type: PLAYBACK_QUEUE_UPDATED,
    payload: newPlaybackQueue
  }
}

export default (newPlaybackQueue) => applicationStore.dispatch(playbackQueueUpdated(newPlaybackQueue))
