import { CLICK_PLAY_PAUSE, CLICK_PREVIOUS_SONG, CLICK_NEXT_SONG } from './types'
import { bindActionCreators } from 'redux'
import applicationStore from '../applicationStore'

function clickPlayPause () {
  return { type: CLICK_PLAY_PAUSE }
}

function clickPreviousSong () {
  return { type: CLICK_PREVIOUS_SONG }
}

function clickNextSong () {
  return { type: CLICK_NEXT_SONG }
}

export default bindActionCreators({
  clickPlayPause,
  clickPreviousSong,
  clickNextSong
}, applicationStore.dispatch)
