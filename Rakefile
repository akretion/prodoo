require 'pathname'

# ------------------------------------------------------------------------------
# RAKE CONFIG

PROJECT_DIR = Pathname.new(".")
COMPOSE_FILE_ASSEMBLE = PROJECT_DIR + "etc/docker/docker-compose.assemble.yml"
DOCKERFILE_PACKAGE = PROJECT_DIR + "etc/docker/Dockerfile"

PROJECT_NAME = "prodoo"
DEV_PROJECT = "#{PROJECT_NAME}dev"

DOCKER_REGISTRY = "721728311103.dkr.ecr.eu-west-1.amazonaws.com"
DOCKER_ORG_NAME = "oliverstore"
DOCKER_REPO_NAME = "prodoo"

BUILD_ID = "latest"

# ------------------------------------------------------------------------------
# Watch
task :watch do 
  desc "assemble #{DEV_PROJECT}"
  CACHE = ENV["CACHE"] == "true" ? "" : "--build"
  sh "docker-compose -p #{DEV_PROJECT} -f #{COMPOSE_FILE_ASSEMBLE} up -d #{CACHE} watcher"
end

# ------------------------------------------------------------------------------
# Assemble
task :assemble do 
  desc "assemble #{DEV_PROJECT}"
  CACHE = ENV["CACHE"] == "true" ? "" : "--build"
  sh "docker-compose -p #{DEV_PROJECT} -f #{COMPOSE_FILE_ASSEMBLE} up #{CACHE} assembler"
end

# ------------------------------------------------------------------------------
# Package
task :package do
  sh "docker build -f #{DOCKERFILE_PACKAGE} -t #{DOCKER_REGISTRY}/#{DOCKER_ORG_NAME}/#{DOCKER_REPO_NAME}:#{BUILD_ID} #{PROJECT_DIR}"
end

# ------------------------------------------------------------------------------
# Tag
task :tag do
  version = `grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g'`
  begin
    sh "docker image pull #{DOCKER_REGISTRY}/#{DOCKER_ORG_NAME}/#{DOCKER_REPO_NAME}:#{version}"
    exit 1
  rescue => exception
    # The image doesn't exist
    sh "docker tag #{DOCKER_REGISTRY}/#{DOCKER_ORG_NAME}/#{DOCKER_REPO_NAME}:#{BUILD_ID} #{DOCKER_REGISTRY}/#{DOCKER_ORG_NAME}/#{DOCKER_REPO_NAME}:#{version}"
    sh "eval $(aws ecr get-login --profile ostore-registry-reader --region eu-west-1)"
    sh "docker push #{DOCKER_REGISTRY}/#{DOCKER_ORG_NAME}/#{DOCKER_REPO_NAME}:#{version}"
    exit 0
  end
end
