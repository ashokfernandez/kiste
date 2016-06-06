import TempImage from './TempImage'
import getIconPath from './getIconPath'
import notifier from 'node-notifier'
import getGoogleMusicWindow from '../utils/getGoogleMusicWindow'

function dispatchNotification (newSongDetails) {
  if (!getGoogleMusicWindow().isFocused()) {
    var albumArt = new TempImage(newSongDetails.albumArtUrl)
    var applicationIconPath = getIconPath()

    albumArt.download()
      .then((path) => {
        notifier.notify({
          title: newSongDetails.song,
          subtitle: newSongDetails.artist,
          message: newSongDetails.album,
          contentImage: path,
          icon: applicationIconPath
        }, (err, response) => {
          albumArt.done()
          if (!err) console.log(response)
        })
      })
  }
}

export default dispatchNotification
