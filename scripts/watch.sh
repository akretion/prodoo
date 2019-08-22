#!/bin/bash

source $OS_EXTRAS/files/bash/helpers.bash

Stage "Watch"

Step "Prepare vars"
debug="./node_modules/.bin/gulp debug"

if [ "$OS_DO_BUILD" = true ] ; then
  Task "Clean the env"
  /os/bin/clean.sh
fi

cd $OS_BUILD/src

Task "Build app"
if [ "$OS_DO_BUILD" = true ] ; then
  Step "Check if exist backup of package.json file"
  if [ ! -f $OS_BUILD/src/package.json.backup ]; then
    Task "Backup file not exist, create one and move the pathed file"
    mv ./package.json ./package.json.backup
    cp $OS_BUILD/etc/config/prodoo/build_package.json ./package.json
  fi

  Step "Install dep"
  npm install

  # add path to exec
  PATH=$PATH:./node_modules/.bin/

  Step "Install bower compnents"
  bower install --allow-root

  if [ -f $OS_BUILD/src/package.json.backup ]; then
    Step "Restore original package.json"
    rm -rf $OS_BUILD/src/package.json
    mv $OS_BUILD/src/package.json.backup $OS_BUILD/src/package.json
  fi

fi

Task "Copy prodoo config file"
cp $OS_BUILD/etc/config/prodoo/prodooConfig.js.dev src/components/prodooConfig/prodooConfig.js

Step "check if gulp gilpfile old exist"
if [ ! -f ./gulpfile.js.old ]; then
  Task "Backup original gulpfile"
  mv ./gulpfile.js ./gulpfile.js.old

  Task "Copy new gulpfile"
  cp $OS_BUILD/etc/config/gulp/gulpfile.js ./gulpfile.js
fi

if [ ! -f ./gulp/debug.js ]; then
  Task "Copy gulp debug file"
  cp $OS_BUILD/etc/config/gulp/debug.js ./gulp/debug.js
fi

Step "Run gulp debug command"
$debug &

Step "Start proxy server"
./node_modules/.bin/light-server -c $OS_BUILD/etc/config/dev_server/lightrc.json
