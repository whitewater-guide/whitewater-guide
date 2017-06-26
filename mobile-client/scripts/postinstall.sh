#!/bin/bash

printenv
yarn run rm:babelrc
cp -R ../commons/ ./src/commons