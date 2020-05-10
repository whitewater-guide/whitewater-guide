export var calculateLabelTopPosition = function calculateLabelTopPosition(
  labelHeight,
) {
  var height =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var optionalPadding =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var customHeight = height > 0 ? height : 0;
  return Math.floor((customHeight - labelHeight) / 2 + optionalPadding);
};
export var calculateInputHeight = function calculateInputHeight(labelHeight) {
  var height =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var minHeight = arguments.length > 2 ? arguments[2] : undefined;
  var finalHeight = height > 0 ? height : labelHeight;
  if (height > 0) return height;
  return finalHeight < minHeight ? minHeight : finalHeight;
};
export var calculatePadding = function calculatePadding(props) {
  var height = props.height,
    _props$multiline = props.multiline,
    multiline = _props$multiline === void 0 ? false : _props$multiline;
  var result = 0;
  if (multiline) {
    if (height && multiline) {
      result = calculateTextAreaPadding(props);
    } else {
      result = calculateInputPadding(props);
    }
  }
  return Math.max(0, result);
};
var calculateTextAreaPadding = function calculateTextAreaPadding(props) {
  var dense = props.dense;
  return dense ? 10 : 20;
};
var calculateInputPadding = function calculateInputPadding(_ref) {
  var topPosition = _ref.topPosition,
    fontSize = _ref.fontSize,
    multiline = _ref.multiline,
    scale = _ref.scale,
    dense = _ref.dense,
    offset = _ref.offset,
    isAndroid = _ref.isAndroid;
  var refFontSize = scale * fontSize;
  var result = Math.floor(topPosition / 2);
  result =
    result +
    Math.floor((refFontSize - fontSize) / 2) -
    (scale < 1 ? offset / 2 : 0);
  if (multiline && isAndroid)
    result = Math.min(dense ? offset / 2 : offset, result);
  return result;
};
export var adjustPaddingOut = function adjustPaddingOut(_ref2) {
  var pad = _ref2.pad,
    multiline = _ref2.multiline,
    label = _ref2.label,
    scale = _ref2.scale,
    height = _ref2.height,
    fontSize = _ref2.fontSize,
    dense = _ref2.dense,
    offset = _ref2.offset,
    isAndroid = _ref2.isAndroid;
  var refFontSize = scale * fontSize;
  var result = pad;
  if (height) {
    return {
      paddingTop: Math.max(0, (height - fontSize) / 2),
      paddingBottom: Math.max(0, (height - fontSize) / 2),
    };
  }
  if (!isAndroid && multiline) {
    if (dense) {
      if (label) {
        result += scale < 1 ? Math.min(offset, (refFontSize / 2) * scale) : 0;
      } else {
        result += 0;
      }
    }
    if (!dense) {
      if (label) {
        result +=
          scale < 1
            ? Math.min(offset, refFontSize * scale)
            : Math.min(offset / 2, refFontSize * scale);
      } else {
        result += scale < 1 ? Math.min(offset / 2, refFontSize * scale) : 0;
      }
    }
    result = Math.floor(result);
  }
  return { paddingTop: result, paddingBottom: result };
};
export var adjustPaddingFlat = function adjustPaddingFlat(_ref3) {
  var pad = _ref3.pad,
    scale = _ref3.scale,
    multiline = _ref3.multiline,
    label = _ref3.label,
    height = _ref3.height,
    offset = _ref3.offset,
    dense = _ref3.dense,
    fontSize = _ref3.fontSize,
    isAndroid = _ref3.isAndroid,
    styles = _ref3.styles;
  var result = pad;
  var topResult = result;
  var bottomResult = result;
  var paddingTop = styles.paddingTop,
    paddingBottom = styles.paddingBottom;
  var refFontSize = scale * fontSize;
  if (!multiline) {
    if (label) {
      return { paddingTop: paddingTop, paddingBottom: paddingBottom };
    }
    return { paddingTop: result, paddingBottom: result };
  }
  if (label) {
    topResult = paddingTop;
    bottomResult = paddingBottom;
    if (!isAndroid) {
      if (dense) {
        topResult +=
          scale < 1
            ? Math.min(result, refFontSize * scale) - result / 2
            : Math.min(result, refFontSize * scale) - result / 2;
      }
      if (!dense) {
        topResult +=
          scale < 1
            ? Math.min(offset / 2, refFontSize * scale)
            : Math.min(result, refFontSize * scale) - offset / 2;
      }
    }
    topResult = Math.floor(topResult);
  } else {
    if (height) {
      return {
        paddingTop: Math.max(0, (height - fontSize) / 2),
        paddingBottom: Math.max(0, (height - fontSize) / 2),
      };
    }
    if (!isAndroid) {
      if (dense) {
        result +=
          scale < 1
            ? Math.min(offset / 2, (fontSize / 2) * scale)
            : Math.min(offset / 2, scale);
      }
      if (!dense) {
        result +=
          scale < 1
            ? Math.min(offset, fontSize * scale)
            : Math.min(fontSize, (offset / 2) * scale);
      }
      result = Math.floor(result);
      topResult = result;
      bottomResult = result;
    }
  }
  return {
    paddingTop: Math.max(0, topResult),
    paddingBottom: Math.max(0, bottomResult),
  };
};
export var interpolatePlaceholder = function interpolatePlaceholder(
  labeled,
  hasActiveOutline,
) {
  return labeled.interpolate({
    inputRange: [0, 1],
    outputRange: [hasActiveOutline ? 0 : 1, 1],
  });
};