import { GOOGLE_MUSIC_WINDOW_CREATED } from './types'
import applicationStore from '../applicationStore'

function googleMusicWindowCreated (googleMusicWindow) {
  return {
    type: GOOGLE_MUSIC_WINDOW_CREATED,
    payload: googleMusicWindow
  }
}

export default (googleMusicWindow) => applicationStore.dispatch(googleMusicWindowCreated(googleMusicWindow))
