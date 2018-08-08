#!/bin/bash

# Setting os target path
OS_TARGET=/os/target

# Remove Distributed code and artifact
rm -rf $OS_TARGET/*
rm -rvf $OS_BUILD/dist

cd $OS_BUILD
npm install
PATH=$PATH:./node_modules/.bin/
npm install bower
bower install --allow-root
cp ./prodooConfig.js /opt/ostore/prodoo/src/components/prodooConfig/prodooConfig.js
gulp build