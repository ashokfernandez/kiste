import TempImage from './TempImage'
import getIconPath from './getIconPath'
import notifier from 'node-notifier'

function songChanged (newSongDetails) {
  var albumArt = new TempImage(newSongDetails.albumArtUrl)
  var applicationIconPath = getIconPath()

  albumArt.download()
    .then((path) => {
      notifier.notify({
        title: newSongDetails.title,
        subtitle: newSongDetails.artist,
        message: newSongDetails.album,
        contentImage: path,
        icon: applicationIconPath
      },
      function (err, response) {
        albumArt.done()
        if (!err) {
          console.log(response)
        }
      })
    })
}

export { songChanged }
