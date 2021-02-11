#!/bin/bash

echo "Start CLEANING script"

echo "Cleaning targer dir"
rm -rf $OS_TARGET/*

echo "Cleaning src .tmp dir"
rm -rf $OS_BUILD/src/.tmp

echo "Cleaning src build dir"
rm -rf $OS_BUILD/src/build

echo "Cleaning src dist dir"
rm -rf $OS_BUILD/src/dist

if [ "$OS_DO_BUILD" = true ] ; then
    echo "Cleaning node modules"
    rm -rf $OS_BUILD/src/node_modules
fi

echo "Cleaning package lock "
rm -rf $OS_BUILD/src/package-lock.json
