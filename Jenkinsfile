pipeline {
    agent any

    stages {
        stage('Clean') {
            steps {
                cleanWs()
            }
        }

        stage('Clone Repo') {
            steps {
                git credentialsId: 'github-creds',
                    url: 'https://github.com/Dheerajsonekar/expense_tracker.git',
                    branch: 'master'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Start with PM2') {
            steps {
                sh 'pm2 delete expense || true'
                sh 'pm2 start app.js --name expense'
            }
        }
    }
}
