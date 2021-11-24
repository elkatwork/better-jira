/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/better-jira.js":
/*!*******************************!*\
  !*** ./src/js/better-jira.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_DetailResizer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/DetailResizer */ "./src/js/components/DetailResizer.js");
/* harmony import */ var _components_BetterJira__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/BetterJira */ "./src/js/components/BetterJira.js");


var betterJira = _components_BetterJira__WEBPACK_IMPORTED_MODULE_1__["default"].initialize();
_components_DetailResizer__WEBPACK_IMPORTED_MODULE_0__["default"].run();
document.addEventListener('better-jira:updated', function (event) {
  console.log('🔧: ', event.detail);
  betterJira.update(event);
});

/***/ }),

/***/ "./src/js/components/BetterJira.js":
/*!*****************************************!*\
  !*** ./src/js/components/BetterJira.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BetterJira)
/* harmony export */ });
/* harmony import */ var _Standup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Standup */ "./src/js/components/Standup.js");
/* harmony import */ var _Jira__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Jira */ "./src/js/components/Jira.js");
/* harmony import */ var _OpenGithubInNewTab__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./OpenGithubInNewTab */ "./src/js/components/OpenGithubInNewTab.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





var BetterJira = /*#__PURE__*/function () {
  function BetterJira() {
    var _this = this;

    _classCallCheck(this, BetterJira);

    this.data = {};
    this.Storage = chrome.storage.sync;
    this.running = true;

    if (_Jira__WEBPACK_IMPORTED_MODULE_1__["default"].isNotPresent()) {
      this.running = false;
      return;
    }

    this._initialColumnResize();

    this.Storage.get('standup', function (storage) {
      _this._initiateStandup(storage.standup);
    });

    this._openGithubLinksInNewTabs();
  }

  _createClass(BetterJira, [{
    key: "update",
    value: function update(event) {
      this._updateColumnWidths(event.detail);

      this._initiateStandup(event.detail.standup);
    }
  }, {
    key: "_updateColumnWidths",
    value: function _updateColumnWidths(detail) {
      if (!this.running) {
        return;
      }

      if (!detail.enabled) {
        document.body.classList.remove('better-jira');
        return;
      }

      document.body.classList.add('better-jira');

      this._getPreferredWidth(detail);
    }
  }, {
    key: "_ifEnabled",
    value: function _ifEnabled(enabledCallback) {
      var disabledCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      if (!this.running) {
        return;
      }

      this.Storage.get('enabled', function (storage) {
        if (!storage.enabled) {
          disabledCallback();
          return;
        }

        enabledCallback();
      });
    }
  }, {
    key: "_initialColumnResize",
    value: function _initialColumnResize() {
      var _this2 = this;

      if (!this.running) {
        return;
      }

      setTimeout(function () {
        if (_Jira__WEBPACK_IMPORTED_MODULE_1__["default"].hasNotLoadedSwimlanes()) {
          // console.log('🔧: Swimlanes not present, waiting 100ms.');
          return _this2._initialColumnResize();
        } // console.log('🔧: Swimlanes are present, resizing now.');


        var enabled = function enabled() {
          document.body.classList.add('better-jira');

          _this2.Storage.get('columnWidth', _this2._getPreferredWidth.bind(_this2));

          _this2._protectAgainstReactBoardReloading();
        }; //-- Disallow setting columns if the plugin is not enabled


        var disabled = function disabled() {
          document.body.classList.remove('better-jira');
        };

        _this2._ifEnabled(enabled, disabled);
      }, 100);
    }
  }, {
    key: "_getPreferredWidth",
    value: function _getPreferredWidth(storage) {
      if (!this.running) {
        return;
      }

      this.data.columnWidth = storage.columnWidth;

      if (isNaN(this.data.columnWidth)) {
        this.data.columnWidth = 200;
      }

      this._setPreferredWidth();
    }
  }, {
    key: "_setPreferredWidth",
    value: function _setPreferredWidth() {
      if (!this.running) {
        return;
      }

      var preferredWidth, columnCount, padding, width;
      preferredWidth = this.data.columnWidth;
      columnCount = _Jira__WEBPACK_IMPORTED_MODULE_1__["default"].columns().length;
      padding = columnCount * 12;
      width = columnCount * preferredWidth + padding;

      if (width < 10) {
        return;
      } //-- Handle Smaller Boards


      if (width < window.innerWidth) {
        var container = document.querySelector('#gh, #content > .aui-page-panel');
        width = parseInt(container.offsetWidth) - parseInt(window.getComputedStyle(container, null).getPropertyValue('padding-left'));
      }

      try {
        var items = {
          poolWidth: width
        };
        this.Storage.set(items);

        this._setPoolWidth(width);
      } catch (e) {
        console.error(e);
      }
    }
  }, {
    key: "_setPoolWidth",
    value: function _setPoolWidth(width) {
      document.documentElement.style.setProperty('--viewport-width', "".concat(width, "px"));
    }
  }, {
    key: "_setDetailViewWidth",
    value: function _setDetailViewWidth(width) {
      document.documentElement.style.setProperty('--detail-view-width', width);
    }
  }, {
    key: "_initiateStandup",
    value: function _initiateStandup(config) {
      _Standup__WEBPACK_IMPORTED_MODULE_0__["default"].run(config);
    }
  }, {
    key: "_protectAgainstReactBoardReloading",
    value: function _protectAgainstReactBoardReloading() {
      var _this3 = this;

      var mutationObserver = new MutationObserver(function (mutations) {
        var contentHasBeenDeleted = mutations.find(function (mutation) {
          if (mutation.removedNodes < 1) {
            return false;
          }

          var removedNodes = _toConsumableArray(mutation.removedNodes);

          return removedNodes.find(function (node) {
            return node.id === 'ghx-pool-column';
          });
        });

        if (contentHasBeenDeleted) {
          mutationObserver.disconnect();

          _this3._initialColumnResize();
        }
      });
      mutationObserver.observe(_Jira__WEBPACK_IMPORTED_MODULE_1__["default"].content(), {
        childList: true,
        subtree: true
      });
    }
  }, {
    key: "_openGithubLinksInNewTabs",
    value: function _openGithubLinksInNewTabs() {
      _OpenGithubInNewTab__WEBPACK_IMPORTED_MODULE_2__["default"].initialize();
    }
  }], [{
    key: "initialize",
    value: function initialize() {
      return new this();
    }
  }]);

  return BetterJira;
}();



