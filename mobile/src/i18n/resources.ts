import de from '@whitewater-guide/translations/mobile/de';
import en from '@whitewater-guide/translations/mobile/en';
import es from '@whitewater-guide/translations/mobile/es';
import fr from '@whitewater-guide/translations/mobile/fr';
import ru from '@whitewater-guide/translations/mobile/ru';
import deepmerge from 'deepmerge';

import extra from './extra.json';
import remapResources from './remapResources';

const mobile = { de, en, es, fr, ru };

const resources: any = __DEV__
  ? deepmerge(remapResources(mobile), extra)
  : mobile;

export default resources;
