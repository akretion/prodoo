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
     * Testing stage
     */
    stage('testing') {
      steps {
        echo "Start the test on ${env.BRANCH_NAME}, Build id: ${currentBuild.displayName}"
        sh 'rake test'
      }
      // Post Junit result
      //post {
      //  always {
      //    junit 'test/test-results.xml'
      //  }
      //}
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
  }
}