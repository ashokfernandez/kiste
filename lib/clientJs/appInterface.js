'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * js/main.js
 *
 * This script is part of the JavaScript interface used to interact with
 * the Google Play Music page, in order to provide notifications functionality.
 *
 * Created by Sajid Anwar.
 *
 * Subject to terms and conditions in LICENSE.md.
 *
 */

// This check ensures that, even though this script is run multiple times, our code is only attached once.
console.log('checking for existing API');
console.log(window.GoogleMusicAPI);
if (window.GoogleMusicAPI === undefined) {
  var GoogleMusicAPI = (function () {
    function GoogleMusicAPI() {
      _classCallCheck(this, GoogleMusicAPI);

      this.selectors = {};
      this.CONSTANTS = {};

      // ------------------------------------------------------------ VOLUME CONTROL
      this.selectors.volumeSlider = document.querySelector('#material-vslider');
      this.selectors.volumeSlider.step = 1;

      // ------------------------------------------------------------ PLAYBACK CONTROLS
      this.selectors.playPause = document.querySelector('#player [data-id="play-pause"]');
      this.selectors.forward = document.querySelector('#player [data-id="forward"]');
      this.selectors.rewind = document.querySelector('#player [data-id="rewind"]');
      this.selectors.shuffle = document.querySelector('#player [data-id="shuffle"]');
      this.selectors.repeat = document.querySelector('#player [data-id="repeat"]');
      this.selectors.playback = document.querySelector('#player #material-player-progress');

      // Playback states
      this.CONSTANTS.STOPPED = 0;
      this.CONSTANTS.PAUSED = 1;
      this.CONSTANTS.PLAYING = 2;

      // Repeat modes.
      this.CONSTANTS.LIST_REPEAT = 'LIST_REPEAT';
      this.CONSTANTS.SINGLE_REPEAT = 'SINGLE_REPEAT';
      this.CONSTANTS.NO_REPEAT = 'NO_REPEAT';

      // Shuffle modes.
      this.CONSTANTS.ALL_SHUFFLE = 'ALL_SHUFFLE';
      this.CONSTANTS.NO_SHUFFLE = 'NO_SHUFFLE';
    }

    // ------------------------------------------------------------ VOLUME CONTROL

    _createClass(GoogleMusicAPI, [{
      key: 'getVolume',
      value: function getVolume() {
        return parseInt(this.selectors.volumeSlider.value, 10);
      }

      // Sets the volume to a level between 0 - 100

    }, {
      key: 'setVolume',
      value: function setVolume(newVolume) {
        var currentVolume = this.getVolume();

        if (newVolume > currentVolume) {
          this._increaseVolume(newVolume - currentVolume);
        } else if (newVolume < currentVolume) {
          this._decreaseVolume(currentVolume - newVolume);
        }
      }
    }, {
      key: '_increaseVolume',
      value: function _increaseVolume(amount) {
        amount = amount || 1;

        for (var i = 0; i < amount; i++) {
          this.selectors.volumeSlider.increment();
        }
      }
    }, {
      key: '_decreaseVolume',
      value: function _decreaseVolume(amount) {
        amount = amount || 1;

        for (var i = 0; i < amount; i++) {
          this.selectors.volumeSlider.decrement();
        }
      }

      // ------------------------------------------------------------ VOLUME CONTROL

    }, {
      key: 'getPlaybackTime',
      value: function getPlaybackTime() {
        return parseInt(this.selectors.playback.value, 10);
      }
    }, {
      key: 'setPlaybackTime',
      value: function setPlaybackTime(milliseconds) {
        this.selectors.playback.value = milliseconds;
        this.selectors.playback.fire('change');
      }

      // Playback functions.

    }, {
      key: 'playPause',
      value: function playPause() {
        this.selectors.playPause.click();
      }
    }, {
      key: 'forward',
      value: function forward() {
        this.selectors.forward.click();
      }
    }, {
      key: 'rewind',
      value: function rewind() {
        this.selectors.rewind.click();
      }
    }, {
      key: 'getShuffle',
      value: function getShuffle() {
        return this.selectors.shuffle.getAttribute('value');
      }
    }, {
      key: 'toggleShuffle',
      value: function toggleShuffle() {
        this.selectors.shuffle.click();
      }
    }, {
      key: 'getRepeat',
      value: function getRepeat() {
        return this.selectors.repeat.value;
      }
    }, {
      key: 'changeRepeat',
      value: function changeRepeat(mode) {}
      // if (!mode) {
      // Toggle between repeat modes once.
      // this.repeat.click()
      // } else {
      // Toggle between repeat modes until the desired mode is activated.
      // while (getRepeat() !== mode) {
      //     this.repeat.click();
      // }
      // }

      // Taken from the Google Play Music page.

    }, {
      key: 'toggleVisualization',
      value: function toggleVisualization() {
        var visualisationIcon = document.querySelector('#hover-icon');

        if (visualisationIcon) {
          visualisationIcon.click();
        }
      }
    }]);

    return GoogleMusicAPI;
  })();

  window.GoogleMusic = new GoogleMusicAPI();
  console.log('Loaded API');
} else {
  console.log('didnt load API');
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

//     var lastTitle = "";
//     var lastArtist = "";
//     var lastAlbum = "";

//     var addObserver,
//         shuffleObserver,
//         repeatObserver,
//         playbackObserver,
//         playbackTimeObserver,
//         ratingObserver;

//     addObserver = new MutationObserver(function(mutations) {
//         mutations.forEach(function(m) {
//             for (var i = 0; i < m.addedNodes.length; i++) {
//                 var target = m.addedNodes[i];
//                 var name = target.id || target.className;

//                 if (name == 'now-playing-info-wrapper') {
//                     var now = new Date();

//                     var title = document.querySelector('#player #player-song-title');
//                     var artist = document.querySelector('#player #player-artist');
//                     var album = document.querySelector('#player .player-album');
//                     var art = document.querySelector('#player #playingAlbumArt');
//                     var duration = parseInt(document.querySelector('#player #material-player-progress').max) / 1000;

//                     title = (title) ? title.innerText : 'Unknown';
//                     artist = (artist) ? artist.innerText : 'Unknown';
//                     album = (album) ? album.innerText : 'Unknown';
//                     art = (art) ? art.src : null;

//                     // The art may be a protocol-relative URL, so normalize it to HTTPS.
//                     if (art && art.slice(0, 2) === '//') {
//                         art = 'https:' + art;
//                     }

//                     // Make sure that this is the first of the notifications for the
//                     // insertion of the song information elements.
//                     if (lastTitle != title || lastArtist != artist || lastAlbum != album) {
//                         GoogleMusicApp.notifySong(title, artist, album, art, duration);

//                         lastTitle = title;
//                         lastArtist = artist;
//                         lastAlbum = album;
//                     }

//                     // Fire the rating observer if the thumbs exist (no harm if already observing)
//                     // Ensure this is below notifySong, otherwise it'll apply the loved status of the current song to the previous song (#390)
//                     GoogleMusicApp.ratingChanged(MusicAPI.Rating.getRating());
//                 }
//             }
//         });
//     });

//     shuffleObserver = new MutationObserver(function(mutations) {
//         mutations.forEach(function(m) {
//           var target = m.target;
//           var id = target.dataset.id;

//           if (id == 'shuffle') {
//               GoogleMusicApp.shuffleChanged(target.getAttribute('value'));
//           }
//         })
//     });

//     repeatObserver = new MutationObserver(function(mutations) {
//         mutations.forEach(function(m) {
//             var target = m.target;
//             var id = target.dataset.id;

//             if (id == 'repeat') {
//                 GoogleMusicApp.repeatChanged(target.getAttribute('value'));
//             }
//         });
//     });

//     playbackObserver = new MutationObserver(function(mutations) {
//         mutations.forEach(function(m) {
//             var target = m.target;
//             var id = target.dataset.id;

//             if (id == 'play-pause') {
//                 var mode;
//                 var playing = target.classList.contains('playing');

//                 if (playing) {
//                     mode = MusicAPI.Playback.PLAYING;
//                 } else {
//                     // If there is a current song, then the player is paused.
//                     if (document.querySelector('#playerSongInfo').childNodes.length) {
//                         mode = MusicAPI.Playback.PAUSED;
//                     } else {
//                         mode = MusicAPI.Playback.STOPPED;
//                     }
//                 }

//                 GoogleMusicApp.playbackChanged(mode);
//             }
//         });
//     });

//     playbackTimeObserver = new MutationObserver(function(mutations) {
//         mutations.forEach(function(m) {
//             var target = m.target;
//             var id = target.id;

//             if (id == 'material-player-progress') {
//                 var currentTime = parseInt(target.value);
//                 var totalTime = parseInt(target.max);
//                 GoogleMusicApp.playbackTimeChanged(currentTime, totalTime);
//             }
//         });
//     });

//     addObserver.observe(document.querySelector('#player #playerSongInfo'), {
//         childList: true,
//         subtree: true
//     });

//     shuffleObserver.observe(document.querySelector('#player [data-id="shuffle"]'), {
//         attributes: true
//     });

//     repeatObserver.observe(document.querySelector('#player [data-id="repeat"]'), {
//         attributes: true
//     });

//     playbackObserver.observe(document.querySelector('#player [data-id="play-pause"]'), {
//         attributes: true
//     });

//     playbackTimeObserver.observe(document.querySelector('#player #material-player-progress'), {
//         attributes: true
//     });
// }
