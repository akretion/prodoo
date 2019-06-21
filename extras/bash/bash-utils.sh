RESET="\033[0m"
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"

function Stage() { 
  >&2 echo -e ""
  >&2 echo -e "${GREEN}->  $GPS_PROJECT_NAME: $* $RESET"
}

function Step() {
  >&2 echo -e "${YELLOW}  • $GPS_PROJECT_NAME: $* $RESET"
}

function Task() {
  #if [[ $OS_ENABLE_DEBUG_LOG == "true" ]]; then 
  >&2 echo -e "${RESET}  - $GPS_PROJECT_NAME: $* ...$RESET"
  #fi;
}

function Log() {
  if [[ $OS_ENABLE_DEBUG_LOG == "true" ]]; then 
  >&2 echo -e "${RESET}  : $GPS_PROJECT_NAME: $*$RESET"
  fi;
}

function Err() {
  >&2 echo -e "${RED}<-  $GPS_PROJECT_NAME: ERROR - $*$RESET"
  exit 1
}

function Done() {
  >&2 echo -e "${GREEN}<-  $GPS_PROJECT_NAME: Done.$RESET"
  >&2 echo -e ""
}


function Succeed_or_exit(){
  if [[ $? == 0 ]]; then
    Done
  else
    >&2 echo -e "${RED}<-  $GPS_PROJECT_NAME: Failed.$RESET"
    exit 1
  fi; 
}

# check_errors: Check if the previous command fails
# params
#   - retcode int 
function Check_errors() {
  local _code=$1
  shift
  local _message="${*}"
  [[ "$_code" != "0" ]] && Err "Fail - $_message" && exit 1
}


function export_env(){
  for e in $@; do
    >&2 echo $e >> /etc/profile.d/extras.env.sh
  done
}

function download_from_repo() {
  wget -q \
  --user=SVC_DOCKER \
  --password=docker1337 \
  --no-check-certificate \
  http://nexus.oliverstore.com:50240/nexus/service/local/repositories/$1/content/$2
}