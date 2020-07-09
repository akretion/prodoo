#!/bin/bash

source $OS_EXTRAS/files/bash/helpers.bash

# clear project
/os/bin/clean.sh

cd $OS_BUILD/src

# set pathed package.json file as a primary one, original file will be backup
mv ./package.json ./package.json.backup
cp $OS_BUILD/etc/config/prodoo/build_package.json ./package.json

# install all node dep
npm install

# add path to exec
PATH=$PATH:./node_modules/.bin/

# install all bower components
bower install --allow-root

# copy new gulp file
mv ./gulpfile.js ./gulpfile.js.old
cp $OS_BUILD/etc/config/gulp/gulpfile.js ./gulpfile.js

# build app
gulp build --verbose