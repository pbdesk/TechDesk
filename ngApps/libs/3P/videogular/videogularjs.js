///#source 1 1 /ngApps/libs/3P/videogular/videogular.js
/**
 * @license videogular v1.1.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
"use strict";
angular.module("com.2fdevs.videogular", ["ngSanitize"])
  .run(
    ["$templateCache", function($templateCache) {
      $templateCache.put("vg-templates/vg-media-video", "<video></video>");
      $templateCache.put("vg-templates/vg-media-audio", "<audio></audio>");
    }]
  );

/**
 * @ngdoc service
 * @name com.2fdevs.videogular.constant:VG_STATES
 *
 * @description
 * Possible video states:
 *  - VG_STATES.PLAY: "play"
 *  - VG_STATES.PAUSE: "pause"
 *  - VG_STATES.STOP: "stop"
 **/
"use strict";
angular.module("com.2fdevs.videogular")
  .constant("VG_STATES", {
    PLAY: "play",
    PAUSE: "pause",
    STOP: "stop"
  });

"use strict";
/**
 * @ngdoc controller
 * @name com.2fdevs.videogular.controller:vgController
 * @description
 * Videogular controller.
 * This controller offers a public API:
 *
 * Methods
 * - play(): Plays media.
 * - pause(): Pause media.
 * - stop(): Stops media.
 * - playPause(): Toggles play and pause.
 * - seekTime(value, byPercent): Seeks to a specified time position. Param value must be an integer representing the target position in seconds or a percentage. By default seekTime seeks by seconds, if you want to seek by percentage just pass byPercent to true.
 * - setVolume(volume): Sets volume. Param volume must be an integer with a value between 0 and 1.
 * - setState(state): Sets a new state. Param state mus be an string with 'play', 'pause' or 'stop'. This method only changes the state of the player, but doesn't plays, pauses or stops the media file.
 * - toggleFullScreen(): Toggles between fullscreen and normal mode.
 * - updateTheme(css-url): Removes previous CSS theme and sets a new one.
 * - clearMedia(): Cleans the current media file.
 * - changeSource(array): Updates current media source. Param `array` must be an array of media source objects.
 * A media source is an object with two properties `src` and `type`. The `src` property must contains a trustful url resource.
 * <pre>{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"}</pre>
 *
 * Properties
 * - config: String with a url to JSON config file.
 * - isReady: Boolean value with current player initialization state.
 * - isBuffering: Boolean value to know if player is buffering media.
 * - isCompleted: Boolean value to know if current media file has been completed.
 * - isLive: Boolean value to know if current media file is a Live Streaming.
 * - playsInline: Boolean value to know if Videogular if fullscreen mode will use native mode or inline playing.
 * - mediaElement: Reference to video/audio object.
 * - videogularElement: Reference to videogular tag.
 * - sources: Array with current sources.
 * - tracks: Array with current tracks.
 * - cuePoints: Object containing a list of timelines with cue points. Each property in the object represents a timeline, which is an Array of objects with the next definition:
 * <pre>{
 *    timeLapse:{
 *      start: 0,
 *      end: 10
 *    },
 *    onLeave: callback(currentTime, timeLapse, params),
 *    onUpdate: callback(currentTime, timeLapse, params),
 *    onComplete: callback(currentTime, timeLapse, params),
 *    params: {
 *      // Custom object with desired structure and data
 *    }
 * }</pre>
 *
 *    * timeLapse: Object with start and end properties to define in seconds when this timeline is active.\n
 *    * onLeave: Callback function that will be called when user seeks and the new time doesn't reach to the timeLapse.start property.
 *    * onUpdate: Callback function that will be called when the progress is in the middle of timeLapse.start and timeLapse.end.
 *    * onComplete: Callback function that will be called when the progress is bigger than timeLapse.end.
 *    * params: Custom object with data to pass to the callbacks.
 *
 * - isFullScreen: Boolean value to know if we’re in fullscreen mode.
 * - currentState: String value with “play”, “pause” or “stop”.
 * - currentTime: Number value with current media time progress.
 * - totalTime: Number value with total media time.
 * - timeLeft: Number value with current media time left.
 * - volume: Number value with current volume between 0 and 1.
 *
 */
