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

