pipeline {
    agent any

    stages {
        stage('Clean') {
            steps {
                cleanWs()
                echo 'Workspace cleaned'
            }
        }

        stage('Clone Repo') {
            steps {
                git credentialsId: 'github-creds',
                    url: 'https://github.com/Dheerajsonekar/expense_tracker.git',
                    branch: 'master'
                echo 'Git clone done'
                sh 'ls -la'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Running npm install...'
                sh 'npm install || true'  // Continue even if fails, to capture logs
                sh 'ls -la node_modules'
            }
        }

        stage('Start with PM2') {
            steps {
                echo 'Starting PM2 app...'
                sh 'pm2 delete expense || true'
                sh 'pm2 start app.js --name expense'
                sh 'pm2 list'
            }
        }
    }
}
