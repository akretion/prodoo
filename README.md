# prodoo

Run "rake help" for instruction.


### Building and running.

When we have final docker image we can decide with api endpoint we want to call with our app. 

To do this we must specify additional argument when running docker run command
Examples:
```sh
docker run -d -p 8080:80 -e PRODOO_APP_ROOT=/os/app -e PRODOO_PROXY_URL=http://odoo.olst.io -e OS_ENV=prd 721728311103.dkr.ecr.eu-west-1.amazonaws.com/oliverstore/prodoo:1.4.0
```
