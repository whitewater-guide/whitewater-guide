import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import create from 'lodash/create';
import mapKeys from 'lodash/mapKeys';
import {LANGUAGES} from './languages';

const transform = function (options, collectionTransform) {
  return (doc) => {
    if (options.transform) {
      doc = options.transform(doc);
    }
    else if (collectionTransform) {
      doc = collectionTransform(doc);
    }

    if (!options.lang || !doc.i18n) {
      delete doc.i18n;
      return doc
    }

    const originalDoc = doc;
    doc = {...doc}; // protect original object.
    if (doc.i18n[options.lang]) {
      doc = {...doc, ...doc.i18n[options.lang]};
    }

    delete doc.i18n;

    doc = create(Object.getPrototypeOf(originalDoc), doc);

    return doc;
  }
};

const dialectOf = function (lang) {
  if ((typeof lang !== "undefined" && lang !== null) && lang.indexOf('-') >= 0) {
    return lang.replace(/-.*/, "");
  }
  return null;
};

const SUPPORTED_LANGUAGES = Object.keys(LANGUAGES);

export class I18nCollection extends Mongo.Collection {
  constructor(name, options) {
    super(name, options = {});
    this._base_language = "base_language" in options ? options["base_language"] : 'en';
  }

  i18nFields = [];//Names of fields that should be i18n'ed.

  attachI18Schema(schema) {
    this.i18nFields = Object.keys(schema);
  }

  find(selector = {}, options = {}) {
    if (options.lang === undefined) {
      options.lang = this._base_language;
    }

    // Allow for null language to return the full document.
    if (!options.lang) {
      return super.find(selector, options);
    }

    if (options.lang !== this._base_language) {
      selector = mapKeys(selector, (val, key) => {
        return this.i18nFields.includes(key) ? `i18n.${options.lang}.${key}` : key;
      });
    }

    const dialect_of = dialectOf(options.lang);
    const collection_base_language = this._base_language;

    if ((typeof options.lang !== "undefined" && options.lang !== null) && !(SUPPORTED_LANGUAGES.indexOf(options.lang) >= 0)) {
      throw new Meteor.Error(400, `Not supported language "${options.lang}"`);
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
        for (let i = 0; i < SUPPORTED_LANGUAGES.length; i++) {
          const lang = SUPPORTED_LANGUAGES[i];
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
        for (let j = 0; j < SUPPORTED_LANGUAGES.length; j++) {
          const lang = SUPPORTED_LANGUAGES[j];
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
      for (let k = 0; k < SUPPORTED_LANGUAGES.length; k++) {
        const lang = SUPPORTED_LANGUAGES[k];
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

  insertTranslations(doc, translations, callback) {
    let data = {...doc};
    if (translations) {
      if (translations.hasOwnProperty('undefined')) {
        translations[this._base_language] = translations['undefined'];
        delete translations['undefined'];
      }
      for (let lang in translations) {
        if (SUPPORTED_LANGUAGES.indexOf(lang) == -1)
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

  updateTranslations(selector, translations, options, callback) {
    if (_.isFunction(options)) {
      callback = options;
      options = undefined;
    }
    const updates = this.prepareUpdates(translations);
    //Skip validation because it should be already done in method
    return super.update(selector, {$set: updates}, {...options, validate: false}, callback);
  }

  upsertTranslations(selector, translations, options, callback) {
    if (_.isFunction(options)) {
      callback = options;
      options = undefined;
    }
    const updates = this.prepareUpdates(translations);
    //Skip validation because it should be already done in method
    return super.upsert(selector, {$set: updates}, {...options, validate: false}, callback);
  }

  prepareUpdates(translations) {
    let updates = {};
    if (translations) {
      if (translations.hasOwnProperty('undefined')) {
        translations[this._base_language] = translations['undefined'];
        delete translations['undefined'];
      }
      for (let lang in translations) {
        if (SUPPORTED_LANGUAGES.indexOf(lang) === -1)
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