#!/bin/bash

source $OS_EXTRAS/files/bash/helpers.bash

# clear project
/os/bin/clean.sh

cd $OS_BUILD/src

# install all node dep
npm install

# add path to exec
PATH=$PATH:./node_modules/.bin/

# build app
gulp build --verbose