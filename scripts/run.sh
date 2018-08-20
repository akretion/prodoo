#!/bin/bash

# declare vars
_ODOO_PROXY_URL=${PRODOO_ODOO_PROXY_URL}


if [[ ! -z $_ODOO_PROXY_URL ]]; then 
  sed -i.bak "s/odoo.olst.io/$_ODOO_PROXY_URL/g" /etc/nginx/sites-available/prodoo.conf
else
  echo "PRODOO_ODOO_PROXY_URL not set falling to default"
fi;

# start nginx process
nginx -g "daemon off;"



