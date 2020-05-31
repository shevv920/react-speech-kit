'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  children: _propTypes2.default.func.isRequired,
  onEnd: _propTypes2.default.func
};

var defaultProps = {
  onEnd: function onEnd() {}
};

var SpeechSynthesis = function SpeechSynthesis(props) {
  var onEnd = props.onEnd,
      children = props.children;

  var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      voices = _useState2[0],
      setVoices = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      speaking = _useState4[0],
      setSpeaking = _useState4[1];

  var supported = !!window.speechSynthesis;

  var processVoices = function processVoices(voiceOptions) {
    setVoices(voiceOptions);
  };

  var getVoices = function getVoices() {
    // Firefox seems to have voices upfront and never calls the
    // voiceschanged event
    var voiceOptions = window.speechSynthesis.getVoices();
    if (voiceOptions.length > 0) {
      processVoices(voiceOptions);
      return;
    }

    window.speechSynthesis.onvoiceschanged = function (event) {
      voiceOptions = event.target.getVoices();
      processVoices(voiceOptions);
    };
  };

  var handleEnd = function handleEnd() {
    setSpeaking(false);
    onEnd();
  };

  (0, _react.useEffect)(function () {
    if (supported) {
      getVoices();
    }
  }, []);

  var speak = function speak() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _args$voice = args.voice,
        voice = _args$voice === undefined ? null : _args$voice,
        _args$text = args.text,
        text = _args$text === undefined ? '' : _args$text,
        _args$rate = args.rate,
        rate = _args$rate === undefined ? 1 : _args$rate,
        _args$pitch = args.pitch,
        pitch = _args$pitch === undefined ? 1 : _args$pitch,
        _args$volume = args.volume,
        volume = _args$volume === undefined ? 0.5 : _args$volume;

    setSpeaking(true);
    // Firefox won't repeat an utterance that has been
    // spoken, so we need to create a new instance each time
    var utterance = new window.SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.voice = voice;
    utterance.onend = handleEnd;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    window.speechSynthesis.speak(utterance);
  };

  var cancel = function cancel() {
    setSpeaking(false);
    window.speechSynthesis.cancel();
  };

  return children({
    supported: supported,
    speak: speak,
    speaking: speaking,
    cancel: cancel,
    voices: voices
  });
};

SpeechSynthesis.propTypes = propTypes;
SpeechSynthesis.defaultProps = defaultProps;

exports.default = (0, _react.memo)(SpeechSynthesis);