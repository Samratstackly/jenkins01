pipeline {

    agent any

    environment {

        FRONTEND_SERVER = "ubuntu@3.148.172.174""

        BACKEND_SERVER = "ubuntu@3.148.172.174:5000"

    }

    stages {

        stage('Checkout') {

            steps {

                git branch: 'main',
                    credentialsId: 'github-token',
                    url: 'https://github.com/Samratstackly/jenkins01.git'

            }

        }


        stage('Frontend Build') {

            steps {

                echo 'Building frontend...'

                sh '''
                    cd frontend

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

                sshagent(['ec2-ssh-key']) {

                    sh """

                        ssh -o StrictHostKeyChecking=no \
                        ${FRONTEND_SERVER} \
                        'sudo rm -rf /var/www/html/*'

                        scp -o StrictHostKeyChecking=no \
                        -r frontend/* \
                        ${FRONTEND_SERVER}:/tmp/frontend/

                        ssh -o StrictHostKeyChecking=no \
                        ${FRONTEND_SERVER} \
                        'sudo cp -r /tmp/frontend/* /var/www/html/'

                    """

                }

            }

        }


        stage('Deploy Backend') {

            steps {

                sshagent(['ec2-ssh-key']) {

                    sh """

                        ssh -o StrictHostKeyChecking=no \
                        ${BACKEND_SERVER} \
                        'mkdir -p ~/backend'

                        scp -o StrictHostKeyChecking=no \
                        -r backend/* \
                        ${BACKEND_SERVER}:~/backend/

                        ssh -o StrictHostKeyChecking=no \
                        ${BACKEND_SERVER} \
                        'cd ~/backend && npm install'

                    """

                }

            }

        }


        stage('Restart Backend') {

            steps {

                sshagent(['ec2-ssh-key']) {

                    sh """

                        ssh -o StrictHostKeyChecking=no \
                        ${BACKEND_SERVER} \
                        'cd ~/backend && pm2 restart server || pm2 start server.js --name backend'

                    """

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
