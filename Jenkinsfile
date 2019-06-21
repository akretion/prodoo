pipeline {
  agent any
  stages {

    stage("assemble") {

      steps {
        sh "rake assemble"
      }
    }
  
 
    stage("package") {
         
      when {
        tag "*"
      }

      steps {
        sh "rake package"
        sh "rake tag GPS_VERSION_TAG=${env.BRANCH_NAME}"
      }
    }


    stage("publish") {

      when {
        tag "*"
      }

      steps {
        sh "rake publish GPS_VERSION_TAG=${env.BRANCH_NAME}"
      }
    }

  }
}

pipeline {
  agent any
  stages {
    /*
     * Assemble stage
     */
    stage('assemble') {
      steps {
        echo "Start the assembling on ${env.BRANCH_NAME}, Build id: ${currentBuild.displayName}"
        sh 'rake assemble'
      }
    }

    /*
     * package stage
     */
    stage('package') {
      steps {
        script {
          if (env.BRANCH_NAME == 'master') {
            // In branch master
            echo 'packaging on ecs'
            sh 'rake package'
          } else {
            echo 'Not on branch Master, skipping'
          }
        }
        echo "Build duration: ${currentBuild.duration}"
      }
    }

    /*
     * tag stage
     */
    stage('tag') {
      steps {
        script {
          if (env.BRANCH_NAME == 'master') {
            // In branch master
            echo 'taging on ecs'
            sh 'rake tag'
          } else {
            echo 'Not on branch Master, skipping'
          }
        }
        echo "Build duration: ${currentBuild.duration}"
      }
    }

    /*
     * publish stage
     */
    stage('publish') {
      steps {
        echo 'publish on ecs'
        sh 'rake publish'
      }
    }

  }
}