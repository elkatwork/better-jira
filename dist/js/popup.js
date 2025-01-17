/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*************************!*\
  !*** ./src/js/popup.js ***!
  \*************************/
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Popup = /*#__PURE__*/function () {
  function Popup() {
    _classCallCheck(this, Popup);

    this.Storage = chrome.storage.sync;
    this.data = {};
    this.defaults = {
      columnWidth: 200,
      enabled: true,
      standup: false,
      updatedEvent: 'better-jira:updated'
    };
    this.loadListener = this.boot.bind(this);
    window.addEventListener('load', this.loadListener);
  }

  _createClass(Popup, [{
    key: "boot",
    value: function boot() {
      window.removeEventListener('load', this.loadListener);
      this.setDefaults();
      this.handleFormEvents();
    }
  }, {
    key: "setDefaults",
    value: function setDefaults() {
      var _this = this;

      this.Storage.get('columnWidth', function (storage) {
        console.log('storage', storage);
        var value = storage.columnWidth;
        console.log('columnWidth from Storage', value);

        if (!value) {
          value = _this.defaults.columnWidth;

          _this.Storage.set({
            columnWidth: value
          });
        }

        _this.data.columnWidth = value;
        document.getElementById('columnWidth').value = _this.data.columnWidth;
      });
      this.Storage.get('enabled', function (storage) {
        var value = storage.enabled;

        if (value === undefined) {
          value = _this.defaults.enabled;

          _this.Storage.set({
            enabled: value
          });
        }

        _this.data.enabled = value;
        console.log('enabled storage', storage);
        document.getElementById('enabled').checked = !!value;
      });
      this.Storage.get('standup', function (storage) {
        var value = storage.standup;

        if (value === undefined) {
          value = _this.defaults.standup;

          _this.Storage.set({
            standup: value
          });
        }

        _this.data.standup = value;
        console.log('standup storage', storage);
        document.getElementById('standup').checked = !!value;
      });
    }
  }, {
    key: "handleFormEvents",
    value: function handleFormEvents() {
      var _this2 = this,
          _arguments = arguments;

      //-- Close the window
      var close = document.getElementById('close');
      close.addEventListener('click', function (event) {
        window.close();
      }); //-- Trigger Enabled (as a 1-click event)

      var enabled = document.getElementById('enabled');
      enabled.addEventListener('click', function (event) {
        _this2.data.enabled = enabled.checked;

        _this2.save();
      }); //-- Trigger Standup (as a 1-click event)

      var standup = document.getElementById('standup');
      standup.addEventListener('click', function (event) {
        console.log('you clicked it!', standup.checked, event);
        _this2.data.standup = standup.checked;

        _this2.save();
      });
      document.getElementById('better-jira').addEventListener('submit', function (event) {
        event.preventDefault();
        console.log('form submission information', _arguments);
        _this2.data.columnWidth = document.getElementById('columnWidth').value;
        _this2.data.enabled = document.getElementById('enabled').checked;

        _this2.save();
      });
    }
  }, {
    key: "save",
    value: function save() {
      var _this3 = this;

      this.Storage.set({
        enabled: this.data.enabled
      }, function () {
        _this3.Storage.set({
          columnWidth: _this3.data.columnWidth
        }, function () {
          _this3.Storage.set({
            standup: _this3.data.standup
          }, _this3.refresh.bind(_this3));
        });
      });
    }
  }, {
    key: "refresh",
    value: function refresh() {
      var code = ["(function()", "{", "'use strict';", "let updateEvent = new CustomEvent('".concat(this.defaults.updatedEvent, "', {"), "detail: {", "columnWidth: ".concat(this.data.columnWidth, ","), "enabled: ".concat(this.data.enabled, ","), "standup: ".concat(this.data.standup, ","), "}", "});", "document.dispatchEvent(updateEvent);", "})();"];
      chrome.tabs.executeScript({
        code: code.join('')
      });
    }
  }]);

  return Popup;
}();

new Popup();
/******/ })()
;