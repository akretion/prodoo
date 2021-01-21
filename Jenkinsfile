pipeline {
  agent any
  stages {
    stage('setup') {
      steps {
          sh "docker pull node:10"
          sh "docker images"
      }
    stage('assemble') {
      steps {
        sh 'rake assemble'
      }
    }

    stage("package") {
         
      when {
        expression { env.TAG_NAME != null }
      }

      steps {
        sh "rake package"
        sh "rake tag GPS_VERSION_TAG=${env.BRANCH_NAME}"
      }
    }

    stage("publish") {

      when {
        expression { env.TAG_NAME != null }
      }

      steps {
        sh "rake publish GPS_VERSION_TAG=${env.BRANCH_NAME}"
      }
    }

  }
}
