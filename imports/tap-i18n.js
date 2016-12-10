import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { TAPi18n } from 'meteor/tap:i18n';

const transform = function(options, collectionTransform) {
  return (doc) => {
    if (options.transform) {
      doc = options.transform(doc);
    }
    else if (collectionTransform){
      doc = collectionTransform(doc);
    }

    if (!options.lang || !doc.i18n) {
      delete doc.i18n;
      return doc
    }

    doc = {...doc}; // protect original object.
    if (doc.i18n[options.lang]) {
      doc = {...doc, ...doc.i18n[options.lang]};
    }

    delete doc.i18n;

    return doc;
  }
};

const removeTrailingUndefs = function(arr) {
  while ((!_.isEmpty(arr)) && (_.isUndefined(_.last(arr)))) {
    arr.pop();
  }
  return arr;
};

const dialectOf = function(lang) {
  if ((typeof lang !== "undefined" && lang !== null) && lang.indexOf('-') >= 0) {
    return lang.replace(/-.*/, "");
  }
  return null;
};

class TAPi18nCollection extends Mongo.Collection {
  constructor(name, options) {
    super(name, options = {});
    this._base_language = "base_language" in options ? options["base_language"] : 'en';
  }

  i18nFields = [];//Names of fields that should be i18n'ed.

  attachI18Schema(schema){
    this.i18nFields = _.keys(schema.schema());
  }

  find(selector = {}, options = {}) {
    if (options.lang === undefined) {
      options.lang = TAPi18n.getLanguage();
    }

    // Allow for null language to return the full document.
    if (options.lang === null) {
      return super.find(selector, options);
    }

    if (options.lang !== this._base_language) {
      let strSelector = JSON.stringify(selector);

      for (let field in this.i18nFields) {
        strSelector = strSelector.replace(new RegExp(field, 'g'), `i18n.${options.lang}.${field}`);
      }
      selector = JSON.parse(strSelector);
    }

    const dialect_of = dialectOf(options.lang);
    const collection_base_language = this._base_language;

    const supported_languages = TAPi18n.conf.supported_languages || Object.keys(TAPi18n.languages_names);
    if ((typeof options.lang !== "undefined" && options.lang !== null) && !(supported_languages.indexOf(options.lang) >= 0)) {
      throw new Meteor.Error(400, `Not supported language "${options.lang}", are you subscribing to the collection "${this._name}" using the TAPi18n.subscribe and not Meteor.subscribe`);
    }

    const original_fields = options.fields || {};
    const i18n_fields = {...original_fields};

    if (!_.isEmpty(i18n_fields)) {
      // determine the projection kind
      // note that we don't need to address the case where {_id: 0}, since _id: 0
      // is not allowed for cursors returned from a publish function
      delete i18n_fields._id;
      const white_list_projection = _.first(_.values(i18n_fields)) === 1;
      if ("_id" in original_fields) {
        i18n_fields["_id"] = original_fields["_id"];
      }

      if (white_list_projection) {
        for (let i = 0; i < supported_languages.length; i++) {
          const lang = supported_languages[i];
          if (lang !== collection_base_language && ((lang === options.lang) || (lang === dialect_of))) {
            for (let field in original_fields) {
              if (field !== "_id" && field.indexOf('.') == -1 && this.i18nFields.indexOf(field) >= 0) {
                i18n_fields[`i18n.${lang}.${field}`] = 1;
              }
            }
          }
        }
      } else {
        // black list
        for (let j = 0; j < supported_languages.length; j++) {
          const lang = supported_languages[j];
          if (lang !== collection_base_language) {
            if (lang !== options.lang && lang !== dialect_of) {
              i18n_fields[`i18n.${lang}`] = 0;
            } else {
              for (let field in original_fields) {
                if (field !== "_id" && field.indexOf('.') == -1 && this.i18nFields.indexOf(field) >= 0) {
                  i18n_fields[`i18n.${lang}.${field}`] = 0;
                }
              }
            }
          }
        }
      }
    }
    else {
      for (let k = 0; k < supported_languages.length; k++) {
        const lang = supported_languages[k];
        if (lang !== collection_base_language && lang !== options.lang && lang !== dialect_of) {
          i18n_fields[`i18n.${lang}`] = 0;
        }
      }
    }

    return super.find(
      selector,
      {
        ...options,
        transform: transform(options, this._transform),
        fields: i18n_fields
      }
    );
  }

