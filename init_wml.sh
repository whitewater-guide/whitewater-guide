#!/usr/bin/env bash

wml add commons/src clients/ww-commons
wml add commons/src backend/src/ww-commons
wml add commons/src web/src/ww-commons
wml add clients/src web/src/ww-clients
# wml add commons backend/node_modules/ww-commons
wml start
