#!/bin/bash

source $OS_EXTRAS/files/bash/helpers.bash

Stage "Watch"

Step "Prepare vars"
debug="./node_modules/.bin/gulp debug"

Task "Clean the env"
/os/bin/clean.sh

cd $OS_BUILD/src

Task "Build app"
if [ "$OS_DO_BUILD" = true ] ; then

  Step "Install dep"
  npm install

fi

# add path to exec
PATH=$PATH:./node_modules/.bin/

Step "Run gulp debug command"
$debug &

Step "Start proxy server"
./node_modules/.bin/light-server -c $OS_BUILD/etc/config/dev_server/lightrc.json
