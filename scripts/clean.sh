#!/bin/bash

source $OS_EXTRAS/files/bash/helpers.bash

Step "Cleanup"

Task "Cleaning targer dir"
rm -rf $OS_TARGET/*

Task "Cleaning src .tmp dir"
rm -rf $OS_BUILD/src/.tmp

Task "Cleaning src build dir"
rm -rf $OS_BUILD/src/build

Task "Cleaning src dist dir"
rm -rf $OS_BUILD/src/dist

if [ "$OS_DO_BUILD" = true ] ; then
    Task "Cleaning node modules"
    rm -rf $OS_BUILD/src/node_modules
fi

Task "Cleaning package lock "
rm -rf $OS_BUILD/src/package-lock.json
