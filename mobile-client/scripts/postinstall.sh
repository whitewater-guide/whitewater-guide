#!/bin/bash

printenv
yarn run rm:babelrc
cp -R ../commons ./src/commons

svn export https://github.com/doomsower/whitewater-keys/trunk/mobile-client