#!/bin/bash

# clear target directory
rm -rf $OS_TARGET/*
rm -rf $OS_BUILD/src/build
rm -rf $OS_BUILD/src/node_modules
rm -rf $OS_BUILD/src/bower_components
rm -rf $OS_BUILD/src/.tmp
rm -rf $OS_BUILD/src/package-lock.json

# assemble webapp and put in proper directory
cd $OS_BUILD/src

# tail -f /dev/null

# check if config file exist
if [ -f src/components/prodooConfig/prodooConfig.js ]; then
  # restore original project config file
  rm -rf src/components/prodooConfig/prodooConfig.js
fi

# copy prodoo config file
cp src/components/prodooConfig/prodooConfig.js.dist src/components/prodooConfig/prodooConfig.js

# install all node dep
npm install

# install bower
npm install bower

# add path to exec
PATH=$PATH:./node_modules/.bin/

# work around for bower and git submodule
mv .git .git_old

# install all bower components
bower install --allow-root

# geting back original file structure
mv .git_old .git

# build app
gulp build
