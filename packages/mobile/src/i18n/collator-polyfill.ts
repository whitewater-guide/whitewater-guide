/* eslint-disable */
if (!Intl.Collator) {
  /**
   * create a stub
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
   * @param {String|Array} [locales]
   * @param {Object} [options]
   * @param {String} [options.localeMatcher]
   * @param {String} [options.usage]
   * @param {String} [options.sensitivity]
   * @param {Boolean} [options.ignorePunctuation]
   * @param {Boolean} [options.numeric]
   * @param {Boolean} [options.caseFirst]
   */
  function Collator(locales, options) {
    if (typeof locales === 'string') {
      locales = [locales];
    }

    this.locales = (locales || []).slice(0);

    options = options || {};
    this.options = {
      localeMatcher:
        options.localeMatcher !== undefined
          ? options.localeMatcher
          : 'best fit',
      usage: options.usage !== undefined ? options.usage : 'sort',
      sensitivity:
        options.sensitivity !== undefined ? options.sensitivity : 'variant',
      ignorePunctuation:
        options.ignorePunctuation !== undefined
          ? options.ignorePunctuation
          : false,
      numeric: options.numeric !== undefined ? options.numeric : false,
      caseFirst: options.caseFirst !== undefined ? options.caseFirst : false,
    };
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/supportedLocalesOf
   * @param {String|Array} locales
   * @param {Object} options
   * @returns {Array}
   */
  Collator.supportedLocalesOf = function (locales, options) {
    console.warn('The function Collator.supportedLocalesOf is only a stub.');
    return [];
  };

  // prototyping
  Collator.prototype = Object.create(Object.prototype, {
    /**
     * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
     * @var {Array}
     */
    locales: {
      value: true,
      enumerable: false,
      configurable: false,
      writable: true,
    },

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator
     * @var {Object}
     */
    options: {
      value: true,
      enumerable: false,
      configurable: false,
      writable: true,
    },
  });

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/format
   * @param {String} string1
   * @param {String} string2
   * @returns {Number}
   */
  Collator.prototype.compare = function (string1, string2) {
    if (typeof string1 !== 'string' || typeof string2 !== 'string') {
      return NaN;
    }

    if (string1 === string2) {
      return 0;
    }

    if (string1 < string2) {
      return -1;
    }

    return 1;
  };

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/resolvedOptions
   * @returns {{locale: String, usage: String, sensitivity: String, ignorePunctuation: Boolean, collation: undefined, numeric: Boolean, caseFirst: Boolean}}
   */
  Collator.prototype.resolvedOptions = function () {
    let first;
    if (this.locales.length > 0) {
      first = this.locales[0];
    }

    return {
      locale: first,
      usage: this.options.usage,
      sensitivity: this.options.sensitivity,
      ignorePunctuation: this.options.ignorePunctuation,
      collation: undefined,
      numeric: this.options.numeric,
      caseFirst: this.options.caseFirst,
    };
  };

  Intl.Collator = Collator;
}
