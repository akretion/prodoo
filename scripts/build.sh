#!/bin/bash

# Setting os target path
OS_TARGET=/os/target

# Remove Distributed code and artifact
rm -rf $OS_TARGET/*
rm -rvf $OS_BUILD/dist

# Install and build component
cd $OS_BUILD
npm install
npm run build

# Create component artifact in target path
tar czf $OS_TARGET/app.tar.gz --exclude .git* --exclude "*.log" .

