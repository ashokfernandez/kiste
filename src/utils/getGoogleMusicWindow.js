import applicationStore from '../applicationStore'

export default () => {
  return applicationStore.getState().googleMusicWindow
}
