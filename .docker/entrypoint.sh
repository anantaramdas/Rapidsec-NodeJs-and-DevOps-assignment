#!/bin/bash

# Start the run once job.
echo "Docker container has been started"

declare -p | grep -Ev 'BASHOPTS|BASH_VERSINFO|EUID|PPID|SHELLOPTS|UID' > /container.env

# Setup a cron schedule
echo "SHELL=/bin/bash
BASH_ENV=/container.env
*/5 * * * * cd /usr/src/app/ && node app.js > /proc/1/fd/1 2>/proc/1/fd/2
# This extra line makes it a valid cron" > scheduler.cron

crontab scheduler.cron
cron -f
