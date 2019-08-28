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

Stage "Tag"

Step "Get version"
TAG_VERSION="${GPS_VERSION_TAG}"
# TAG_VERSION=$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')

Step "Tag to the docker image as $GPS_PROJECT_DOCKER_IMAGE_URL:$TAG_VERSION"
Task "Retrieving the last built docker image"
_LASTEST_RAW_BUILD_IMAGE_ID="$(docker image ls -f "label= os:component:name=$GPS_COMPONENT_NAME" --format "{{ .ID }}" | head -1)"
Check_errors $?
Log "LASTEST_RAW_BUILD_IMAGE_ID=$_LASTEST_RAW_BUILD_IMAGE_ID"

Task "Removing unwanted characters"
_LASTEST_BUILD_IMAGE_ID="${_LASTEST_RAW_BUILD_IMAGE_ID//[ \\n]/}"
Log "LASTEST_BUILD_IMAGE_ID=$_LASTEST_BUILD_IMAGE_ID"

Task "tagging the image"
docker tag $_LASTEST_BUILD_IMAGE_ID "$GPS_PROJECT_DOCKER_IMAGE_URL:$TAG_VERSION"
Check_errors $?
Log "Image tag as $GPS_PROJECT_DOCKER_IMAGE_URL:$TAG_VERSION"  


Check_errors $?

Done

exit 0