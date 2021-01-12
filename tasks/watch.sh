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

Stage "Watch"

Step "Build the docker image"

docker-compose -p ${DEV_PROJECT} -f ${GPS_PROJECT_DIR}/etc/docker/docker-compose.assemble.yml up --build watcher

Check_errors $?

Done

exit 0