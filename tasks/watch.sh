#!/bin/bash

# command for run gulp debug
debug="./node_modules/.bin/gulp debug"

if [ "$OS_DO_BUILD" = true ] ; then
  # delete contnet of build watch dir
  /os/bin/clean.sh
fi

# assemble webapp and put in proper directory
cd $OS_BUILD/src

if [ "$OS_DO_BUILD" = true ] ; then
  # install all node dep
  npm install

  # install bower
  npm install bower

  # install live roload and proxy server
  npm install light-server

  # add path to exec
  PATH=$PATH:./node_modules/.bin/

  if [ -f ./.git ]; then
    # work around for bower and git submodule
    echo "renaming git config file to workaround the bower problem and submodule"
    mv ./.git ./.git_old
  fi

  # install all bower components
  bower install --allow-root

  if [ -f ./.git_old ]; then
    # geting back original file structure
    echo "getting back the original config git file"
    mv .git_old .git
  fi

fi

# copy prodoo config file
cp $OS_BUILD/etc/config/prodooConfig.js.dev src/components/prodooConfig/prodooConfig.js

# check if gulp gilpfile old exist
if [ ! -f ./gulpfile.js.old ]; then
  # backup original gulpfile
  mv ./gulpfile.js ./gulpfile.js.old

  # copy new gulpfile
  cp $OS_BUILD/etc/config/gulp/gulpfile.js ./gulpfile.js
fi

if [ ! -f ./gulp/debug.js ]; then
  # copy gulp debug file
  cp $OS_BUILD/etc/config/gulp/debug.js ./gulp/debug.js
fi

# run gulp debug command
$debug &

# start proxy server
./node_modules/.bin/light-server -c $OS_BUILD/etc/config/lightrc.json
