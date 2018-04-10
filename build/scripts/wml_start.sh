#!/usr/bin/env bash

watchman watch-del-all .

./node_modules/.bin/wml rm 5
./node_modules/.bin/wml rm 4
./node_modules/.bin/wml rm 3
./node_modules/.bin/wml rm 2
./node_modules/.bin/wml rm 1
./node_modules/.bin/wml rm 0

./node_modules/.bin/wml add packages/commons/src packages/clients/ww-commons
./node_modules/.bin/wml add packages/commons/src packages/backend/src/ww-commons
./node_modules/.bin/wml add packages/commons/src packages/web/src/ww-commons
./node_modules/.bin/wml add packages/clients/src packages/web/src/ww-clients
./node_modules/.bin/wml add packages/commons/src packages/mobile/src/ww-commons
./node_modules/.bin/wml add packages/clients/src packages/mobile/src/ww-clients

./node_modules/.bin/wml start
