require "pathname"

# ------------------------------------------------------------------------------
# RAKE CONFIG
PROJECT_DIR = Pathname.new(".")
PROJECT_NAME = "prodoo"
PROJECT_TYPE = "application"
GPS_ENV_PREFIX = "GPS_"
OS_ENV_PREFIX = "OS_"
ENV_PREFIX = "PRODOO_"

DOCKER_REGISTRY = "721728311103.dkr.ecr.eu-west-1.amazonaws.com"
DOCKER_ORG_NAME = "oliverstore"
DOCKER_REPO_NAME = "#{PROJECT_NAME}"
DOCKER_IMAGE_REPO_URL = "#{DOCKER_REGISTRY}/#{DOCKER_ORG_NAME}/#{DOCKER_REPO_NAME}"

def run_task(name, envs = nil)
  # Set defaults
  envs ||= {}

  # Gather all envs used in GPS (env var named as GPS_*)
  # and passed to the rake task as
  gps_envs = envs.select do |k, v|
    k.start_with?(OS_ENV_PREFIX) || k.start_with?(ENV_PREFIX) || k.start_with?(GPS_ENV_PREFIX)
  end

  envvars = gps_envs.clone

  with_envs = {
    "GPS_COMPONENT_NAME" => "#{PROJECT_NAME}",
    "GPS_COMPONENT_TYPE" => "#{PROJECT_TYPE}",
    "GPS_PROJECT_NAME" => "#{PROJECT_NAME}",
    "GPS_PROJECT_DIR" => "#{PROJECT_DIR}",
    "GPS_PROJECT_DOCKER_IMAGE_URL" => "#{DOCKER_IMAGE_REPO_URL}",
    "GPS_AWS_PROFILE" => "ostore-operator",
    "DEV_PROJECT" => "#{PROJECT_NAME}dev"

  }.each do |k, v|
    envvars[k.to_s] = v
  end

  exec(envvars, "bash ./tasks/#{name}.sh")
end

# ------------------------------------------------------------------------------
# Clean
# ------------------------------------------------------------------------------
desc "Clean project #{PROJECT_NAME}"
task :clean do |t|
  run_task(t.name)
end

# ------------------------------------------------------------------------------
# Assemble
# ------------------------------------------------------------------------------
desc "Assemble the project and create artefact"
task :assemble do |t|
  run_task(t.name)
end

# ------------------------------------------------------------------------------
# Watch
# ------------------------------------------------------------------------------
desc "Run app in dev mode with life data"
task :watch do |t|
  run_task(t.name)
end

# ------------------------------------------------------------------------------
# Package
# ------------------------------------------------------------------------------
desc "Create the dist package"
task :package do |t|
  run_task(t.name)
end

# ------------------------------------------------------------------------------
# Tag
# ------------------------------------------------------------------------------
desc "Tag the dist package"
task :tag do |t|
  run_task(t.name, ENV)
end

# ------------------------------------------------------------------------------
# Publish
# ------------------------------------------------------------------------------

task :publish do |t|
  run_task(t.name, ENV)
end