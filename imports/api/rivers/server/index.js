import { Rivers } from '../index';
import { Sections } from '../../sections';

Rivers.after.remove(function (riverId, riverDoc) {
  Sections.remove({ riverId: riverDoc._id });
});