Prodapps
=========


Install nodeJS depenencies

	npm install

If bower or gulp are not installed globaly, then 

	PATH=$PATH:./node_modules/.bin/

Run bower to install dep

	bower install

Copy and edit the settings

	cp src/components/prodooConfig/prodooConfig.js.dist src/components/prodooConfig/prodooConfig.js

Build

	gulp build

## usage

    $ rake watch
    $ rake assemble
    $ rake package
    $ docker run --name prodoo -d -p "20170:20170" 721728311103.dkr.ecr.eu-west-1.amazonaws.com/oliverstore/prodoo