angular.module("com.2fdevs.videogular")
  .controller("vgController",
  ['$scope', '$window', 'vgConfigLoader', 'vgFullscreen', 'VG_UTILS', 'VG_STATES', function ($scope, $window, vgConfigLoader, vgFullscreen, VG_UTILS, VG_STATES) {
    var currentTheme = null;
    var isFullScreenPressed = false;
    var isMetaDataLoaded = false;

    // PUBLIC $API
    this.videogularElement = null;

    this.clearMedia = function () {
      this.mediaElement[0].src = '';
    };

    this.onCanPlay = function (evt) {
      this.isBuffering = false;
      $scope.$apply();
    };

    this.onVideoReady = function () {
      this.isReady = true;
      this.autoPlay = $scope.vgAutoPlay;
      this.playsInline = $scope.vgPlaysInline;
      this.cuePoints = $scope.vgCuePoints;
      this.currentState = VG_STATES.STOP;

      isMetaDataLoaded = true;

      if ($scope.vgConfig) {
        vgConfigLoader.loadConfig($scope.vgConfig).then(
          this.onLoadConfig.bind(this)
        );
      }
      else {
        $scope.vgPlayerReady({$API: this});
      }
    };

    this.onLoadConfig = function(config) {
      this.config = config;

      $scope.vgTheme = this.config.theme;
      $scope.vgAutoPlay = this.config.autoPlay;
      $scope.vgPlaysInline = this.config.playsInline;
      $scope.vgCuePoints = this.config.cuePoints;

      $scope.vgPlayerReady({$API: this});
    };

    this.onLoadMetaData = function (evt) {
      this.isBuffering = false;
      this.onUpdateTime(evt);
    };

    this.onUpdateTime = function (event) {
      this.currentTime = 1000 * event.target.currentTime;

      if (event.target.duration != Infinity) {
        this.totalTime = 1000 * event.target.duration;
        this.timeLeft = 1000 * (event.target.duration - event.target.currentTime);
        this.isLive = false;
      }
      else {
        // It's a live streaming without and end
        this.isLive = true;
      }

      if (this.cuePoints) {
        this.checkCuePoints(event.target.currentTime);
      }

      $scope.vgUpdateTime({$currentTime: event.target.currentTime, $duration: event.target.duration});

      $scope.$apply();
    };

    this.checkCuePoints = function checkCuePoints(currentTime) {
      for (var tl in this.cuePoints) {
        for (var i=0, l=this.cuePoints[tl].length; i<l; i++) {
          var cp = this.cuePoints[tl][i];

          if (currentTime < cp.timeLapse.end) cp.$$isCompleted = false;

          // Check if we've been reached to the cue point
          if (currentTime > cp.timeLapse.start) {
            cp.$$isDirty = true;

            // We're in the timelapse
            if (currentTime < cp.timeLapse.end) {
              if (cp.onUpdate) cp.onUpdate(currentTime, cp.timeLapse, cp.params);
            }

            // We've been passed the cue point
            if (currentTime >= cp.timeLapse.end) {
              if (cp.onComplete && !cp.$$isCompleted) {
                cp.$$isCompleted = true;
                cp.onComplete(currentTime, cp.timeLapse, cp.params);
              }
            }
          }
          else {
            if (cp.onLeave && cp.$$isDirty) {
              cp.onLeave(currentTime, cp.timeLapse, cp.params);
            }

            cp.$$isDirty = false;
          }
        }
      }
    };

    this.onPlay = function () {
      this.setState(VG_STATES.PLAY);
      $scope.$apply();
    };

    this.onPause = function () {
      if (this.mediaElement[0].currentTime == 0) {
        this.setState(VG_STATES.STOP);
      }
      else {
        this.setState(VG_STATES.PAUSE);
      }

      $scope.$apply();
    };

    this.onVolumeChange = function () {
      this.volume = this.mediaElement[0].volume;
      $scope.$apply();
    };

    this.seekTime = function (value, byPercent) {
      var second;
      if (byPercent) {
        second = value * this.mediaElement[0].duration / 100;
        this.mediaElement[0].currentTime = second;
      }
      else {
        second = value;
        this.mediaElement[0].currentTime = second;
      }

      this.currentTime = 1000 * second;
    };

    this.playPause = function () {
      if (this.mediaElement[0].paused) {
        this.play();
      }
      else {
        this.pause();
      }
    };

    this.setState = function (newState) {
      if (newState && newState != this.currentState) {
        $scope.vgUpdateState({$state: newState});

        this.currentState = newState;
      }

      return this.currentState;
    };

    this.play = function () {
      this.mediaElement[0].play();
      this.setState(VG_STATES.PLAY);
    };

    this.pause = function () {
      this.mediaElement[0].pause();
      this.setState(VG_STATES.PAUSE);
    };

    this.stop = function () {
      this.mediaElement[0].pause();
      this.mediaElement[0].currentTime = 0;
      this.setState(VG_STATES.STOP);
    };

    this.toggleFullScreen = function () {
      // There is no native full screen support or we want to play inline
      if (!vgFullscreen.isAvailable || $scope.vgPlaysInline) {
        if (this.isFullScreen) {
          this.videogularElement.removeClass("fullscreen");
          this.videogularElement.css("z-index", "auto");
        }
        else {
          this.videogularElement.addClass("fullscreen");
          this.videogularElement.css("z-index", VG_UTILS.getZIndex());
        }

        this.isFullScreen = !this.isFullScreen;
      }
      // Perform native full screen support
      else {
        if (this.isFullScreen) {
          if (!VG_UTILS.isMobileDevice()) {
            vgFullscreen.exit();
          }
        }
        else {
          // On mobile devices we should make fullscreen only the video object
          if (VG_UTILS.isMobileDevice()) {
            // On iOS we should check if user pressed before fullscreen button
            // and also if metadata is loaded
            if (VG_UTILS.isiOSDevice()) {
              if (isMetaDataLoaded) {
                this.enterElementInFullScreen(this.mediaElement[0]);
              }
              else {
                isFullScreenPressed = true;
                this.play();
              }
            }
            else {
              this.enterElementInFullScreen(this.mediaElement[0]);
            }
          }
          else {
            this.enterElementInFullScreen(this.videogularElement[0]);
          }
        }
      }
    };

    this.enterElementInFullScreen = function (element) {
      vgFullscreen.request(element);
    };

    this.changeSource = function (newValue) {
      $scope.vgChangeSource({$source: newValue});
    };

    this.setVolume = function (newVolume) {
      $scope.vgUpdateVolume({$volume: newVolume});

      this.mediaElement[0].volume = newVolume;
      this.volume = newVolume;
    };

    this.updateTheme = function (value) {
      var links = document.getElementsByTagName("link");
      var i;
      var l;

      // Remove previous theme
      if (currentTheme) {
        for (i = 0, l = links.length; i < l; i++) {
          if (links[i].outerHTML.indexOf(currentTheme) >= 0) {
            links[i].parentNode.removeChild(links[i]);
          }
        }
      }

      if (value) {
        var headElem = angular.element(document).find("head");
        var exists = false;

        // Look if theme already exists
        for (i = 0, l = links.length; i < l; i++) {
          exists = (links[i].outerHTML.indexOf(value) >= 0);
          if (exists) break;
        }

        if (!exists) {
          headElem.append("<link rel='stylesheet' href='" + value + "'>");
        }

        currentTheme = value;
      }
    };

    this.onStartBuffering = function (event) {
      this.isBuffering = true;
      $scope.$apply();
    };

    this.onStartPlaying = function (event) {
      this.isBuffering = false;
      $scope.$apply();
    };

    this.onComplete = function (event) {
      $scope.vgComplete();

      this.setState(VG_STATES.STOP);
      this.isCompleted = true;
      $scope.$apply();
    };

    this.onVideoError = function (event) {
      $scope.vgError({$event: event});
    };

    this.addListeners = function () {
      this.mediaElement[0].addEventListener("canplay", this.onCanPlay.bind(this), false);
      this.mediaElement[0].addEventListener("loadedmetadata", this.onLoadMetaData.bind(this), false);
      this.mediaElement[0].addEventListener("waiting", this.onStartBuffering.bind(this), false);
      this.mediaElement[0].addEventListener("ended", this.onComplete.bind(this), false);
      this.mediaElement[0].addEventListener("playing", this.onStartPlaying.bind(this), false);
      this.mediaElement[0].addEventListener("play", this.onPlay.bind(this), false);
      this.mediaElement[0].addEventListener("pause", this.onPause.bind(this), false);
      this.mediaElement[0].addEventListener("volumechange", this.onVolumeChange.bind(this), false);
      this.mediaElement[0].addEventListener("timeupdate", this.onUpdateTime.bind(this), false);
      this.mediaElement[0].addEventListener("error", this.onVideoError.bind(this), false);
    };

    this.init = function () {
      this.isReady = false;
      this.isCompleted = false;
      this.currentTime = 0;
      this.totalTime = 0;
      this.timeLeft = 0;
      this.isLive = false;
      this.isFullScreen = vgFullscreen.isFullScreen();
      this.isConfig = ($scope.vgConfig != undefined);

      this.updateTheme($scope.vgTheme);
      this.addBindings();

      if (vgFullscreen.isAvailable) {
        document.addEventListener(vgFullscreen.onchange, this.onFullScreenChange.bind(this));
      }
    };

    this.onUpdateTheme = function onUpdateTheme(newValue) {
      this.updateTheme(newValue);
    };

    this.onUpdateAutoPlay = function onUpdateAutoPlay(newValue) {
      if (newValue) this.play(this);
    };

    this.addBindings = function () {
      $scope.$watch("vgTheme", this.onUpdateTheme.bind(this));

      $scope.$watch("vgAutoPlay", this.onUpdateAutoPlay.bind(this));

      $scope.$watch("vgPlaysInline", function (newValue, oldValue) {
        this.playsInline = newValue;
      });
    };

    this.onFullScreenChange = function (event) {
      this.isFullScreen = vgFullscreen.isFullScreen();
      $scope.$apply();
    };

    // Empty mediaElement on destroy to avoid that Chrome downloads video even when it's not present
    $scope.$on('$destroy', this.clearMedia.bind(this));

    // Empty mediaElement when router changes
    $scope.$on('$routeChangeStart', this.clearMedia.bind(this));

    this.init();
  }]
);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.directive:vgLoop
 * @restrict A
 * @description
 * Optional directive for `vg-media` to add or remove loop in media files. Possible values are: "true" and "false"
 *
 */
