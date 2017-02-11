import {Meteor} from 'meteor/meteor';
import {Migrations} from 'meteor/percolate:migrations';
import v1 from './v1';
import v2 from './v2';
import v3 from './v3';
import v4 from './v4';
import v5 from './v5';
import v6 from './v6';
import v7 from './v7';

Migrations.add(v1);

/**
 * Measurement now include 'level' and 'flow' instead of value.
 * All the denormalized values (Gauge and Section) are updated as well
 */
Migrations.add(v2);

/**
 * Convert section duration from string enum to number, for better sorting
 */
Migrations.add(v3);

/**
 * Adds POIs to regions
 */
Migrations.add(v4);

/**
 * Put-ins and take-outs must be denormalized
 */
Migrations.add(v5);

/**
 * Adds bounding boxes to regions
 */
Migrations.add(v6);

/**
 * Make all current admin super-admins
 */
Migrations.add(v7);

Meteor.startup(() => {
  Migrations.migrateTo('latest');
});