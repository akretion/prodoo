
#!/bin/bash
# 
# INCLUDES 
# 

source extras/bash/bash-utils.sh

# 
# VARS
# 


_ECR_REGISTRY_ID="${GPS_PROJECT_DOCKER_IMAGE_URL%%.*}"
_ECR_REPOSITORY_NAME="${GPS_PROJECT_DOCKER_IMAGE_URL#*/}"

# Build AWS CLI options 

if [[ ! -z $GPS_AWS_PROFILE ]];then
_AWS_OPTS="--profile ${GPS_AWS_PROFILE}"
fi;

_AWS_REGION=${GPS_AWS_REGION:-eu-west-1}
_AWS_OPTS="$_AWS_OPTS --region ${_AWS_REGION}"


# Retrieve version from branch name
#   tags/v1.0.0 => 1.0.0
Step "Extract version number form version tag[$GPS_VERSION_TAG]"
_TAG_VERSION="${GPS_VERSION_TAG}"

# 
# LOGIC
# 

Stage "Publish"


Step "Publish docker image [$GPS_PROJECT_DOCKER_IMAGE_URL:$_TAG_VERSION] to AWS ECR"

Log "ECR_REGISTRY_ID=$_ECR_REGISTRY_ID ECR_REPOSITORY_NAME=$_ECR_REPOSITORY_NAME"

Task "Check if the image already exist"
_IMAGE_EXIST_STATUS=$(aws ecr describe-images --registry-id ${_ECR_REGISTRY_ID}\
  --repository-name ${_ECR_REPOSITORY_NAME}\
  --image-ids imageTag=${_TAG_VERSION} 2>&1)

if [[ $? != 0 ]]; then # This is a new image 
  Log "Pushing a new version"

  Task "Logged into AWS ECR"
  eval $(aws ecr get-login --no-include-email ${_AWS_OPTS})
  Check_errors $?

  Task "Push image to AWS ECR"
  docker push $GPS_PROJECT_DOCKER_IMAGE_URL:$_TAG_VERSION
  Check_errors $?

  Task "Remove pushed image from CI"
  docker rmi $GPS_PROJECT_DOCKER_IMAGE_URL:$_TAG_VERSION

else 
  Err "The image $GPS_PROJECT_DOCKER_IMAGE_URL:$_TAG_VERSION] is already present on ECR.\nYou must Upgrade the version and try again.\n\nReason: $_IMAGE_EXIST_STATUS"
fi;


Done 

exit 0