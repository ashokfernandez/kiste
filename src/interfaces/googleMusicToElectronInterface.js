/*global MutationObserver*/

/*
 * GoogleMusicAPI
 *
 * Controls the functions of the Google Music player
 */

const { remote, ipcRenderer } = require('electron')
const _ = remote.require('lodash')

const STOPPED = 'STOPPED'
const PAUSED = 'PAUSED'
const PLAYING = 'PLAYING'

// Repeat modes.
const LIST_REPEAT = 'LIST_REPEAT'
const SINGLE_REPEAT = 'SINGLE_REPEAT'
const NO_REPEAT = 'NO_REPEAT'

// Shuffle modes.
const ALL_SHUFFLE = 'ALL_SHUFFLE'
const NO_SHUFFLE = 'NO_SHUFFLE'

class GoogleMusicAPI {
  constructor () {
    this.element = {
      getVolumeSlider: () => { return document.querySelector('#material-vslider') },
      getPlayPause: () => { return document.querySelector('[data-id="play-pause"]') },
      getForward: () => { return document.querySelector('[data-id="forward"]') },
      getRewind: () => { return document.querySelector('[data-id="rewind"]') },
      getShuffle: () => { return document.querySelector('[data-id="shuffle"]') },
      getRepeat: () => { return document.querySelector('[data-id="repeat"]') },
      getPlayback: () => { return document.querySelector('#player #material-player-progress') }
    }

    // Change volume step from 5 to 1 so we can easily change the value
    // console.log(this.element.getVolumeSlider())
    // this.element.getVolumeSlider().step = 1
  }

  _selector (selectorTargetString) {
    return document.querySelector(selectorTargetString)
  }

  // ------------------------------------------------------------ VOLUME CONTROL

  getVolume () {
    return parseInt(this.element.getVolumeSlider().value, 10)
  }

  // Sets the volume to a level between 0 - 100
  setVolume (newVolume) {
    var currentVolume = this.getVolume()

    if (newVolume > currentVolume) {
      this._increaseVolume(newVolume - currentVolume)
    } else if (newVolume < currentVolume) {
      this._decreaseVolume(currentVolume - newVolume)
    }
  }

  _increaseVolume (amount) {
    amount = amount || 1

    for (var i = 0; i < amount; i++) {
      this.element.getVolumeSlider().increment()
    }
  }

  _decreaseVolume (amount) {
    amount = amount || 1

    for (var i = 0; i < amount; i++) {
      this.element.getVolumeSlider().decrement()
    }
  }

  // ------------------------------------------------------------ VOLUME CONTROL
  getPlaybackTime () {
    return parseInt(this.element.getPlayback().value, 10)
  }

  setPlaybackTime (milliseconds) {
    this.element.getPlayback().value = milliseconds
    this.element.getPlayback().fire('change')
  }

  // Playback functions.
  playPause () {
    this.element.getPlayPause().click()
  }

  forward () {
    this.element.getForward().click()
  }

  rewind () {
    this.element.getRewind().click()
  }

  getShuffle () {
    return this.element.getShuffle().getAttribute('value')
  }

  toggleShuffle () {
    this.element.getShuffle().click()
  }

  getRepeat () {
    return this.element.repeat.value
  }

  changeRepeat (mode) {
    if (!mode) {
      // Toggle between repeat modes once.
      this.element.repeat.click()
    } else {
      // Toggle between repeat modes until the desired mode is activated.
      while (this.getRepeat() !== mode) {
        this.repeat.click()
      }
    }
  }

  toggleVisualization () {
    var visualisationIcon = document.querySelector('#hover-icon')

    if (visualisationIcon) {
      visualisationIcon.click()
    }
  }
}

//     /* Create a rating API. */
//     MusicAPI.Rating = (function() {
//         var R = {};

//         // Determine whether the rating element is selected.
//         R.isRatingSelected = function(el) {
//             return el.icon.indexOf('-outline') == -1;
//         };

