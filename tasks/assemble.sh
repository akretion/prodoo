
#!/bin/bash

# 
# INCLUDES 
# 

source extras/bash/bash-utils.sh

# 
# VARS
# 


# 
# LOGIC
# 

Stage "Assemble"

Step "Set up env"

Task "Generate random number as id"
COMPONENT_BUILD_ID=$((1 + $RANDOM % 666))
Task "The random id is: $COMPONENT_BUILD_ID"

Task "Set up build args"
_BUILD_ARGS_OPTS="\
  --build-arg  COMPONENT_NAME=${GPS_COMPONENT_NAME}\
  --build-arg  COMPONENT_BUILD_ID=${COMPONENT_BUILD_ID}
"
CURRENT_WORKING_PATH=$(pwd)
Task "Current working dir is: $CURRENT_PATH"
CONTAINER_NAME="assembler"

Step "Build the docker image"
Task "Start build process"
docker-compose -p ${DEV_PROJECT} -f ${GPS_PROJECT_DIR}/etc/docker/docker-compose.assemble.yml build ${_BUILD_ARGS_OPTS} --no-cache --force-rm ${CONTAINER_NAME}
Check_errors $?

Task "Get ID of build image"
BUILD_IMAGE_ID="$(docker image ls -f "label=os:component:name=$GPS_COMPONENT_NAME" -f "label=os:component:build_id=$COMPONENT_BUILD_ID" --format "{{ .ID }}" | head -1)"
Task "Docker build ID image is: $BUILD_IMAGE_ID"
Task "End build image step"

Step "Start assemble process"
docker-compose -p ${DEV_PROJECT} -f ${GPS_PROJECT_DIR}/etc/docker/docker-compose.assemble.yml --env-file $CURRENT_WORKING_PATH'/.env' up --remove-orphans ${CONTAINER_NAME} 
Check_errors $?
Task "End assemble step"

Step "Cleanup step"
Task "Remove related containers "
docker container rm -f $(docker container ls -aqf "name=(${DEV_PROJECT})\w+")

Task "Remove docker image"
docker rmi -f $BUILD_IMAGE_ID
Task "End cleanup step"

Done

exit 0