require 'pathname'

# ------------------------------------------------------------------------------
# RAKE CONFIG

PROJECT_NAME = "prodoo"
PROJECT_DIR = Pathname.new(".")
COMPOSE_FILE_ASSEMBLE = PROJECT_DIR + "etc/docker/docker-compose.assemble.yml"

DEV_PROJECT = "#{PROJECT_NAME}dev"

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
  CACHE = ENV["CACHE"] == "true" ? "" : "--build"
  sh "docker-compose -p #{DEV_PROJECT} -f #{COMPOSE_FILE_ASSEMBLE} up #{CACHE} packager"
  exit `docker inspect -f   "{{ .State.ExitCode }}" #{DEV_PROJECT}_cleaner_1`.to_i
end
