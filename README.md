# prodoo
### Building prodoo.
To build prodoo artefact we need to follow some rules and procedure:

** Information **
 - basic env settings are in `.env` file, this file i used in assmeble, watch  processes.
 - rake watch use local http server to run and proccess the request, he is also responsible to proxy the request to odoo dev env
 - config file of the local http server is placed in `etc/config/dev_server/lightrc.json`
 - variable `OS_DO_BUILD` who is placed in `.env` file is used in rake watch command, the purpose of this var is to tell if we want to reassamble the prodoo or we skip this and proceed with the execution of command
- command `rake tag` is taking the version number from `package.json` file that is placed in the root of the project directory

** Process of build the prodoo **

1. Manual\
 1.1 rake assemble\
 1.2 rake package\
 1.3 rake tag\
 1.4 rake publish\

2. CI Jenkins
This process is only for master branch of the repository. There is no automatic detection of changes in repo so the process need to be launched manualy from Jenkins dashboard, The Jenkins job is called `prodoo`

### Running prodoo docker image.
To run the image we need to specify only two variables:

`PRODOO_PROXY_URL` - odoo endpoint address that we want to call\
`OS_ENV` - dev, prd

With this variable `PRODOO_PROXY_URL` we can decide if we want to connect to production env or dev env.

Production example Examples:
```sh
docker run -d -p 8080:80 -e PRODOO_PROXY_URL=http://odoo.olst.io -e OS_ENV=prd 721728311103.dkr.ecr.eu-west-1.amazonaws.com/oliverstore/prodoo:X.Y.Z
```

Test env example:
```sh
docker run -d -p 8080:80 -e PRODOO_PROXY_URL=http://docker03.oliverstore.com:60160 -e OS_ENV=dev 721728311103.dkr.ecr.eu-west-1.amazonaws.com/oliverstore/prodoo:X.Y.Z
```

### Development process
To start applaying changes you need to clone the repository to your local dev env. 

Then you need to run:
```sh
rake assemble
rake watch
```
Normally you can only run `rake watch` without the `rake assemble` but the var `OS_DO_BUILD` in `.env` file need to be set as `true`

