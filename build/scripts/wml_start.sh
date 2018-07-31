#!/usr/bin/env bash

watchman watch-del-all .

./node_modules/.bin/wml rm all

# Clean destinations because they might contain old files and files from other branches after switch
rm -rf packages/clients/ww-commons
rm -rf packages/backend/src/ww-commons
rm -rf packages/boompromo/src/ww-commons
rm -rf packages/boompromo/src/ww-clients
rm -rf packages/web/src/ww-commons
rm -rf packages/web/src/ww-clients
rm -rf packages/mobile/src/ww-commons
rm -rf packages/mobile/src/ww-clients

./node_modules/.bin/wml add packages/commons/src packages/clients/ww-commons
./node_modules/.bin/wml add packages/commons/src packages/backend/src/ww-commons
./node_modules/.bin/wml add packages/commons/src packages/boompromo/src/ww-commons
./node_modules/.bin/wml add packages/clients/src packages/boompromo/src/ww-clients
./node_modules/.bin/wml add packages/commons/src packages/web/src/ww-commons
./node_modules/.bin/wml add packages/clients/src packages/web/src/ww-clients
./node_modules/.bin/wml add packages/commons/src packages/mobile/src/ww-commons
./node_modules/.bin/wml add packages/clients/src packages/mobile/src/ww-clients

./node_modules/.bin/wml start
