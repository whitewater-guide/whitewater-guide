import cronParser from 'cron-parser';
import { Parser } from 'expr-eval';
import isArray from 'lodash/isArray';
import isFinite from 'lodash/isFinite';
import isInteger from 'lodash/isInteger';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import { Config, superstruct } from 'superstruct';
import isEmail from 'validator/lib/isEmail';
import isJSON from 'validator/lib/isJSON';
import isURL from 'validator/lib/isURL';
import isUUID from 'validator/lib/isUUID';
import matches from 'validator/lib/matches';

const SLUG_REGEX = /^[0-9a-zA-Z_\-]{3,64}$/;

const types: Config['types'] = {
  email: (value: any) => {
    const result = isString(value) && isEmail(value);
    return result || 'Incorrect e-mail address';
  },
  cron: (value: any) => {
    if (!isString(value) || value.length > 255) {
      return 'Must be string no longer than 255 characters';
    }
    try {
      cronParser.parseExpression(value);
      return true;
    } catch (e) {
      return `Incorrect cron expression`;
    }
  },
  formula: (value: any) => {
    if (!isString(value)) {
      return 'Must be string';
    }
    try {
      const expression = Parser.parse(value);
      const variables = expression.variables({ withMembers: true });
      if (variables.length !== 1 || variables.indexOf('x') !== 0) {
        return 'Formula must contain exactly on variable `x`';
      }
      return true;
    } catch (e) {
      return 'Incorrect formula';
    }
  },
  longitude: (value: any) => {
    const result = isFinite(value) && value >= -180 && value <= 180;
    return result || 'Longitude value must be between -180 and 180';
  },
  latitude: (value: any) => {
    const result = isFinite(value) && value >= -90 && value <= 90;
    return result || 'Latitude value must be between -90 and 90';
  },
  uuid: (value: any) => {
    const result = isString(value) && isUUID(value);
    return result || 'Incorrect UUID';
  },
  node: (value: any) =>
    (isObject(value) && isUUID((value as any).id)) ||
    'Value must be node with id',
  url: (v: any) => (isString(v) && isURL(v)) || 'Value must be valid URL',
  https: (v: any) =>
    (isString(v) && isURL(v, { protocols: ['https'] })) ||
    'Value must be valid https URL',
  jsonString: (v: any) =>
    (isString(v) && isJSON(v)) || 'Value must be valid JSON string',
  integer: (v: any) => isInteger(v) || 'Value must be integer',
  positiveInteger: (v: any) =>
    (isInteger(v) && v > 0) || 'Value must be positive integer',
  positiveNumber: (v: any) =>
    (isNumber(v) && v > 0) || 'Value must be positive number',
  halfMonth: (v: any) =>
    (isInteger(v) && v >= 0 && v <= 23) || 'Must be integer between 0 and 23',
  seasonNumeric: (v: any) =>
    (isArray(v) && v.length <= 24) || 'Maximal length is 24',
  varchar: (v: any) =>
    (isString(v) && v.length < 256) ||
    'Value must be string no longer than 255 chars',
  nonEmptyVarchar: (v: any) =>
    (isString(v) && v.length < 256 && v.trim().length > 0) ||
    'Value must be non-empty string no longer than 255 chars',
  nonEmptyString: (v: any) =>
    (isString(v) && v.trim().length > 0) || 'Value must be non-empty string',
  slug: (v: any) =>
    (isString(v) && matches(v, SLUG_REGEX)) || 'Value must be valid slug',
  script: (v: any) => isString(v) && v.length > 0 && v.length < 20,
};

export const baseStruct = superstruct({
  types,
});

export const customStruct = (customTypes: Config['types']) =>
  superstruct({ types: { ...types, ...customTypes } });