  findOne(selector, options = {}) {
    return this.find(selector, options).fetch()[0];
  }

  insertTranslations(doc, translations, callback){
    let data = {...doc};
    if (translations){
      for (let lang in translations){
        const supported_languages = TAPi18n.conf.supported_languages || Object.keys(TAPi18n.languages_names);
        if (supported_languages.indexOf(lang) == -1)
          throw new Meteor.Error(400, `Not supported language "${lang}", are you inserting into "${this._name}"`);
        if (lang === this._base_language) {
          data = {...data, ...translations[lang]};
          delete translations[lang];
        }
      }
      if (!_.isEmpty(translations))
        data = {...data, i18n: {...translations}};
    }
    return super.insert(data, callback);
  }

  updateTranslations(selector, translations, options, callback){
    if (_.isFunction(options)) {
      callback = options;
      options = undefined;
    }
    const updates = this.prepareUpdates(translations);
    return super.update(selector, {$set: updates}, options, callback);
  }

  upsertTranslations(selector, translations, options, callback){
    if (_.isFunction(options)) {
      callback = options;
      options = undefined;
    }
    const updates = this.prepareUpdates(translations);
    return super.upsert(selector, {$set: updates}, options, callback);
  }

  prepareUpdates(translations){
    let updates = {};
    if (translations){
      for (let lang in translations){
        const supported_languages = TAPi18n.conf.supported_languages || Object.keys(TAPi18n.languages_names);
        if (supported_languages.indexOf(lang) == -1)
          throw new Meteor.Error(400, `Not supported language "${lang}", are you updating "${this._name}"`);
        if (lang === this._base_language) {
          updates = {...updates, ...translations[lang]};
        }
        else {
          updates = {
            ...updates,
            ..._.object(
              _.map(
                translations[lang],
                (val, field) => {
                  let newField = this.i18nFields.indexOf(field) >= 0 ? `i18n.${lang}.${field}` : field;
                  return [newField, val];
                }
              )
            )
          };
        }
      }
    }
    return updates;
  }

}

TAPi18n.Collection = TAPi18nCollection;

TAPi18n.publish = function(name, handler, options) {
  if (name === null) {
    throw new Meteor.Error(500, "TAPi18n.publish doesn't support null publications");
  }

  let i18n_handler = function() {
    let args = [...arguments];
    let language = args.pop();
    // TAPi18n.setLanguage(language);
    // this.language = language;

    // Call the user handler without the language_tag argument
    let cursors = handler.apply(this, args);

    if ((typeof cursors !== "undefined" && cursors !== null)) {
      return cursors;
    }
  };

  // set the actual publish method
  return Meteor.publish.apply(this, [name, i18n_handler, options]);
};

TAPi18n.subscribe = function(name, language = null) {
  let params = Array.prototype.slice.call(arguments, 2);
  let callbacks;
  if (params.length) {
    let lastParam = params[params.length - 1];
    if (typeof lastParam === "function") {
      callbacks.onReady = params.pop();
    } else if (lastParam && (typeof lastParam.onReady === "function" || typeof lastParam.onError === "function")) {
      callbacks = params.pop();
    }
  }
  //Language is always last argument, see how it is handled in publish
  params.push(language || TAPi18n.getLanguage());
  return Meteor.subscribe.apply(this, removeTrailingUndefs([name, ...params, callbacks]));
};

if (Meteor.isServer) {
  TAPi18n.setLanguage = function(language) {
    this._current_language = language;
  };
  TAPi18n.getLanguage = function() {
    return this._current_language;
  };
}
