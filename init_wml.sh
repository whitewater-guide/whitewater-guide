#!/usr/bin/env bash

wml rm 3
wml rm 2
wml rm 1
wml rm 0

wml add commons web-client/src/commons
wml add commons mobile-client/src/commons
wml add commons backend/imports/commons
wml start
