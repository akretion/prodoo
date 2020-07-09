#!/bin/bash

echo "Start CLEANING script"

echo "Cleaning targer dir"
rm -rf $OS_TARGET/*

echo "Cleaning src .tmp dir"
rm -rf $OS_BUILD/src/.tmp

echo "Cleaning src build dir"
rm -rf $OS_BUILD/src/build

echo "Cleaning bower components"
rm -rf $OS_BUILD/src/bower_components

echo "Cleaning node modules"
rm -rf $OS_BUILD/src/node_modules

echo "Cleaning package lock "
rm -rf $OS_BUILD/src/package-lock.json

echo "Restore original package.json "
if [ -f $OS_BUILD/src/package.json.backup ]; then
  rm -rf $OS_BUILD/src/package.json
  mv $OS_BUILD/src/package.json.backup $OS_BUILD/src/package.json
fi

echo "Restoring original gulp gulpfile"
# check if gulp old gulpfile exist
if [ -f $OS_BUILD/src/gulpfile.js.old ]; then
  # restore original project config file
  rm -rf $OS_BUILD/src/gulpfile.js
  mv $OS_BUILD/src/gulpfile.js.old $OS_BUILD/src/gulpfile.js
fi

echo "Cleaning gulp project files"
rm -rf $OS_BUILD/src/gulp/debug.js