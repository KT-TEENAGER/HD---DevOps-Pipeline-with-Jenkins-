pipeline {
  agent any
  environment {
    SONARQUBE_ENV = 'MySonar'      // Change to your SonarQube name in Jenkins
  }
  options { timestamps() }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build') {
      steps {
        sh 'node -v'
        sh 'npm ci'
        sh 'npm run build'
        sh 'docker build -t discountmate-api:${BUILD_NUMBER} .'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'reports/junit.xml'
        }
      }
    }
    stage('Code Quality (SonarQube)') {
      steps {
        withSonarQubeEnv(env.SONARQUBE_ENV) {
          sh '''
            npx jest --coverage || true
            npx sonarqube-scanner               -Dsonar.projectKey=discountmate-api               -Dsonar.sources=src               -Dsonar.tests=tests
          '''
        }
      }
    }
    stage('Security Scan') {
      steps {
        sh 'trivy image --severity HIGH,CRITICAL --exit-code 0 discountmate-api:${BUILD_NUMBER} || true'
      }
      post {
        always {
          echo "If vulnerabilities are found, document issue, severity, and action."
        }
      }
    }
    stage('Deploy (Staging)') {
      steps {
        sh '''
          docker tag discountmate-api:${BUILD_NUMBER} discountmate-api:staging
          docker compose down || true
          docker compose up -d --build
        '''
      }
    }
    stage('Release (Promote)') {
      when { branch 'main' }
      steps {
        sh '''
          docker tag discountmate-api:${BUILD_NUMBER} discountmate-api:prod
          echo "Released discountmate-api:${BUILD_NUMBER} as prod"
        '''
      }
    }
    stage('Monitoring & Health') {
      steps {
        sh '''
          sleep 2
          curl -s http://localhost:3000/health | grep ok
          curl -s http://localhost:3000/metrics | head -n 5
        '''
      }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: '**/*.log', allowEmptyArchive: true
    }
  }
}
