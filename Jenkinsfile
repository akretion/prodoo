pipeline {
  agent any
  stages {

    stage('assemble') {
      steps {
        sh 'rake assemble'
      }
    }

    stage("package") {
         
      when {
        tag '*'
      }

      steps {
        sh "rake package"
        sh "rake tag GPS_VERSION_TAG=${env.BRANCH_NAME}"
      }
    }

    stage('publish') {
      steps {
        sh 'rake publish'
      }
    }

  }
}