#!/bin/bash

# clear target directory
rm -rf $OS_TARGET/*


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

npm install bower
# add path to exec
PATH=$PATH:./node_modules/.bin/

# install all bower components
bower install --allow-root

# build app
gulp build
