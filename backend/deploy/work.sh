#!/bin/bash
set -e

### Configuration ###

APP_DIR=/var/www/whitewater
RESTART_ARGS=

# Uncomment and modify the following if you installed Passenger from tarball
#export PATH=/path-to-passenger/bin:$PATH


### Automation steps ###

set -x

# Extract newly uploaded package
mkdir -p $APP_DIR/tmp
cd $APP_DIR/tmp
tar xzf $APP_DIR/package.tar.gz
rm -f $APP_DIR/package.tar.gz

# Install dependencies
cd $APP_DIR/tmp/bundle/programs/server
npm install --production
npm prune --production

# Copy over persistent files
if [[ -e $APP_DIR/bundle/Passengerfile.json ]]; then
  cp $APP_DIR/bundle/Passengerfile.json $APP_DIR/tmp/bundle/
fi

# Switch directories, restart app
mv $APP_DIR/bundle $APP_DIR/bundle.old
mv $APP_DIR/tmp/bundle $APP_DIR/bundle
passenger-config restart-app --ignore-app-not-running --ignore-passenger-not-running $RESTART_ARGS $APP_DIR/bundle
rm -rf $APP_DIR/bundle.old