#!/usr/bin/env bash

CMD="am start -W -a android.intent.action.VIEW -d \"${1}\""

adb shell ${CMD}
