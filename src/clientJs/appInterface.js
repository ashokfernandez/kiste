/*global MutationObserver*/

/*
 * GoogleMusicAPI
 *
 * Controls the functions of the Google Music player
 */

var remote = require('remote')
var _ = remote.require('lodash')

const STOPPED = 0
const PAUSED = 1
const PLAYING = 2

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
      volumeSlider: this._selector('#material-vslider'),
      playPause: this._selector('#player [data-id="play-pause"]'),
      forward: this._selector('#player [data-id="forward"]'),
      rewind: this._selector('#player [data-id="rewind"]'),
      shuffle: this._selector('#player [data-id="shuffle"]'),
      repeat: this._selector('#player [data-id="repeat"]'),
      playback: this._selector('#player #material-player-progress')
    }

    // Change volume step from 5 to 1 so we can easily change the value
    this.element.volumeSlider.step = 1
  }

  _selector (selectorTargetString) {
    return document.querySelector(selectorTargetString)
  }

  // ------------------------------------------------------------ VOLUME CONTROL

  getVolume () {
    return parseInt(this.element.volumeSlider.value, 10)
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
      this.element.volumeSlider.increment()
    }
  }

  _decreaseVolume (amount) {
    amount = amount || 1

    for (var i = 0; i < amount; i++) {
      this.element.volumeSlider.decrement()
    }
  }

  // ------------------------------------------------------------ VOLUME CONTROL
  getPlaybackTime () {
    return parseInt(this.element.playback.value, 10)
  }

  setPlaybackTime (milliseconds) {
    this.element.playback.value = milliseconds
    this.element.playback.fire('change')
  }

  // Playback functions.
  playPause () {
    this.element.playPause.click()
  }

  forward () {
    this.element.forward.click()
  }

  rewind () {
    this.element.rewind.click()
  }

  getShuffle () {
    return this.element.shuffle.getAttribute('value')
  }

  toggleShuffle () {
    this.element.shuffle.click()
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

if (!window.GoogleMusic) {
  window.GoogleMusic = new GoogleMusicAPI()
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
class ApplicationState {
  constructor () {
    this.ipcRenderer = require('ipc')

    this.song = {
      title: '',
      artist: '',
      album: '',
      albumArtUrl: '',
      duration: 0
    }

    this.shuffle = null
    this.repeat = null
    this.playbackMode = null
    this.playBackTime = {
      currentTime: null,
      totalTime: null
    }
  }

  notify (channel, payload) {
    this.ipcRenderer.send(channel, payload)
  }

  _handleStateUpdate (parameterName, newValue, channel) {
    if (!_.isEqual(this[parameterName], newValue)) {
      console.log('updating ' + parameterName)

      console.log(this[parameterName])
      console.log(newValue)

      this[parameterName] = newValue
      this.notify(channel, newValue)
    } else {
      console.log(parameterName + 'update blocked')
    }
  }

  // Added custom checker for song change as _.isEquals was giving inconsistent results
  songChanged (newSong) {
    if (newSong.title !== this.song.title || newSong.artist !== this.song.artist ||
        newSong.album !== this.song.album) {
      this.song = newSong
      this.notify('songChanged', newSong)
    }
  }

  shuffleChanged (newShuffle) {
    this._handleStateUpdate('shuffle', newShuffle, 'shuffleChanged')
  }

  repeatChanged (newRepeat) {
    this._handleStateUpdate('repeat', newRepeat, 'repeatChanged')
  }

  playbackChanged (newPlaybackMode) {
    this._handleStateUpdate('playbackMode', newPlaybackMode, 'playbackChanged')
  }

  playbackTimeUpdate (newPlaybackTime) {
    // this._handleStateUpdate('playbackMode', newPlaybackTime, 'playbackTimeUpdate')
  }
}

const applicationState = new ApplicationState()

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
class EventNotification {
  constructor () {
    this.song = {
      title: '',
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
  }

  // ------------------------------------------------------------ MUTATION OBSERVER CALLBACKS
  _changeSongObserverCallback (mutations) {
    mutations.forEach((mutation) => {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        var target = mutation.addedNodes[i]
        var name = target.id || target.className

        if (name === 'now-playing-info-wrapper') {
          var title = document.querySelector('#player #player-song-title')
          var artist = document.querySelector('#player #player-artist')
          var album = document.querySelector('#player .player-album')
          var albumArtUrl = document.querySelector('#player #playingAlbumArt')
          var duration = parseInt(document.querySelector('#player #material-player-progress').max, 10) / 1000

          title = (title) ? title.innerText : 'Unknown'
          artist = (artist) ? artist.innerText : 'Unknown'
          album = (album) ? album.innerText : 'Unknown'
          albumArtUrl = (albumArtUrl) ? albumArtUrl.src : null

          // The albumArtUrl may be a protocol-relative URL, so normalize it to HTTPS.
          if (albumArtUrl && albumArtUrl.slice(0, 2) === '//') {
            albumArtUrl = 'https:' + albumArtUrl
          }

          // Make sure that this is the first of the notifications for the
          // insertion of the song information elements.
          applicationState.songChanged({title, artist, album, albumArtUrl, duration})

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
      var value = target.getAttribute('value')

      if (id === 'shuffle') {
        applicationState.shuffleChanged(value)
      }
    })
  }

  _repeatObserverCallback (mutations) {
    mutations.forEach((mutation) => {
      var target = mutation.target
      var id = target.dataset.id
      var value = target.getAttribute('value')

      if (id === 'repeat') {
        applicationState.repeatChanged(value)
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

        applicationState.playbackChanged(mode)
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
        applicationState.playbackTimeUpdate({currentTime, totalTime})
      }
    })
  }
}

window.EventNotificationBus = new EventNotification()
