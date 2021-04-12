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
  --build-arg  BIPPER_PROXY_URL=odoo.olst.io\
"

# 
# LOGIC
# 

Stage "Package"

Step "AWS ECR"

Task "Login to AWS ECR"
eval `aws ecr get-login --region eu-west-1 --profile default | sed -e 's/-e\ none//g'`
Task "End AWS ECR step"

Step "Remove old latest build"

Task "Check is old latest image exist"
OLD_BUILD_LATEST=$(docker images -q ${GPS_PROJECT_DOCKER_IMAGE_URL}:latest)
OLD_BUILD_LATEST_NAME=$(docker images --format "{{.Repository}}:{{.Tag}}" ${GPS_PROJECT_DOCKER_IMAGE_URL}:latest)
if [ -z "$OLD_BUILD_LATEST" ]
then
  Task "Old build not exist, skip this"
else
  Task "Last build ID: ${OLD_BUILD_LATEST}"
  Task "Last build NAME: ${OLD_BUILD_LATEST_NAME}"
  Task "Delete old image"
  docker rmi -f $OLD_BUILD_LATEST
  Check_errors $?
fi
Task "End remove step"

Step "Build artefact"

Task "Build new latest image"
docker build --no-cache --force-rm  -f ${GPS_PROJECT_DIR}/etc/docker/Dockerfile  ${_BUILD_ARGS_OPTS} -t ${GPS_PROJECT_DOCKER_IMAGE_URL} ${GPS_PROJECT_DIR}
Check_errors $?
Task "End build artefact step"

Done

exit 0

