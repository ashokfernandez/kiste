import { MINIPLAYER_WINDOW_CREATED } from './types'
import applicationStore from '../applicationStore'

function miniPlayerWindowCreated (miniPlayerWindow) {
  return {
    type: MINIPLAYER_WINDOW_CREATED,
    payload: miniPlayerWindow
  }
}

export default (miniPlayerWindow) => applicationStore.dispatch(miniPlayerWindowCreated(miniPlayerWindow))
