pipeline {
    agent any

    environment {
        IMAGE_NAME      = 'gcelorrio/typescript-api-starter'
        DOCKERHUB_CREDS = 'dockerhub-credentials'

        // Test database (spun up as a throwaway container during the Test stage).
        TEST_DB_NAME  = 'starter_test'
        TEST_APP_PORT = '8888'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/dev']],
                  doGenerateSubmoduleConfigurations: false,
                  extensions: [[$class: 'CleanCheckout']],
                  submoduleCfg: [],
                  userRemoteConfigs: [[url: 'https://github.com/gcelorrio/typescript-api-starter.git']]
                ])
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'yarn install --frozen-lockfile'
            }
        }

        stage('Build') {
            steps {
                sh 'yarn lint'
                sh 'yarn transpile'
            }
        }

        stage('Test') {
            environment {
                NODE_ENV                 = 'test'
                DB_CLIENT                = 'pg'
                DB_HOST                  = 'starter-postgres-test'
                DB_PORT                  = '5432'
                DB_USER                  = 'starter'
                DB_PASSWORD              = 'secret'
                TEST_NETWORK             = 'jenkins-test-net'
                ACCESS_TOKEN_SECRET_KEY  = 'test-access-token-secret'
                REFRESH_TOKEN_SECRET_KEY = 'test-refresh-token-secret'
            }
            steps {
                sh '''
                    docker rm -f starter-postgres-test >/dev/null 2>&1 || true
                    docker run -d --name starter-postgres-test \
                        --network "$TEST_NETWORK" \
                        -e POSTGRES_DB="$TEST_DB_NAME" \
                        -e POSTGRES_USER="$DB_USER" \
                        -e POSTGRES_PASSWORD="$DB_PASSWORD" \
                        postgres:16-alpine

                    ready_count=0
                    until [ "$ready_count" -ge 3 ]; do
                        if docker exec starter-postgres-test pg_isready -U "$DB_USER" >/dev/null 2>&1; then
                            ready_count=$((ready_count + 1))
                        else
                            ready_count=0
                        fi
                        sleep 2
                    done

                    yarn test
                '''
            }
            post {
                always {
                    sh 'docker rm -f starter-postgres-test >/dev/null 2>&1 || true'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDS}", usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                        docker push "$IMAGE_NAME:$BUILD_NUMBER"
                        docker push "$IMAGE_NAME:latest"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
        cleanup {
            sh 'docker rm -f starter-postgres-test >/dev/null 2>&1 || true'
        }
    }
}
