import { PLAY_QUEUE_UPDATED } from './types'
import applicationStore from '../applicationStore'

function playbackQueueUpdated (newPlaybackQueue) {
  return {
    type: PLAY_QUEUE_UPDATED,
    payload: newPlaybackQueue
  }
}

export default (newPlaybackQueue) => applicationStore.dispatch(playbackQueueUpdated(newPlaybackQueue))
