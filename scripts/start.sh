#!/bin/bash

# command for run gulp debug
debug="gulp debug"

# assemble webapp and put in proper directory
cd $OS_BUILD/src

# add path to exec
PATH=$PATH:./node_modules/.bin/

rm -rf $OS_BUILD/src/build

$debug &

light-server -c $OS_BUILD/etc/config/lightrc.json
