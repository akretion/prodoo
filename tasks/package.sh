#!/bin/bash

# 
# INCLUDES 
# 

source extras/bash/bash-utils.sh

# 
# VARS
# 

_DIST_DIR="${GPS_PROJECT_DIR}/.dist"

_BUILD_ARGS_OPTS="\
  --build-arg  COMPONENT_NAME=${GPS_COMPONENT_NAME}\
  --build-arg  COMPONENT_TYPE=${GPS_COMPONENT_TYPE}\
  --build-arg  PRODOO_PROXY_PATH=odoo\
  --build-arg  PRODOO_APP_ROOT=/os/app\
  --build-arg  PRODOO_PROXY_URL=odoo.olst.io\
"

# 
# LOGIC
# 

Stage "Package"

Step "Login to AWS ECR"
eval `aws ecr get-login --profile ostore-registry-reader --region eu-west-1 --no-include-email`

Step "Build the docker image"
docker build --no-cache --force-rm  -f ${GPS_PROJECT_DIR}/etc/docker/Dockerfile  ${_BUILD_ARGS_OPTS}  -t ${GPS_PROJECT_DOCKER_IMAGE_URL} ${GPS_PROJECT_DIR}

Check_errors $?

Done

exit 0