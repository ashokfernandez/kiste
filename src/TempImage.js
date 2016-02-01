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
    console.log('start download')
    return new Promise((resolve, reject) => {
      request
        .get(this.imageUrl)
        .on('end', (response) => {
          console.log('download done')
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
