# prodoo


### Building and running.
To build or run it we need to specify two variables:

PRODOO_PROXY_URL - endpoint address that we want to call

When we have final docker image we can decide with api endpoint we want to call with our app. 
We doing it by enter proper url address in var PRODOO_PROXY_URL

Examples:
```sh
docker run -d -p 8080:80 -e PRODOO_PROXY_URL=http://odoo.olst.io -e OS_ENV=prd 721728311103.dkr.ecr.eu-west-1.amazonaws.com/oliverstore/prodoo:1.4.0
```

