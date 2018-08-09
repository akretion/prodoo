#!/bin/bash

mkdir -p $OS_PUBLISH

# clear target directory
tar -cvzf $OS_PUBLISH/prodoo.tar.gz $OS_TARGET

exit 0
