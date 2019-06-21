#!/bin/bash

source $OS_EXTRAS/files/bash/helpers.bash

Stage "Run"

Step "Check env vars requirements"
: "${OS_ENV:?OS_ENV is required}"
: "${PRODOO_PROXY_PATH:?PRODOO_PROXY_PATH is required}"
: "${PRODOO_APP_ROOT:?PRODOO_APP_ROOT is required}"
: "${PRODOO_PROXY_URL:?PRODOO_PROXY_URL is required}"

Step "Bootstrap the application"
Task "Create the right user now we have the env vars"
$OS_BINS/provision.sh

Task "Generate the APP ID"
export OS_COMPONENT_ID=$(echo $OS_SERVICE_NAME | openssl sha1 | awk '{print $2}') 
Check_errors $?

Log "OS_COMPONENT_ID=$OS_COMPONENT_ID"

Step "Generate the default configuration file"
cd $OS_CONFIG
for tpl in $(find ${OS_CONFIG}/ -name "*.gomplate"); do  
  dst_file_without_gomplate_ext="${tpl%.*}" 
  gomplate --verbose --file $tpl --out $dst_file_without_gomplate_ext
  Check_errors $? 
done

Step "Override default NGINX config"
cp -vf $OS_CONFIG/nginx.conf /etc/nginx/nginx.conf
cp -vrf $OS_CONFIG/sites-enabled /etc/nginx/
rm -f /etc/nginx/sites-enabled/*.gomplate
rm -f /etc/nginx/conf.d/default.conf

Step "Check configuration"
nginx -t 
if [[ $? != 0 ]]; then 
  Err "Error found in configuration files"
else
  Step "Starting application"
  cd $OS_APP
  nginx
  exit 0
fi