//         // Determine whether the rating system is thumbs or stars.
//         R.isStarsRatingSystem = function() {
//             return document.querySelector('.rating-container.stars') !== null;
//         };

//         // Get current rating.
//         R.getRating = function() {
//             var els = document.querySelectorAll('.player-rating-container [data-rating]');

//             for (var i = 0; i < els.length; i++) {
//                 var el = els[i];

//                 if (R.isRatingSelected(el))
//                     return parseInt(el.dataset.rating);
//             }

//             return 0;
//         };

//         // Thumbs up.
//         R.toggleThumbsUp = function() {
//             var el = document.querySelector('.player-rating-container [data-rating="5"]');

//             if (el)
//                 el.click();
//         };

//         // Thumbs down.
//         R.toggleThumbsDown = function() {
//             var el = document.querySelector('.player-rating-container [data-rating="1"]');

//             if (el)
//                 el.click();
//         };

//         // Set a star rating.
//         R.setStarRating = function(rating) {
//             var el = document.querySelector('.player-rating-container [data-rating="' + rating + '"]');

//             if (el && !R.isRatingSelected(el))
//                 el.click();
//         }

//         return R;
//     })();

//     /* Miscellaneous functions. */
//     MusicAPI.Extras = {

//         // Get a shareable URL of the song on Google Play Music.
//         getSongURL: function() {
//             var albumEl = document.querySelector('#player .player-album');
//             var artistEl = document.querySelector('#player .player-artist');

//             var urlTemplate = 'https://play.google.com/music/m/';
//             var url = null;

//             var parseID = function(id) {
//                 return id.substring(0, id.indexOf('/'));
//             };

//             if (albumEl === null && aristEl === null)
//                 return null;

//             var albumId = parseID(albumEl.dataset.id);
//             var artistId = parseID(artistEl.dataset.id);

//             if (albumId) {
//                 url = urlTemplate + albumId;
//             } else if (artistId) {
//                 url = urlTemplate + artistId;
//             }

//             return url;
//         }
//     };

/*
 * This binds to various elements on the page and fires events to the main process when parameters
 * change in the app. The events fired to the app are as follows
 *
 * @events songChanged
 * @params title, artist, album, albumArtUrl, duration
 *
 * @events shuffleChanged
 * @params shuffleMode
 *
 * @events repeatChanged
 * @params repeatMode
 *
 * @event  playbackChanged
 * @params playbackMode
 *
 * @event  playbackTimeUpdate
 * @params currentTime, totalTime
 */
class Application {
  constructor () {
    this.song = {
      song: '',
      artist: '',
      album: '',
      albumArtUrl: '',
      duration: 0
    }

    this.shuffle = NO_SHUFFLE
    this.repeat = NO_REPEAT
    this.playbackMode = STOPPED
    this.playBackTime = {
      currentTime: null,
      totalTime: null
    }
    this.playbackQueue = []
  }

  notify (channel, payload) {
    ipcRenderer.send(channel, payload)
  }

  _handleStateUpdate (parameterName, newValue, channel) {
    if (!_.isEqual(this[parameterName], newValue)) {
      this[parameterName] = newValue
      this.notify(channel, newValue)
    }
  }

  // Added custom checker for song change as _.isEquals was giving inconsistent results
  songChanged (newSong) {
    if (newSong.song !== this.song.song || newSong.artist !== this.song.artist ||
        newSong.album !== this.song.album) {
      this.song = newSong
      this.notify('SONG_UPDATED', newSong)
    }
  }

  shuffleChanged (newShuffle) {
    this._handleStateUpdate('shuffle', newShuffle, 'SHUFFLE_MODE_UPDATED')
  }

  repeatChanged (newRepeat) {
    this._handleStateUpdate('repeat', newRepeat, 'REPEAT_MODE_UPDATED')
  }

  playbackChanged (newPlaybackMode) {
    this._handleStateUpdate('playbackMode', newPlaybackMode, 'PLAYBACK_STATE_CHANGED')
  }

