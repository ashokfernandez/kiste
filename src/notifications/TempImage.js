import Promise from 'bluebird'
import temp from 'temp'
import request from 'request'

// Track temp files
temp.track()

class TempImage {
  constructor (imageUrl) {
    this.imageUrl = imageUrl
    this.tmpImageStream = temp.createWriteStream()
  }

  download () {
    return new Promise((resolve, reject) => {
      request
        .get(this.imageUrl)
        .on('end', (response) => {
          this.tmpImageStream.end()
          resolve(this.tmpImageStream.path)
        })
        .pipe(this.tmpImageStream)
    })
  }

  done () {
    temp.cleanup()
  }
}

export default TempImage
