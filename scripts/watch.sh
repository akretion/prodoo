#!/bin/bash

# Setting os target path
OS_TARGET=/os/target

# Remove Distributed code and artifact
rm -rf $OS_TARGET/*
rm -rvf $OS_BUILD/dist

cd $OS_BUILD
npm install
npm run dev