/***/ }),

/***/ "./src/js/components/DetailResizer.js":
/*!********************************************!*\
  !*** ./src/js/components/DetailResizer.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Jira__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Jira */ "./src/js/components/Jira.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var DetailResizer = /*#__PURE__*/function () {
  function DetailResizer() {
    _classCallCheck(this, DetailResizer);

    this.id = 'ghx-detail-view';
    this.Storage = chrome.storage.sync;
    this.listening = false;
    this.running = true;
    this.manageMouseListener = this.manageMouse.bind(this);
  }

  _createClass(DetailResizer, [{
    key: "run",
    value: function run() {
      var _this = this;

      if (_Jira__WEBPACK_IMPORTED_MODULE_0__["default"].isNotPresent()) {
        this.running = false;
        return;
      }

      var detailView = document.getElementById(this.id);

      if (!detailView) {
        this.running = false;
        return;
      }

      detailView.addEventListener('mouseenter', function () {
        if (detailView.querySelector('.better-resize') !== null) {
          return;
        }

        var resizer = document.createElement('div');
        resizer.classList.add('better-resize');
        detailView.appendChild(resizer);
        detailView.querySelector('.better-resize').addEventListener('mousedown', function (event) {
          event.preventDefault();

          if (event.button === 2) {
            return;
          }

          document.addEventListener('mousemove', _this.manageMouseListener);
          _this.listening = true;
        });
        document.addEventListener('mouseup', function (event) {
          if (!_this.listening) {
            return;
          }

          document.removeEventListener('mousemove', _this.manageMouseListener);
          _this.listening = false;

          _this.saveDetailViewWidth();
        });
      }); // detailView.addEventListener('mouseleave', () => {
      //   console.log('You are now exiting');
      //   detailView.querySelector('.better-resize').remove();
      // });
    }
  }, {
    key: "manageMouse",
    value: function manageMouse(event) {
      if (!this.running) {
        return;
      }

      var width = window.innerWidth - event.pageX + 2;
      document.documentElement.style.setProperty('--detail-view-width', "".concat(width, "px"));
    }
  }, {
    key: "saveDetailViewWidth",
    value: function saveDetailViewWidth() {
      if (!this.running) {
        return;
      }

      console.log('🔧: Detail Width', document.documentElement.style.getPropertyValue('--detail-view-width'));
      this.Storage.set({
        detailViewWidth: document.documentElement.style.getPropertyValue('--detail-view-width')
      });
    }
  }]);

  return DetailResizer;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new DetailResizer());

/***/ }),

/***/ "./src/js/components/Jira.js":
/*!***********************************!*\
  !*** ./src/js/components/Jira.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Jira = /*#__PURE__*/function () {
  function Jira() {
    _classCallCheck(this, Jira);

    this._isPresent = null;
  }

  _createClass(Jira, [{
    key: "isPresent",
    value: function isPresent() {
      if (this._isPresent !== null) {
        return this._isPresent;
      }

      try {
        var jira = document.querySelector('meta[name="application-name"]');
        return this._isPresent = jira.content === 'JIRA';
      } catch (e) {
        return this._isPresent = false;
      }
    }
  }, {
    key: "isNotPresent",
    value: function isNotPresent() {
      return !this.isPresent();
    }
  }, {
    key: "hasLoadedSwimlanes",
    value: function hasLoadedSwimlanes() {
      return !!document.querySelector('.ghx-swimlane, #ghx-mapping, #jira-board > div > div');
    }
  }, {
    key: "hasNotLoadedSwimlanes",
    value: function hasNotLoadedSwimlanes() {
      return !this.hasLoadedSwimlanes();
    }
  }, {
    key: "columnsContainer",
    value: function columnsContainer() {
      return document.querySelector('.ghx-swimlane > .ghx-columns, #ghx-mapping, .aui-page-panel-content > #jira-board');
    }
  }, {
    key: "columns",
    value: function columns() {
      return this.columnsContainer().querySelectorAll('.ghx-column, .ghx-column-wrapper, [class*="hook__column"]');
    }
  }, {
    key: "content",
    value: function content() {
      return document.getElementById('content');
    }
  }]);

  return Jira;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Jira());