"use strict";
angular.module("com.2fdevs.videogular")
  .directive("vgLoop",
  [function () {
    return {
      restrict: "A",
      require: "^videogular",
      link: {
        pre: function (scope, elem, attr, API) {
          var loop;

          scope.setLoop = function setLoop(value) {
            if (value) {
              API.mediaElement.attr("loop", value);
            }
            else {
              API.mediaElement.removeAttr("loop");
            }
          };

          if (API.isConfig) {
            scope.$watch(
              function() {
                return API.config;
              },
              function() {
                if (API.config) {
                  scope.setLoop(API.config.loop);
                }
              }
            );
          }
          else {
            scope.$watch(attr.vgLoop, function (newValue, oldValue) {
              if ((!loop || newValue != oldValue) && newValue) {
                loop = newValue;
                scope.setLoop(loop);
              }
              else {
                scope.setLoop();
              }
            });
          }
        }
      }
    }
  }
  ]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.direcitve:vgMedia
 * @restrict E
 * @description
 * Directive to add a source of videos or audios. This directive will create a &lt;video&gt; tag and usually will be above plugin tags.
 *
 * @param {array} vgSrc Bindable array with a list of media sources. A media source is an object with two properties `src` and `type`. The `src` property must contains a trusful url resource.
 * @param {string} vgType String with "video" or "audio" values to set a <video> or <audio> tag inside <vg-media>.
 * <pre>
 * {
 *    src: $sce.trustAsResourceUrl("path/to/video/videogular.mp4"),
 *    type: "video/mp4"
 * }
 * </pre>
 *
 */
"use strict";
angular.module("com.2fdevs.videogular")
  .directive("vgMedia",
  ["$timeout", "VG_UTILS", "VG_STATES", function ($timeout, VG_UTILS, VG_STATES) {
    return {
      restrict: "E",
      require: "^videogular",
      templateUrl: function(elem, attrs) {
        var vgType = attrs.vgType || "video";
        return attrs.vgTemplate || "vg-templates/vg-media-" + vgType;
      },
      scope: {
        vgSrc: "=?",
        vgType: "=?"
      },
      link: function (scope, elem, attrs, API) {
        var sources;

        // what type of media do we want? defaults to 'video'
        if (!attrs.vgType || attrs.vgType === "video") {
          attrs.vgType = "video";
        }
        else {
          attrs.vgType = "audio";
        }

        // FUNCTIONS
        scope.onChangeSource = function onChangeSource(newValue, oldValue) {
          if ((!sources || newValue != oldValue) && newValue) {
            sources = newValue;

            if(API.currentState !== VG_STATES.PLAY) {
              API.currentState = VG_STATES.STOP;
            }

            API.sources = sources;
            scope.changeSource();
          }
        };

        scope.changeSource = function changeSource() {
          var canPlay = "";

          // It's a cool browser
          if (API.mediaElement[0].canPlayType) {
            for (var i = 0, l = sources.length; i < l; i++) {
              canPlay = API.mediaElement[0].canPlayType(sources[i].type);

              if (canPlay == "maybe" || canPlay == "probably") {
                API.mediaElement.attr("src", sources[i].src);
                API.mediaElement.attr("type", sources[i].type);
                break;
              }
            }
          }
          // It's a crappy browser and it doesn't deserve any respect
          else {
            // Get H264 or the first one
            API.mediaElement.attr("src", sources[0].src);
            API.mediaElement.attr("type", sources[0].type);
          }

          $timeout(function() {
            if (API.autoPlay && !VG_UTILS.isMobileDevice() || API.currentState === VG_STATES.PLAY) API.play();
          });

          if (canPlay == "") {
            API.onVideoError();
          }
        };

        // INIT
        API.mediaElement = elem.find(attrs.vgType);
        API.sources = scope.vgSrc;

        API.addListeners();
        API.onVideoReady();

        scope.$watch("vgSrc", scope.onChangeSource);

        if (API.isConfig) {
          scope.$watch(
            function() {
              return API.config;
            },
            function() {
              if (API.config) {
                scope.vgSrc = API.config.sources;
              }
            }
          );
        }
      }
    }
  }
  ]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.directive:vgNativeControls
 * @restrict A
 * @description
 * Optional directive for `vg-media` to add or remove the native controls. Possible values are: "true" and "false"
 *
 */
"use strict";
angular.module("com.2fdevs.videogular")
  .directive("vgNativeControls",
  [function () {
    return {
      restrict: "A",
      require: "^videogular",
      link: {
        pre: function (scope, elem, attr, API) {
          var controls;

          scope.setControls = function setControls(value) {
            if (value) {
              API.mediaElement.attr("controls", value);
            }
            else {
              API.mediaElement.removeAttr("controls");
            }
          };

          if (API.isConfig) {
            scope.$watch(
              function() {
                return API.config;
              },
              function() {
                if (API.config) {
                  scope.setControls(API.config.controls);
                }
              }
            );
          }
          else {
            scope.$watch(attr.vgNativeControls, function (newValue, oldValue) {
              if ((!controls || newValue != oldValue) && newValue) {
                controls = newValue;
                scope.setControls(controls);
              }
              else {
                scope.setControls();
              }
            });
          }
        }
      }
    }
  }
  ]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.directive:vgPreload
 * @restrict A
 * @description
 * Optional directive for `vg-media` to preload media files. Possible values are: "auto", "none" and "preload"
 *
 */
"use strict";
angular.module("com.2fdevs.videogular")
  .directive("vgPreload",
  [function () {
    return {
      restrict: "A",
      require: "^videogular",
      link: {
        pre: function (scope, elem, attr, API) {
          var preload;

          scope.setPreload = function setPreload(value) {
            if (value) {
              API.mediaElement.attr("preload", value);
            }
            else {
              API.mediaElement.removeAttr("preload");
            }
          };

          if (API.isConfig) {
            scope.$watch(
              function() {
                return API.config;
              },
              function() {
                if (API.config) {
                  scope.setPreload(API.config.preload);
                }
              }
            );
          }
          else {
            scope.$watch(attr.vgPreload, function (newValue, oldValue) {
              if ((!preload || newValue != oldValue) && newValue) {
                preload = newValue;
                scope.setPreload(preload);
              }
              else {
                scope.setPreload();
              }
            });
          }
        }
      }
    }
  }
  ]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.directive:vgTracks
 * @restrict A
 * @description
 * Optional directive for `vg-media` to add a list of tracks.
 *
 * vgTracks Bindable array with a list of subtitles sources. A track source is an object with five properties: src, kind, srclang, label and default.
 * <pre>
 * {
 *    src: "assets/subs/pale-blue-dot.vtt",
 *    kind: "subtitles",
 *    srclang: "en",
 *    label: "English",
 *    default: "true/false"
 * }
 * </pre>
 */
"use strict";
angular.module("com.2fdevs.videogular")
  .directive("vgTracks",
  [function () {
    return {
      restrict: "A",
      require: "^videogular",
      link: {
        pre: function (scope, elem, attr, API) {
          var tracks;
          var trackText;
          var i;
          var l;

          scope.changeSource = function changeSource() {
            // Remove previous tracks
            var oldTracks = API.mediaElement.children();

            for (i = 0, l = oldTracks.length; i < l; i++) {
              oldTracks[i].remove();
            }

            // Add new tracks
            if (tracks) {
              for (i = 0, l = tracks.length; i < l; i++) {
                trackText = "";
                trackText += '<track ';

                // Add track properties
                for (var prop in tracks[i]) {
                  trackText += prop + '="' + tracks[i][prop] + '" ';
                }

                trackText += '></track>';

                API.mediaElement.append(trackText);
              }
            }
          };

          scope.setTracks = function setTracks(value) {
            // Add tracks to the API to have it available for other plugins (like controls)
            tracks = value;
            API.tracks = value;
            scope.changeSource();
          };

          if (API.isConfig) {
            scope.$watch(
              function() {
                return API.config;
              },
              function() {
                if (API.config) {
                  scope.setTracks(API.config.tracks);
                }
              }
            );
          }
          else {
            scope.$watch(attr.vgTracks, function (newValue, oldValue) {
              if ((!tracks || newValue != oldValue)) {
                scope.setTracks(newValue);
              }
            });
          }
        }
      }
    }
  }
  ]);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.directive:videogular
 * @restrict E
 * @description
 * Main directive that must wrap a &lt;vg-media&gt; tag and all plugins.
 *
 * &lt;video&gt; tag usually will be above plugin tags, that's because plugins should be in a layer over the &lt;video&gt;.
 *
 * @param {string} vgTheme String with a scope name variable. This directive will inject a CSS link in the header of your page.
 * **This parameter is required.**
 *
 * @param {boolean} [vgPlaysInline=false] vgPlaysInline Boolean value or a String with a scope name variable to use native fullscreen (default) or set fullscreen inside browser (true).
 *
 * @param {boolean} [vgAutoPlay=false] vgAutoPlay Boolean value or a String with a scope name variable to auto start playing video when it is initialized.
 *
 * **This parameter is disabled in mobile devices** because user must click on content to prevent consuming mobile data plans.
 *
 * @param {object} vgCuePoints Bindable object containing a list of timelines with cue points objects. A timeline is an array of objects with three properties `timelapse`, `expression` and `params`.
 * - The `timelapse` is an object with two properties `start` and `end` representing in seconds the period for this cue points.
 * - The `expression` is an AngularJS expression to evaluate or a function.
 * - The `params` an object with values available to evaluate inside the expression as `$params`. This object is also received in the function defined in `expression`.
 *
 * @param {function} vgConfig String with a url to a config file. Config file's must be a JSON file object with the following structure:
 * <pre>
{
  "controls": false,
  "loop": false,
  "autoplay": false,
  "preload": "auto",
  "theme": "path/to/videogular.css",
  "sources": [
    {
      "src": "path/to/videogular.mp4",
      "type": "video/mp4"
    },
    {
      "src": "path/to/videogular.webm",
      "type": "video/webm"
    },
    {
      "src": "path/to/videogular.ogg",
      "type": "video/ogg"
    }
  ],
  "tracks": [
    {
      "src": "path/to/pale-blue-dot.vtt",
      "kind": "subtitles",
      "srclang": "en",
      "label": "English",
      "default": ""
    }
  ],
  "plugins": {
    "controls": {
      "autohide": true,
      "autohideTime": 3000
    },
    "poster": {
      "url": "path/to/earth.png"
    },
    "ima-ads": {
      "companion": "companionAd",
      "companionSize": [728, 90],
      "network": "6062",
      "unitPath": "iab_vast_samples",
      "adTagUrl": "http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=%2F3510761%2FadRulesSampleTags&ciu_szs=160x600%2C300x250%2C728x90&cust_params=adrule%3Dpremidpostpodandbumpers&impl=s&gdfp_req=1&env=vp&ad_rule=1&vid=47570401&cmsid=481&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]",
      "skipButton": "<div class='skipButton'>skip ad</div>"
    },
    "analytics": {
      "category": "Videogular",
      "label": "Main",
      "events": {
        "ready": true,
        "play": true,
        "pause": true,
        "stop": true,
        "complete": true,
        "progress": 10
      }
    }
  }
}
 * </pre>
 * @param {function} vgComplete Function name in controller's scope to call when video have been completed.
 * @param {function} vgUpdateVolume Function name in controller's scope to call when volume changes. Receives a param with the new volume.
 * @param {function} vgUpdateTime Function name in controller's scope to call when video playback time is updated. Receives two params with current time and duration in milliseconds.
 * @param {function} vgUpdateState Function name in controller's scope to call when video state changes. Receives a param with the new state. Possible values are "play", "stop" or "pause".
 * @param {function} vgPlayerReady Function name in controller's scope to call when video have been initialized. Receives a param with the videogular API.
 * @param {function} vgChangeSource Function name in controller's scope to change current video source. Receives a param with the new video.
 * @param {function} vgPlaysInline Boolean to disable native fullscreen and plays video inline.
 * @param {function} vgError Function name in controller's scope to receive an error from video object. Receives a param with the error event.
 * This is a free parameter and it could be values like "new.mp4", "320" or "sd". This will allow you to use this to change a video or video quality.
 * This callback will not change the video, you should do that by updating your sources scope variable.
 *
 */
"use strict";
angular.module("com.2fdevs.videogular")
  .directive("videogular",
  [function () {
    return {
      restrict: "EA",
      scope: {
        vgTheme: "=?",
        vgAutoPlay: "=?",
        vgPlaysInline: "=?",
        vgCuePoints: "=?",
        vgConfig: "@",
        vgComplete: "&",
        vgUpdateVolume: "&",
        vgUpdateTime: "&",
        vgUpdateState: "&",
        vgPlayerReady: "&",
        vgChangeSource: "&",
        vgError: "&"
      },
      controller: "vgController",
      controllerAs: "API",
      link: {
        pre: function (scope, elem, attr, controller) {
          controller.videogularElement = angular.element(elem);
        }
      }
    }
  }
  ]);

/**
 * @ngdoc service
 * @name com.2fdevs.videogular.service:vgConfigLoader
 *
 * @description
 * Config loader service:
 *
 * vgConfigLoader.loadConfig(url): Param `url` is a url to a config JSON.
 **/
"use strict";
angular.module("com.2fdevs.videogular")
  .service("vgConfigLoader", ["$http", "$q", "$sce", function($http, $q, $sce) {
    this.loadConfig = function loadConfig(url) {
      var deferred = $q.defer();

      $http({method: 'GET', url: url}).then(
        function success(response) {
          var result = response.data;

          for (var i=0, l=result.sources.length; i<l; i++) {
            result.sources[i].src = $sce.trustAsResourceUrl(result.sources[i].src);
          }

          deferred.resolve(result);
        },
        function reject() {
          deferred.reject();
        }
      );

      return deferred.promise;
    };
  }]);

/**
 * @ngdoc service
 * @name com.2fdevs.videogular.service:vgFullscreen
 *
 * @description
 * Native fullscreen polyfill service.
 *
 *    * vgFullscreen.onchange: String with the onchange event name.
 *    * vgFullscreen.onerror: String with the onerror event name.
 *    * vgFullscreen.isAvailable: Boolean with fullscreen availability.
 *    * vgFullscreen.isFullScreen: Boolean with current view mode.
 *    * vgFullscreen.exit: Exit fullscreen function.
 *    * vgFullscreen.request: Request for fullscreen access function.
 **/
"use strict";
angular.module("com.2fdevs.videogular")
  .service("vgFullscreen", ["VG_UTILS", function (VG_UTILS) {
    // Native fullscreen polyfill
    var fsAPI;
    var polyfill = null;
    var APIs = {
      w3: {
        enabled: "fullscreenEnabled",
        element: "fullscreenElement",
        request: "requestFullscreen",
        exit: "exitFullscreen",
        onchange: "fullscreenchange",
        onerror: "fullscreenerror"
      },
      newWebkit: {
        enabled: "webkitFullscreenEnabled",
        element: "webkitFullscreenElement",
        request: "webkitRequestFullscreen",
        exit: "webkitExitFullscreen",
        onchange: "webkitfullscreenchange",
        onerror: "webkitfullscreenerror"
      },
      oldWebkit: {
        enabled: "webkitIsFullScreen",
        element: "webkitCurrentFullScreenElement",
        request: "webkitRequestFullScreen",
        exit: "webkitCancelFullScreen",
        onchange: "webkitfullscreenchange",
        onerror: "webkitfullscreenerror"
      },
      moz: {
        enabled: "mozFullScreen",
        element: "mozFullScreenElement",
        request: "mozRequestFullScreen",
        exit: "mozCancelFullScreen",
        onchange: "mozfullscreenchange",
        onerror: "mozfullscreenerror"
      },
      ios: {
        enabled: "webkitFullscreenEnabled",
        element: "webkitFullscreenElement",
        request: "webkitEnterFullscreen",
        exit: "webkitExitFullscreen",
        onchange: "webkitfullscreenchange",
        onerror: "webkitfullscreenerror"
      },
      ms: {
        enabled: "msFullscreenEnabled",
        element: "msFullscreenElement",
        request: "msRequestFullscreen",
        exit: "msExitFullscreen",
        onchange: "msfullscreenchange",
        onerror: "msfullscreenerror"
      }
    };

    for (var browser in APIs) {
      if (APIs[browser].enabled in document) {
        polyfill = APIs[browser];
        break;
      }
    }

    // Override APIs on iOS
    if (VG_UTILS.isiOSDevice()) {
      polyfill = APIs.ios;
    }

    function isFullScreen() {
      return (document[polyfill.element] != null);
    }

    this.onchange = polyfill.onchange;
    this.onerror = polyfill.onerror;
    this.isAvailable = (polyfill != null);
    this.isFullScreen = isFullScreen;
    this.exit = function () {
      document[polyfill.exit]();
    };
    this.request = function (elem) {
      elem[polyfill.request]();
    };
  }]);

"use strict";
angular.module("com.2fdevs.videogular")
  .service("VG_UTILS", function () {
    this.fixEventOffset = function ($event) {
      /**
       * There's no offsetX in Firefox, so we fix that.
       * Solution provided by Jack Moore in this post:
       * http://www.jacklmoore.com/notes/mouse-position/
       * @param $event
       * @returns {*}
       */
      if (navigator.userAgent.match(/Firefox/i)) {
        var style = $event.currentTarget.currentStyle || window.getComputedStyle($event.target, null);
        var borderLeftWidth = parseInt(style['borderLeftWidth'], 10);
        var borderTopWidth = parseInt(style['borderTopWidth'], 10);
        var rect = $event.currentTarget.getBoundingClientRect();
        var offsetX = $event.clientX - borderLeftWidth - rect.left;
        var offsetY = $event.clientY - borderTopWidth - rect.top;

        $event.offsetX = offsetX;
        $event.offsetY = offsetY;
      }

      return $event;
    };

    /**
     * Inspired by Paul Irish
     * https://gist.github.com/paulirish/211209
     * @returns {number}
     */
    this.getZIndex = function () {
      var zIndex = 1;

      var tags = document.getElementsByTagName('*');

      for (var i=0, l=tags.length; i<l; i++) {
        if (tags[i].style.zIndex && parseInt(tags[i].style.zIndex) > zIndex) {
          zIndex = parseInt(tags[i].style.zIndex) + 1;
        }
      }

      return zIndex;
    };

    // Very simple mobile detection, not 100% reliable
    this.isMobileDevice = function () {
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf("IEMobile") !== -1);
    };

    this.isiOSDevice = function () {
      return (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i));
    };
  });

///#source 1 1 /ngApps/libs/3P/videogular/vg-controls.js
/**
 * @license videogular v1.1.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgControls
 * @restrict E
 * @description
 * This directive acts as a container and you will need other directives to control the media.
 * Inside this directive you can add other directives like vg-play-pause-button and vg-scrub-bar.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'></vg-controls>
 * </videogular>
 * </pre>
 *
 * @param {boolean=false} vgAutohide Boolean variable or value to activate autohide.
 * @param {number=2000} vgAutohideTime Number variable or value that represents the time in milliseconds that will wait vgControls until it hides.
 *
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.controls", [])
  .run(
    ["$templateCache", function($templateCache) {
      $templateCache.put("vg-templates/vg-controls",
        '<div class="controls-container" ng-mousemove="onMouseMove()" ng-class="animationClass" ng-transclude></div>');
    }]
  )
	.directive("vgControls",
    ["$timeout", "VG_STATES", function ($timeout, VG_STATES) {
      return {
        restrict: "E",
        require: "^videogular",
        transclude: true,
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'vg-templates/vg-controls';
        },
        scope: {
          vgAutohide: "=?",
          vgAutohideTime: "=?"
        },
        link: function (scope, elem, attr, API) {
          var w = 0;
          var h = 0;
          var autoHideTime = 2000;
          var hideInterval;

          scope.API = API;

          scope.onMouseMove = function onMouseMove() {
            if (scope.vgAutohide) scope.showControls();
          };

          scope.setAutohide = function setAutohide(value) {
            if (value && API.currentState == VG_STATES.PLAY) {
              hideInterval = $timeout(scope.hideControls, autoHideTime);
            }
            else {
              scope.animationClass = "";
              $timeout.cancel(hideInterval);
              scope.showControls();
            }
          };

          scope.setAutohideTime = function setAutohideTime(value) {
            autoHideTime = value;
          };

          scope.hideControls = function hideControls() {
            scope.animationClass = "hide-animation";
          };

          scope.showControls = function showControls() {
            scope.animationClass = "show-animation";
            $timeout.cancel(hideInterval);
            if (scope.vgAutohide && API.currentState == VG_STATES.PLAY) hideInterval = $timeout(scope.hideControls, autoHideTime);
          };

          if (API.isConfig) {
            scope.$watch("API.config",
              function() {
                if (scope.API.config) {
                  var ahValue = scope.API.config.plugins.controls.autohide || false;
                  var ahtValue = scope.API.config.plugins.controls.autohideTime || 2000;
                  scope.vgAutohide = ahValue;
                  scope.vgAutohideTime = ahtValue;
                  scope.setAutohideTime(ahtValue);
                  scope.setAutohide(ahValue);
                }
              }
            );
          }
          else {
            // If vg-autohide has been set
            if (scope.vgAutohide != undefined) {
              scope.$watch("vgAutohide", scope.setAutohide);
            }

            // If vg-autohide-time has been set
            if (scope.vgAutohideTime != undefined) {
              scope.$watch("vgAutohideTime", scope.setAutohideTime);
            }
          }
        }
      }
    }]
  );

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgFullscreenButton
 * @restrict E
 * @description
 * Directive to switch between fullscreen and normal mode.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-fullscreen-button></vg-fullscreen-button>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .run(
    ["$templateCache", function($templateCache) {
      $templateCache.put("vg-templates/vg-fullscreen-button",
        '<button class="iconButton" ng-click="onClickFullScreen()" ng-class="fullscreenIcon" aria-label="Toggle full screen" type="button"> </button>');
    }]
  )
  .directive("vgFullscreenButton",
    [function () {
      return {
        restrict: "E",
        require: "^videogular",
        scope: {},
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'vg-templates/vg-fullscreen-button';
        },
        link: function (scope, elem, attr, API) {
          scope.onChangeFullScreen = function onChangeFullScreen(isFullScreen) {
            scope.fullscreenIcon = {enter: !isFullScreen, exit: isFullScreen};
          };

          scope.onClickFullScreen = function onClickFullScreen() {
            API.toggleFullScreen();
          };

          scope.fullscreenIcon = {enter: true};

          scope.$watch(
            function () {
              return API.isFullScreen;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) {
                scope.onChangeFullScreen(newVal);
              }
            }
          );
        }
      }
    }]
  );

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgPlayPauseButton
 * @restrict E
 * @description
 * Adds a button inside vg-controls to play and pause media.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-play-pause-button></vg-play-pause-button>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .run(
    ["$templateCache", function($templateCache) {
      $templateCache.put("vg-templates/vg-play-pause-button",
        '<button class="iconButton" ng-click="onClickPlayPause()" ng-class="playPauseIcon" aria-label="Play/Pause" type="button"></button>');
    }]
  )
  .directive("vgPlayPauseButton",
    ["VG_STATES", function (VG_STATES) {
      return {
        restrict: "E",
        require: "^videogular",
        scope: {},
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'vg-templates/vg-play-pause-button';
        },
        link: function (scope, elem, attr, API) {
          scope.setState = function setState(newState) {
            switch (newState) {
              case VG_STATES.PLAY:
                scope.playPauseIcon = {pause: true};
                break;

              case VG_STATES.PAUSE:
                scope.playPauseIcon = {play: true};
                break;

              case VG_STATES.STOP:
                scope.playPauseIcon = {play: true};
                break;
            }
          };

          scope.onClickPlayPause = function onClickPlayPause() {
            API.playPause();
          };

          scope.playPauseIcon = {play: true};

          scope.$watch(
            function () {
              return API.currentState;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) {
                scope.setState(newVal);
              }
            }
          );
        }
      }
    }]
  );

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBarCurrentTime
 * @restrict E
 * @description
 * Layer inside vg-scrub-bar to display the current time.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-scrub-bar>
 *            <vg-scrub-bar-current-time></vg-scrub-bar-current-time>
 *        </vg-scrub-bar>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .directive("vgScrubBarCurrentTime",
    [function () {
      return {
        restrict: "E",
        require: "^videogular",
        link: function (scope, elem, attr, API) {
          var percentTime = 0;

          scope.onUpdateTime = function onUpdateTime(newCurrentTime) {
            if (typeof newCurrentTime === 'number' && API.totalTime) {
              percentTime = 100 * (newCurrentTime / API.totalTime);
              elem.css("width", percentTime + "%");
            } else {
              elem.css("width", 0);
            }
          };

          scope.$watch(
            function () {
              return API.currentTime;
            },
            function (newVal, oldVal) {
              scope.onUpdateTime(newVal);
            }
          );
        }
      }
    }]
  );

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBar
 * @restrict E
 * @description
 * Directive to control the time and display other information layers about the progress of the media.
 * This directive acts as a container and you can add more layers to display current time, cuepoints, buffer or whatever you need.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-scrub-bar></vg-scrub-bar>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .run(
    ["$templateCache", function($templateCache) {
      $templateCache.put("vg-templates/vg-scrub-bar",
        '<div role="slider" aria-valuemax="{{ariaTime(API.totalTime)}}" aria-valuenow="{{ariaTime(API.currentTime)}}" aria-valuemin="0" aria-label="Time scrub bar" tabindex="0" ng-transclude ng-keydown="onScrubBarKeyDown($event)"></div>');
    }]
  )
  .directive("vgScrubBar",
    ["VG_STATES", "VG_UTILS", function (VG_STATES, VG_UTILS) {
      return {
        restrict: "E",
        require: "^videogular",
        transclude: true,
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'vg-templates/vg-scrub-bar';
        },
        link: function (scope, elem, attr, API) {
          var isSeeking = false;
          var isPlaying = false;
          var isPlayingWhenSeeking = false;
          var touchStartX = 0;
          var LEFT = 37;
          var RIGHT = 39;
          var NUM_PERCENT = 5;

          scope.API = API;
          scope.ariaTime = function(time) {
            return Math.round(time / 1000);
          };

          scope.onScrubBarTouchStart = function onScrubBarTouchStart($event) {
            var event = $event.originalEvent || $event;
            var touches = event.touches;
            var touchX;

            if (VG_UTILS.isiOSDevice()) {
              touchStartX = (touches[0].clientX - event.layerX) * -1;
            }
            else {
              touchStartX = event.layerX;
            }

            touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;

            isSeeking = true;
            if (isPlaying) isPlayingWhenSeeking = true;
            API.pause();
            API.seekTime(touchX * API.mediaElement[0].duration / elem[0].scrollWidth);

            scope.$apply();
          };

          scope.onScrubBarTouchEnd = function onScrubBarTouchEnd($event) {
            var event = $event.originalEvent || $event;
            if (isPlayingWhenSeeking) {
              isPlayingWhenSeeking = false;
              API.play();
            }
            isSeeking = false;

            scope.$apply();
          };

          scope.onScrubBarTouchMove = function onScrubBarTouchMove($event) {
            var event = $event.originalEvent || $event;
            var touches = event.touches;
            var touchX;

            if (isSeeking) {
              touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;
              API.seekTime(touchX * API.mediaElement[0].duration / elem[0].scrollWidth);
            }

            scope.$apply();
          };

          scope.onScrubBarTouchLeave = function onScrubBarTouchLeave(event) {
            isSeeking = false;

            scope.$apply();
          };

          scope.onScrubBarMouseDown = function onScrubBarMouseDown(event) {
            event = VG_UTILS.fixEventOffset(event);

            isSeeking = true;
            if (isPlaying) isPlayingWhenSeeking = true;
            API.pause();

            API.seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);

            scope.$apply();
          };

          scope.onScrubBarMouseUp = function onScrubBarMouseUp(event) {
            //event = VG_UTILS.fixEventOffset(event);

            if (isPlayingWhenSeeking) {
              isPlayingWhenSeeking = false;
              API.play();
            }
            isSeeking = false;
            //API.seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);

            scope.$apply();
          };

          scope.onScrubBarMouseMove = function onScrubBarMouseMove(event) {
            if (isSeeking) {
              event = VG_UTILS.fixEventOffset(event);
              API.seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);
            }

            scope.$apply();
          };

          scope.onScrubBarMouseLeave = function onScrubBarMouseLeave(event) {
            isSeeking = false;

            scope.$apply();
          };

          scope.onScrubBarKeyDown = function onScrubBarKeyDown(event) {
            var currentPercent = (API.currentTime / API.totalTime) * 100;

            if (event.which === LEFT || event.keyCode === LEFT) {
              API.seekTime(currentPercent - NUM_PERCENT, true);
              event.preventDefault();
            }
            else if (event.which === RIGHT || event.keyCode === RIGHT) {
              API.seekTime(currentPercent + NUM_PERCENT, true);
              event.preventDefault();
            }
          };

          scope.setState = function setState(newState) {
            if (!isSeeking) {
              switch (newState) {
                case VG_STATES.PLAY:
                  isPlaying = true;
                  break;

                case VG_STATES.PAUSE:
                  isPlaying = false;
                  break;

                case VG_STATES.STOP:
                  isPlaying = false;
                  break;
              }
            }
          };

          scope.$watch(
            function () {
              return API.currentState;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) {
                scope.setState(newVal);
              }
            }
          );

          // Touch move is really buggy in Chrome for Android, maybe we could use mouse move that works ok
          if (VG_UTILS.isMobileDevice()) {
            elem.bind("touchstart", scope.onScrubBarTouchStart);
            elem.bind("touchend", scope.onScrubBarTouchEnd);
            elem.bind("touchmove", scope.onScrubBarTouchMove);
            elem.bind("touchleave", scope.onScrubBarTouchLeave);
          }
          else {
            elem.bind("mousedown", scope.onScrubBarMouseDown);
            elem.bind("mouseup", scope.onScrubBarMouseUp);
            elem.bind("mousemove", scope.onScrubBarMouseMove);
            elem.bind("mouseleave", scope.onScrubBarMouseLeave);
          }
        }
      }
    }]
  );

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgTimeDisplay
 * @restrict E
 * @description
 * Adds a time display inside vg-controls to play and pause media.
 * You have three scope variables to show current time, time left and total time.
 *
 * Those scope variables are in milliseconds, you can add a date filter to show the time as you wish.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-time-display>{{currentTime | date:'hh:mm'}}</vg-time-display>
 *        <vg-time-display>{{timeLeft | date:'mm:ss'}}</vg-time-display>
 *        <vg-time-display>{{totalTime | date:'hh:mm:ss'}}</vg-time-display>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .directive("vgTimeDisplay",
    [function () {
      return {
        require: "^videogular",
        restrict: "E",
        link: function (scope, elem, attr, API) {
          scope.currentTime = API.currentTime;
          scope.timeLeft = API.timeLeft;
          scope.totalTime = API.totalTime;
          scope.isLive = API.isLive;

          scope.$watch(
            function () {
              return API.currentTime;
            },
            function (newVal, oldVal) {
              scope.currentTime = newVal;
            }
          );

          scope.$watch(
            function () {
              return API.timeLeft;
            },
            function (newVal, oldVal) {
              scope.timeLeft = newVal;
            }
          );

          scope.$watch(
            function () {
              return API.totalTime;
            },
            function (newVal, oldVal) {
              scope.totalTime = newVal;
            }
          );

          scope.$watch(
            function () {
              return API.isLive;
            },
            function (newVal, oldVal) {
              scope.isLive = newVal;
            }
          );
        }
      }
    }]
  );

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgMuteButton
 * @restrict E
 * @description
 * Directive to display a button to mute volume.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume>
 *            <vg-mute-button><vg-mute-button>
 *        </vg-volume>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .run(
    ["$templateCache", function($templateCache) {
      $templateCache.put("vg-templates/vg-mute-button",
        '<button type="button" class="iconButton" ng-class="muteIcon" ng-click="onClickMute()" ng-focus="onMuteButtonFocus()" ng-blur="onMuteButtonLoseFocus()" ng-keydown="onMuteButtonKeyDown($event)" aria-label="Mute"></button>');
    }]
  )
  .directive("vgMuteButton",
    [function () {
      return {
        restrict: "E",
        require: "^videogular",
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'vg-templates/vg-mute-button';
        },
        link: function (scope, elem, attr, API) {
          var isMuted = false;
          var UP = 38;
          var DOWN = 40;
          var CHANGE_PER_PRESS = 0.05;

          scope.onClickMute = function onClickMute() {
            if (isMuted) {
              scope.currentVolume = scope.defaultVolume;
            }
            else {
              scope.currentVolume = 0;
              scope.muteIcon = {mute: true};
            }

            isMuted = !isMuted;

            API.setVolume(scope.currentVolume);
          };

          scope.onMuteButtonFocus = function onMuteButtonFocus() {
            scope.volumeVisibility = "visible";
          };

          scope.onMuteButtonLoseFocus = function onMuteButtonLoseFocus() {
            scope.volumeVisibility = "hidden";
          };

          scope.onMuteButtonKeyDown = function onMuteButtonKeyDown(event) {
            var currentVolume = (API.volume != null) ? API.volume : 1;
            var newVolume;

            if (event.which === UP || event.keyCode === UP) {
              newVolume = currentVolume + CHANGE_PER_PRESS;
              if (newVolume > 1) newVolume = 1;

              API.setVolume(newVolume);
              event.preventDefault();
            }
            else if (event.which === DOWN || event.keyCode === DOWN) {
              newVolume = currentVolume - CHANGE_PER_PRESS;
              if (newVolume < 0) newVolume = 0;

              API.setVolume(newVolume);
              event.preventDefault();
            }
          };

          scope.onSetVolume = function onSetVolume(newVolume) {
            scope.currentVolume = newVolume;

            // TODO: Save volume with LocalStorage
            // if it's not muted we save the default volume
            if (!isMuted) {
              scope.defaultVolume = newVolume;
            }
            else {
              // if was muted but the user changed the volume
              if (newVolume > 0) {
                scope.defaultVolume = newVolume;
              }
            }

            var percentValue = Math.round(newVolume * 100);
            if (percentValue == 0) {
              scope.muteIcon = {mute: true};
            }
            else if (percentValue > 0 && percentValue < 25) {
              scope.muteIcon = {level0: true};
            }
            else if (percentValue >= 25 && percentValue < 50) {
              scope.muteIcon = {level1: true};
            }
            else if (percentValue >= 50 && percentValue < 75) {
              scope.muteIcon = {level2: true};
            }
            else if (percentValue >= 75) {
              scope.muteIcon = {level3: true};
            }
          };

          scope.defaultVolume = 1;
          scope.currentVolume = scope.defaultVolume;
          scope.muteIcon = {level3: true};

          //TODO: get volume from localStorage

          scope.$watch(
            function () {
              return API.volume;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) {
                scope.onSetVolume(newVal);
              }
            }
          );
        }
      }
    }]
  );

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgVolumeBar
 * @restrict E
 * @description
 * Directive to display a vertical volume bar to control the volume.
 * This directive must be inside vg-volume directive and requires vg-mute-button to be displayed.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume>
 *            <vg-mute-button><vg-mute-button>
 *            <vg-volume-bar><vg-volume-bar>
 *        </vg-volume>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .run(
    ["$templateCache", function($templateCache) {
      $templateCache.put("vg-templates/vg-volume-bar",
        '<div class="verticalVolumeBar">\
          <div class="volumeBackground" ng-click="onClickVolume($event)" ng-mousedown="onMouseDownVolume()" ng-mouseup="onMouseUpVolume()" ng-mousemove="onMouseMoveVolume($event)" ng-mouseleave="onMouseLeaveVolume()">\
            <div class="volumeValue"></div>\
            <div class="volumeClickArea"></div>\
          </div>\
        </div>');
    }]
  )
  .directive("vgVolumeBar",
    ["VG_UTILS", function (VG_UTILS) {
      return {
        restrict: "E",
        require: "^videogular",
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'vg-templates/vg-volume-bar';
        },
        link: function (scope, elem, attr, API) {
          var isChangingVolume = false;
          var volumeBackElem = angular.element(elem[0].getElementsByClassName("volumeBackground"));
          var volumeValueElem = angular.element(elem[0].getElementsByClassName("volumeValue"));

          scope.onClickVolume = function onClickVolume(event) {
            event = VG_UTILS.fixEventOffset(event);
            var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
            var value = event.offsetY * 100 / volumeHeight;
            var volValue = 1 - (value / 100);

            API.setVolume(volValue);
          };

          scope.onMouseDownVolume = function onMouseDownVolume() {
            isChangingVolume = true;
          };

          scope.onMouseUpVolume = function onMouseUpVolume() {
            isChangingVolume = false;
          };

          scope.onMouseLeaveVolume = function onMouseLeaveVolume() {
            isChangingVolume = false;
          };

          scope.onMouseMoveVolume = function onMouseMoveVolume(event) {
            if (isChangingVolume) {
              event = VG_UTILS.fixEventOffset(event);
              var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
              var value = event.offsetY * 100 / volumeHeight;
              var volValue = 1 - (value / 100);

              API.setVolume(volValue);
            }
          };

          scope.updateVolumeView = function updateVolumeView(value) {
            value = value * 100;
            volumeValueElem.css("height", value + "%");
            volumeValueElem.css("top", (100 - value) + "%");
          };

          scope.onChangeVisibility = function onChangeVisibility(value) {
            elem.css("visibility", value);
          };

          elem.css("visibility", scope.volumeVisibility);

          scope.$watch("volumeVisibility", scope.onChangeVisibility);

          scope.$watch(
            function () {
              return API.volume;
            },
            function (newVal, oldVal) {
              if (newVal != oldVal) {
                scope.updateVolumeView(newVal);
              }
            }
          );
        }
      }
    }]
  );

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgVolume
 * @restrict E
 * @description
 * Directive to control the volume.
 * This directive acts as a container and you will need other directives like vg-mutebutton and vg-volumebar to control the volume.
 * In mobile will be hided since volume API is disabled for mobile devices.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume></vg-volume>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
  .directive("vgVolume",
    ["VG_UTILS", function (VG_UTILS) {
      return {
        restrict: "E",
        link: function (scope, elem, attr) {
          scope.onMouseOverVolume = function onMouseOverVolume() {
            scope.$evalAsync(function() {
              scope.volumeVisibility = "visible";
            });
          };

          scope.onMouseLeaveVolume = function onMouseLeaveVolume() {
            scope.$evalAsync(function() {
              scope.volumeVisibility = "hidden";
            });
          };

          // We hide volume controls on mobile devices
          if (VG_UTILS.isMobileDevice()) {
            elem.css("display", "none");
          }
          else {
            scope.volumeVisibility = "hidden";

            elem.bind("mouseover", scope.onMouseOverVolume);
            elem.bind("mouseleave", scope.onMouseLeaveVolume);
          }
        }
      }
    }]
  );

///#source 1 1 /ngApps/libs/3P/videogular/vg-overlay-play.js
/**
 * @license videogular v1.1.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.overlayplay.directive:vgOverlayPlay
 * @restrict E
 * @description
 * Shows a big play button centered when player is paused or stopped.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-overlay-play></vg-overlay-play>
 * </videogular>
 * </pre>
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.overlayplay", [])
  .run(
    ["$templateCache", function($templateCache) {
      $templateCache.put("vg-templates/vg-overlay-play",
        '<div class="overlayPlayContainer" ng-click="onClickOverlayPlay()">\
          <div class="iconButton" ng-class="overlayPlayIcon"></div>\
        </div>');
    }]
  )
	.directive(
	"vgOverlayPlay",
	["VG_STATES", function (VG_STATES) {
		return {
			restrict: "E",
			require: "^videogular",
      templateUrl: function(elem, attrs) {
        return attrs.vgTemplate || 'vg-templates/vg-overlay-play';
      },
			link: function (scope, elem, attr, API) {
        scope.onChangeState = function onChangeState(newState) {
					switch (newState) {
						case VG_STATES.PLAY:
							scope.overlayPlayIcon = {};
							break;

						case VG_STATES.PAUSE:
							scope.overlayPlayIcon = {play: true};
							break;

						case VG_STATES.STOP:
							scope.overlayPlayIcon = {play: true};
							break;
					}
				};

				scope.onClickOverlayPlay = function onClickOverlayPlay(event) {
					API.playPause();
				};

				scope.overlayPlayIcon = {play: true};

				scope.$watch(
					function () {
						return API.currentState;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
              scope.onChangeState(newVal);
						}
					}
				);
			}
		}
	}
	]);


///#source 1 1 /ngApps/libs/3P/videogular/vg-poster.js
/**
 * @license videogular v1.1.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.poster.directive:vgPoster
 * @restrict E
 * @description
 * Shows an image when player hasn't been played or has been completed a video.
 * <pre>
 * <videogular vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-poster vg-url='config.plugins.poster.url'></vg-poster>
 * </videogular>
 * </pre>
 *
 * @param {string} vgUrl String with a scope name variable. URL to an image supported by the img tag.
 * **This parameter is required.**
 *
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.poster", [])
  .run(
    ["$templateCache", function($templateCache) {
      $templateCache.put("vg-templates/vg-poster",
        '<img ng-src="{{vgUrl}}" ng-class="API.currentState">');
    }]
  )
	.directive("vgPoster",
    [function () {
      return {
        restrict: "E",
        require: "^videogular",
        scope: {
          vgUrl: "=?"
        },
        templateUrl: function(elem, attrs) {
          return attrs.vgTemplate || 'vg-templates/vg-poster';
        },
        link: function (scope, elem, attr, API) {
          scope.API = API;

          if (API.isConfig) {
            scope.$watch("API.config",
              function() {
                if (scope.API.config) {
                  scope.vgUrl = scope.API.config.plugins.poster.url;
                }
              }
            );
          }
        }
      }
    }]
  );

///#source 1 1 /ngApps/libs/3P/videogular/vg-buffering.js
/**
 * @license videogular v1.1.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.buffering.directive:vgBuffering
 * @restrict E
 * @description
 * Shows a spinner when Videogular is buffering or preparing the video player.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-buffering></vg-buffering>
 * </videogular>
 * </pre>
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.buffering", [])
  .run(
    ["$templateCache", function($templateCache) {
      $templateCache.put("vg-templates/vg-buffering",
        '<div class="bufferingContainer">\
          <div ng-class="spinnerClass" class="loadingSpinner"></div>\
        </div>');
    }]
  )
	.directive(
	"vgBuffering",
	["VG_STATES", "VG_UTILS", function (VG_STATES, VG_UTILS) {
		return {
			restrict: "E",
			require: "^videogular",
      templateUrl: function(elem, attrs) {
        return attrs.vgTemplate || 'vg-templates/vg-buffering';
      },
			link: function (scope, elem, attr, API) {
        scope.showSpinner = function showSpinner() {
					scope.spinnerClass = {stop: API.isBuffering};
					elem.css("display", "block");
				};

        scope.hideSpinner = function hideSpinner() {
					scope.spinnerClass = {stop: API.isBuffering};
					elem.css("display", "none");
				};

        scope.setState = function setState(isBuffering) {
					if (isBuffering) {
            scope.showSpinner();
					}
					else {
            scope.hideSpinner();
					}
				};

        scope.onStateChange = function onStateChange(state) {
					if (state == VG_STATES.STOP) {
            scope.hideSpinner();
					}
				};

        scope.onPlayerReady = function onPlayerReady(isReady) {
					if (isReady) {
            scope.hideSpinner();
					}
				};

        scope.showSpinner();

				// Workaround for issue #16: https://github.com/2fdevs/videogular/issues/16
				if (VG_UTILS.isMobileDevice()) {
          scope.hideSpinner();
				}
				else {
					scope.$watch(
						function () {
							return API.isReady;
						},
						function (newVal, oldVal) {
							if (API.isReady == true || newVal != oldVal) {
                scope.onPlayerReady(newVal);
							}
						}
					);
				}

				scope.$watch(
					function () {
						return API.currentState;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
              scope.onStateChange(newVal);
						}
					}
				);

				scope.$watch(
					function () {
						return API.isBuffering;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
              scope.setState(newVal);
						}
					}
				);
			}
		}
	}
	]);

