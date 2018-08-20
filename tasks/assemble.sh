#!/bin/bash

# clear project
/os/bin/clean.sh

# assemble webapp and put in proper directory
cd $OS_BUILD/src

# for debug purpose
# tail -f /dev/null

# copy prodoo config file
cp $OS_BUILD/etc/config/prodooConfig.js.dist src/components/prodooConfig/prodooConfig.js

# install all node dep
npm install

# install bower
npm install bower

# install live roload and proxy server
npm install light-server

# add path to exec
PATH=$PATH:./node_modules/.bin/

# work around for bower and git submodule
mv .git .git_old

# install all bower components
bower install --allow-root

# geting back original file structure
mv .git_old .git

# copy new gulp file
mv ./gulpfile.js ./gulpfile.js.old
cp $OS_BUILD/etc/config/gulp/gulpfile.js ./gulpfile.js

# build app
gulp build