  playbackTimeUpdate (newPlaybackTime) {
    this._handleStateUpdate('playbackMode', newPlaybackTime, 'PLAYBACK_TIME_UPDATED')
  }

  // Do the change checking here instead of in _handleStateUpdate since newPLaybackQueue
  // is an array of objects which is a little harder to compare
  // JSON string check from here
  // http://stackoverflow.com/questions/13142968/deep-comparison-of-objects-arrays
  playbackQueueChanged (newPlaybackQueue) {
    if (JSON.stringify(this.playbackQueue) !== JSON.stringify(newPlaybackQueue)) {
      this.playbackQueue = newPlaybackQueue
      this.notify('PLAYBACK_QUEUE_UPDATED', newPlaybackQueue)
    }
  }
}

/*
 * Wraps MutationObserver to construct a mutation observer for DOM changes
 */
class EventObserver {
  constructor (mutationObserverCallback, selectorString, options) {
    let mutationObserver = new MutationObserver(mutationObserverCallback)
    let selector = document.querySelector(selectorString)

    mutationObserver.observe(selector, options)
    return mutationObserver
  }
}

/*
 * Loads all of the relavant EventObservers and updates the application state when any of them change
 */
class PageObserver {
  constructor () {
    this.song = {
      song: '',
      artist: '',
      album: '',
      albumArtUrl: '',
      duration: 0
    }

    this.shuffle = null
    this.repeat = null
    this.playbackMode = null

    this.changeSongObserver = new EventObserver(this._changeSongObserverCallback,
      '#player #playerSongInfo', {
        childList: true,
        subtree: true
      })

    this.shuffleObserver = new EventObserver(this._shuffleObserverCallback,
      '#player [data-id="shuffle"]', {
        attributes: true
      })

    this.repeatObserver = new EventObserver(this._repeatObserverCallback,
      '#player [data-id="repeat"]', {
        attributes: true
      })

    this.playbackObserver = new EventObserver(this._playbackObserverCallback,
      '#player [data-id="play-pause"]', {
        attributes: true
      })

    this.playbackTimeObserver = new EventObserver(this._playbackTimeObserverCallback,
      '#player #material-player-progress', {
        attributes: true
      })

    // The playback queue isn't on the DOM until it's been opened so we have to open and close it
    // before we can register the mutation observer
    document.querySelector('#queue').click()
    setTimeout(() => {
      document.querySelector('#queue').click()
      this.playbackQueueObserver = new EventObserver(this._playbackQueueObserverCallback,
      '#queueContainer [data-id="queue"]', {
        childList: true,
        subtree: true
      })
    }, 50)
  }

