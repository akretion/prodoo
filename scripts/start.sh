#!/bin/bash

# command for run gulp debug
debug="gulp debug"

# delete contnet of build watch dir
rm -rf $OS_BUILD/src/build
rm -rf $OS_BUILD/src/node_modules
rm -rf $OS_BUILD/src/bower_components
rm -rf $OS_BUILD/src/.tmp
rm -rf $OS_BUILD/src/package-lock.json

# assemble webapp and put in proper directory
cd $OS_BUILD/src

# copy prodoo config file
cp src/components/prodooConfig/prodooConfig.js.dev src/components/prodooConfig/prodooConfig.js

# install all node dep
npm install

# add path to exec
PATH=$PATH:./node_modules/.bin/

# install all bower components
bower install --allow-root

# run gulp debug command
$debug &

# start proxy server
light-server -c $OS_BUILD/etc/config/lightrc.json
