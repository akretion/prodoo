#!/bin/bash

# Setting os target path
OS_TARGET=/os/target

# Remove Distributed code and artifact
rm -rf $OS_TARGET/*
rm -rvf $OS_BUILD/dist

# legacy build
cd $OS_BUILD
npm install
npm install bower
bower install --allow-root
cp ./prodooConfig.js /opt/ostore/prodoo/src/components/prodooConfig/prodooConfig.js
RUN gulp build


# default config

# Install and build component
# cd $OS_BUILD
# npm install
# npm run build

# Create component artifact in target path
# tar czf $OS_TARGET/app.tar.gz --exclude .git* --exclude "*.log" .