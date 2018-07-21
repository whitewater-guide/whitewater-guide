#! /bin/sh

set -e

go-cron -s "@every 12h" -- /bin/sh /usr/local/bin/backup.sh
