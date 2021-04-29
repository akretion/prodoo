#!/bin/bash

source $OS_EXTRAS/files/bash/helpers.bash

Step "Preparation"
Task "Clen env"
/os/bin/clean.sh

Task "Enter working dir"
cd $OS_BUILD/src

Task "Install node libs"
npm install

Task "Add node bin to system path"
PATH=$PATH:./node_modules/.bin/

Step "Building"
Task "Build the app"
gulp build --verbose