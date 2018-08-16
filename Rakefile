require 'pathname'

# ------------------------------------------------------------------------------
# RAKE CONFIG

PROJECT_NAME = "prodoo"
PROJECT_DIR = Pathname.new(".")
DEV_PROJECT = "#{PROJECT_NAME}dev"

COMPOSE_FILE_ASSEMBLE = PROJECT_DIR + "etc/docker/docker-compose.assemble.yml"

DOCKERFILE_PACKAGE = PROJECT_DIR + "etc/docker/Dockerfile"

DOCKER_REGISTRY = "721728311103.dkr.ecr.eu-west-1.amazonaws.com"
DOCKER_ORG_NAME = "oliverstore"
DOCKER_REPO_NAME = "prodoo"

BUILD_ID = "latest"



# ------------------------------------------------------------------------------
# help
desc "help you to start"
task :help do
  puts "

  Prodoo

  Prerequise: Have a docker installed vXX

  -> to build the docker use:
    rake assemble

  -> to build the docker with or without --build option:
    env CACHE=true rake assemble

  -> to start prodoo
    rake watch

  -> to package prodoo
    rake package

  -> to tag and push to repository
    rake tag
  "
end

# ------------------------------------------------------------------------------
# Assemble
desc "assemble #{DEV_PROJECT}"
task :assemble do
  CACHE = ENV["CACHE"] == "true" ? "" : "--build"
  sh "docker-compose -p #{DEV_PROJECT} -f #{COMPOSE_FILE_ASSEMBLE} up #{CACHE} assembler"
  exit `docker inspect -f   "{{ .State.ExitCode }}" #{DEV_PROJECT}_assembler_1`.to_i
end

# ------------------------------------------------------------------------------
# Test
desc "test #{DEV_PROJECT}"
task :test do
  CACHE = ENV["CACHE"] == "true" ? "" : "--build"
  sh "docker-compose -p #{DEV_PROJECT} -f #{COMPOSE_FILE_ASSEMBLE} up #{CACHE} tester"
  exit `docker inspect -f   "{{ .State.ExitCode }}" #{DEV_PROJECT}_tester_1`.to_i
end

# ------------------------------------------------------------------------------
# Clean
desc "clean #{DEV_PROJECT}"
task :clean do
  CACHE = ENV["CACHE"] == "true" ? "" : "--build"
  sh "docker-compose -p #{DEV_PROJECT} -f #{COMPOSE_FILE_ASSEMBLE} up #{CACHE} cleaner"
  exit `docker inspect -f   "{{ .State.ExitCode }}" #{DEV_PROJECT}_cleaner_1`.to_i
end

# ------------------------------------------------------------------------------
# Watch
desc "watch #{DEV_PROJECT}"
task :watch do
  CACHE = ENV["CACHE"] == "true" ? "" : "--build"
  sh "docker-compose -p #{DEV_PROJECT} -f #{COMPOSE_FILE_ASSEMBLE} up #{CACHE} watcher"
end

# ------------------------------------------------------------------------------
# Package
task :package do
  sh "eval `aws ecr get-login --profile ostore-registry-reader --region eu-west-1 --no-include-email`"
  sh "docker build -f #{DOCKERFILE_PACKAGE} -t #{DOCKER_REGISTRY}/#{DOCKER_ORG_NAME}/#{DOCKER_REPO_NAME}:#{BUILD_ID} #{PROJECT_DIR}"
end

# ------------------------------------------------------------------------------
# Tag
task :tag do
  version = `grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g'`
  begin
    sh "docker image pull #{DOCKER_REGISTRY}/#{DOCKER_ORG_NAME}/#{DOCKER_REPO_NAME}:#{version}"
    # exit 1
  rescue => exception
    # The image doesn't exist
    sh "docker tag #{DOCKER_REGISTRY}/#{DOCKER_ORG_NAME}/#{DOCKER_REPO_NAME}:#{BUILD_ID} #{DOCKER_REGISTRY}/#{DOCKER_ORG_NAME}/#{DOCKER_REPO_NAME}:#{version}"
    sh "eval `aws ecr get-login --profile ostore-registry-reader --region eu-west-1 --no-include-email`"
    sh "docker push #{DOCKER_REGISTRY}/#{DOCKER_ORG_NAME}/#{DOCKER_REPO_NAME}:#{version}"
    exit 0
  end
end