/***/ }),

/***/ "./src/js/components/OpenGithubInNewTab.js":
/*!*************************************************!*\
  !*** ./src/js/components/OpenGithubInNewTab.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ OpenGithubInNewTab)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OpenGithubInNewTab = /*#__PURE__*/function () {
  function OpenGithubInNewTab() {
    var _this = this;

    _classCallCheck(this, OpenGithubInNewTab);

    document.addEventListener('click', function (click) {
      var githubLink = click.target.closest('.pullrequest-link, .repository-link, .branch-link, .create-pullrequest-link, .changesetid, .filename a, .filerow a.more-files-info');

      if (!githubLink) {
        return;
      }

      click.preventDefault();

      if (githubLink.classList.contains('create-pullrequest-link')) {
        _this.enableBetterCreatePullRequestLink(githubLink);
      }

      var newWindow = window.open(githubLink.href, '_blank');
      newWindow.opener = null;
    });
  }

  _createClass(OpenGithubInNewTab, [{
    key: "enableBetterCreatePullRequestLink",
    value: function enableBetterCreatePullRequestLink(githubLink) {
      try {
        var branchName = githubLink.parentElement.parentElement.querySelector('.branch-link').title;
        githubLink.href = "".concat(githubLink.href, "/master...").concat(encodeURI(branchName));
      } catch (e) {
        console.warn(e);
      }
    }
  }], [{
    key: "initialize",
    value: function initialize() {
      return new this();
    }
  }]);

  return OpenGithubInNewTab;
}();



/***/ }),

/***/ "./src/js/components/Standup.js":
/*!**************************************!*\
  !*** ./src/js/components/Standup.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Jira__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Jira */ "./src/js/components/Jira.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Standup = /*#__PURE__*/function () {
  function Standup() {
    _classCallCheck(this, Standup);

    this.cssClass = 'standup';
    this.instructionsCssClass = 'BetterJira-instructions';
    this.data = {};
    this.running = true;
  }

  _createClass(Standup, [{
    key: "run",
    value: function run(state) {
      if (_Jira__WEBPACK_IMPORTED_MODULE_0__["default"].isNotPresent()) {
        this.running = false;
        return;
      }

      if (!state) {
        this._cleanupStandup();

        return;
      }

      this.initializeStandup();
    }
  }, {
    key: "initializeStandup",
    value: function initializeStandup() {
      var _this = this;

      if (!this.running) {
        return;
      }

      this._listener = function (click) {
        var closeButton = click.target.closest('[data-standup-close]');

        if (!closeButton) {
          return;
        }

        chrome.storage.sync.set({
          standup: false
        }, function () {
          _this._cleanupStandup();
        });
      };

      document.addEventListener('click', this._listener);
      window.standup = true; //-- Add `standup` class to the body

      document.body.classList.add(this.cssClass); //-- Add Instructions element

      var instructionsEl = document.createElement('div');
      instructionsEl.setAttribute('data-standup-close', '');
      instructionsEl.classList.add(this.instructionsCssClass);
      instructionsEl.innerHTML = "\n      <span class=\"text\">Close Standup Mode <span class=\"close\">&nbsp;&plus;&nbsp;</span></span>\n    ";
      document.body.appendChild(instructionsEl);
    }
  }, {
    key: "_cleanupStandup",
    value: function _cleanupStandup() {
      document.body.classList.remove(this.cssClass);
      window.standup = false; //-- Clear the event listener

      document.removeEventListener('click', this._listener); //-- remove Instructions element

      var instructions = document.querySelector(".".concat(this.instructionsCssClass));

      if (instructions !== null) {
        instructions.remove();
      }
    }
  }]);

  return Standup;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Standup());

/***/ }),

/***/ "./src/sass/content.scss":
/*!*******************************!*\
  !*** ./src/sass/content.scss ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/sass/standup.scss":
/*!*******************************!*\
  !*** ./src/sass/standup.scss ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/sass/popup.scss":
/*!*****************************!*\
  !*** ./src/sass/popup.scss ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/dist/js/better-jira": 0,
/******/ 			"dist/css/popup": 0,
/******/ 			"dist/css/standup": 0,
/******/ 			"dist/css/content": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["dist/css/popup","dist/css/standup","dist/css/content"], () => (__webpack_require__("./src/js/better-jira.js")))
/******/ 	__webpack_require__.O(undefined, ["dist/css/popup","dist/css/standup","dist/css/content"], () => (__webpack_require__("./src/sass/content.scss")))
/******/ 	__webpack_require__.O(undefined, ["dist/css/popup","dist/css/standup","dist/css/content"], () => (__webpack_require__("./src/sass/standup.scss")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["dist/css/popup","dist/css/standup","dist/css/content"], () => (__webpack_require__("./src/sass/popup.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;