  // ------------------------------------------------------------ MUTATION OBSERVER CALLBACKS
  _changeSongObserverCallback (mutations) {
    mutations.forEach((mutation) => {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        var target = mutation.addedNodes[i]
        var name = target.id || target.className

        if (name === 'now-playing-info-wrapper') {
          var song = document.querySelector('#player #currently-playing-title')
          var artist = document.querySelector('#player #player-artist')
          var album = document.querySelector('#player .player-album')
          var albumArtUrl = document.querySelector('#player #playerBarArt')
          var duration = parseInt(document.querySelector('#player #material-player-progress').max, 10) / 1000

          song = (song) ? song.innerText : 'Unknown'
          artist = (artist) ? artist.innerText : 'Unknown'
          album = (album) ? album.innerText : 'Unknown'
          albumArtUrl = (albumArtUrl) ? albumArtUrl.src : null

          // The albumArtUrl may be a protocol-relative URL, so normalize it to HTTPS.
          if (albumArtUrl && albumArtUrl.slice(0, 2) === '//') {
            albumArtUrl = 'https:' + albumArtUrl
          }

          // Make sure that this is the first of the notifications for the
          // insertion of the song information elements.
          window.application.songChanged({song, artist, album, albumArtUrl, duration})

          // Fire the rating observer if the thumbs exist (no harm if already observing)
          // Ensure this is below notifySong, otherwise it'll apply the loved status of the current song to the previous song (#390)
          // GoogleMusicApp.ratingChanged(MusicAPI.Rating.getRating());
        }
      }
    })
  }

  _shuffleObserverCallback (mutations) {
    mutations.forEach((mutation) => {
      var target = mutation.target
      var id = target.dataset.id

      if (id === 'shuffle') {
        var shuffleMode = target.classList.contains('active') ? ALL_SHUFFLE : NO_SHUFFLE
        window.application.shuffleChanged(shuffleMode)
      }
    })
  }

  _repeatObserverCallback (mutations) {
    mutations.forEach((mutation) => {
      var target = mutation.target
      var id = target.dataset.id

      if (id === 'repeat') {
        var title = target.getAttribute('title').toLowerCase()
        var repeatMode = null

        if (title.includes('off')) repeatMode = NO_REPEAT
        else if (title.includes('all')) repeatMode = LIST_REPEAT
        else if (title.includes('current')) repeatMode = SINGLE_REPEAT

        window.application.repeatChanged(repeatMode)
      }
    })
  }

  _playbackObserverCallback (mutations) {
    mutations.forEach((mutation) => {
      var target = mutation.target
      var id = target.dataset.id

      if (id === 'play-pause') {
        var mode
        var playing = target.classList.contains('playing')

        if (playing) {
          mode = PLAYING
        } else {
          // If there is a current song, then the player is paused.
          if (document.querySelector('#playerSongInfo').childNodes.length) {
            mode = PAUSED
          } else {
            mode = STOPPED
          }
        }

        window.application.playbackChanged(mode)
      }
    })
  }

  _playbackTimeObserverCallback (mutations) {
    mutations.forEach((mutation) => {
      var target = mutation.target
      var id = target.id

      if (id === 'material-player-progress') {
        var currentTime = parseInt(target.value, 10)
        var totalTime = parseInt(target.max, 10)
        window.application.playbackTimeUpdate({currentTime, totalTime})
      }
    })
  }

  _playbackQueueObserverCallback (mutations) {
    mutations.forEach((mutation) => {
      var target = mutation.target

      // If the table changed, grab the whole thing and parse it to JSON
      if (target.nodeName === 'TBODY') {
        var playingFrom = document.querySelector('#mini-queue-details [data-id="playing-from-text"]').innerText
        var playingFromArtworkUrl = document.querySelector('#mini-queue-details .images img').src

        var songRows = Array.from(target.childNodes)
        var songs = []

        songRows.forEach((songRow) => {
          if (songRow.classList.contains('song-row')) {
            let song = {
              'song': songRow.querySelector('.song-title').innerText,
              'duration': songRow.querySelector('[data-col="duration"').innerText,
              'artist': songRow.querySelector('[data-col="artist"').innerText,
              'album': songRow.querySelector('[data-col="album"').innerText,
              'playCount': songRow.querySelector('[data-col="play-count"').innerText,
              'albumArtUrl': songRow.querySelector('img').src,
              'currentlyPlaying': songRow.classList.contains('currently-playing')
            }

            songs.push(song)
          }
        })

        window.application.playbackQueueChanged({
          playingFrom: {
            name: playingFrom,
            artworkUrl: playingFromArtworkUrl
          },
          songs: songs
        })
      }
    })
  }
}

class EventReceiver {
  constructor () {
    this._registerHandler('previousTrack', window.GoogleMusic, 'rewind')
    this._registerHandler('togglePlay', window.GoogleMusic, 'playPause')
    this._registerHandler('nextTrack', window.GoogleMusic, 'forward')
  }

  // Calls method on object when channel receives an event. Passes the event object to the method
  // as a parameter
  _registerHandler (channel, object, method) {
    ipcRenderer.on(channel, (event) => {
      object[method](event)
    })
  }
}

window.onload = function () {
  window.application = new Application()
  window.GoogleMusic = new GoogleMusicAPI()
  window.EventReceiverHandler = new EventReceiver()
  window.EventNotificationBus = new PageObserver(window.application)
}
