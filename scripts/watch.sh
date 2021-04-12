#!/bin/bash

source $OS_EXTRAS/files/bash/helpers.bash

Stage "Watch"

Step "Prepare"
Task "Set up the env"

debug="./node_modules/.bin/gulp debug"

cd $OS_BUILD/src

PATH=$PATH:./node_modules/.bin/

Step "Prepare the app" 
Task "Check if set clean env before process with run the app"
if [ "$WATCH_DO_CLEAN" = true ] ; then
    Task "Delete contnet of build watch dir"
    /os/bin/clean.sh

    Step "Check libs and dependencies, if needed install them"
    npm install

fi

Task "Build the app in debug mode"
$debug &

Step "Start proxy server"
./node_modules/.bin/light-server -c $OS_BUILD/etc/config/dev_server/lightrc.json
