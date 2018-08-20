# prodoo

Run "rake help" for instruction.


### Building and running.

When we have final docker image we can decide with api endpoint we want to call with our app. 

To do this we must specify additional argument when running docker run command
Examples:
```sh
docker run -d -p 8080:80 -e PRODOO_ODOO_PROXY_URL=docker03.oliverstore.com:60160
```

When we don't do that the docker run command will run with default values (odoo.olst.io)