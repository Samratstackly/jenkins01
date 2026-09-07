pipeline {

    agent any

    environment {
        FRONTEND_SERVER = "ubuntu@3.148.172.174"
        BACKEND_SERVER  = "ubuntu@3.148.172.174"
    }

    stages {

        stage('Frontend Build') {
            steps {
                echo 'Building frontend...'

                sh '''
                    cd frontend
                    echo "Frontend files:"
                    ls -la
                    echo "Frontend build completed"
                '''
            }
        }

        stage('Backend Install') {
            steps {
                echo 'Installing backend dependencies...'

                sh '''
                    cd backend
                    npm install
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                echo 'Deploying frontend to EC2...'

                sshagent(['ec2-ssh-key']) {
                    sh '''
                        echo "Creating frontend web directory..."

                        ssh -o StrictHostKeyChecking=no \
                            ${FRONTEND_SERVER} \
                            'sudo mkdir -p /var/www/html && sudo rm -rf /var/www/html/*'

                        echo "Creating temporary frontend directory..."

                        ssh -o StrictHostKeyChecking=no \
                            ${FRONTEND_SERVER} \
                            'rm -rf /tmp/frontend && mkdir -p /tmp/frontend'

                        echo "Copying frontend files..."

                        scp -o StrictHostKeyChecking=no \
                            -r frontend/* \
                            ${FRONTEND_SERVER}:/tmp/frontend/

                        echo "Installing frontend files..."

                        ssh -o StrictHostKeyChecking=no \
                            ${FRONTEND_SERVER} \
                            'sudo cp -r /tmp/frontend/* /var/www/html/ && sudo chown -R www-data:www-data /var/www/html'

                        echo "Frontend deployment completed!"
                    '''
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                echo 'Deploying backend to EC2...'

                sshagent(['ec2-ssh-key']) {
                    sh '''
                        echo "Creating backend directory..."

                        ssh -o StrictHostKeyChecking=no \
                            ${BACKEND_SERVER} \
                            'mkdir -p ~/backend'

                        echo "Copying backend files..."

                        scp -o StrictHostKeyChecking=no \
                            -r backend/* \
                            ${BACKEND_SERVER}:~/backend/

                        echo "Installing backend dependencies..."

                        ssh -o StrictHostKeyChecking=no \
                            ${BACKEND_SERVER} \
                            'cd ~/backend && npm install'

                        echo "Backend deployment completed!"
                    '''
                }
            }
        }

        stage('Restart Backend') {
            steps {
                echo 'Restarting backend application...'

                sshagent(['ec2-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no \
                            ${BACKEND_SERVER} \
                            'cd ~/backend && pm2 restart backend || pm2 start server.js --name backend'

                        echo "Backend restart completed!"
                    '''
                }
            }
        }
    }

    post {

        success {
            echo 'Deployment completed successfully!'
        }

        failure {
            echo 'Deployment failed!'
        }
    }
}
