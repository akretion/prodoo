#!/bin/bash

source $OS_EXTRAS/files/bash/helpers.bash

Stage "Watch"

Step "Prepare vars"
debug="./node_modules/.bin/gulp debug"

Task "Clean the env"
/os/bin/clean.sh

cd $OS_BUILD/src

Step "Check libs and dependencies, if needed install them"
npm install

# add path to exec
PATH=$PATH:./node_modules/.bin/

Step "Build the app in debug mode"
$debug &

Step "Start proxy server"
./node_modules/.bin/light-server -c $OS_BUILD/etc/config/dev_server/lightrc.json
