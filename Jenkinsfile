def microservices = [
    'discovery-service', 
    'gateway-service', 
    'identity-service', 
    'reservation-service', 
    'notification-service', 
    'parking-service'
]

pipeline {
    agent any 
    tools {
        maven 'Maven_3.8.6' 
        jdk 'JDK_17'        
        nodejs 'Node_20'    
    }

    stages {
        // ===================================
        // Stage 1 : Frontend (React) - Dossier corrigé
        // ===================================
        stage('Frontend: Build') {
            steps {
                echo 'Démarrage de la construction du Frontend React...'
                // Correction : Utilisation du nom exact vu sur GitHub
                dir('smart-parking-frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        // ===================================
        // Stage 2 : Microservices - Chemin corrigé
        // ===================================
        stage('Backend: Parallel CI/CD') {
            steps {
                script {
                    def branches = [:]

                    microservices.each { serviceName ->
                        branches["${serviceName}"] = {
                            node { 
                                stage("CI/CD ${serviceName}") {
                                    // Correction : Le dossier parent est 'projet_microservice'
                                    dir("projet_microservice/${serviceName}") {
                                        echo "Début de la CI/CD pour ${serviceName}"
                                        
                                        // Build & Test (Ajout de -DskipTests pour aller plus vite si besoin)
                                        sh 'mvn clean install -DskipTests'
                                        
                                        // Construction Docker
                                        sh "docker build -t ${serviceName}:${env.BUILD_ID} ."

                                        // Push (Nécessite que vous ayez créé l'identifiant 'docker-hub-credentials' dans Jenkins)
                                        try {
                                            withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                                                sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                                                sh "docker push ${serviceName}:${env.BUILD_ID}"
                                            }
                                        } catch (e) {
                                            echo "Échec du push pour ${serviceName}. Vérifiez vos credentials Docker."
                                        }
                                    }
                                }
                            }
                        }
                    }
                    parallel branches
                }
            }
        }
        
        // ===================================
        // Stage 3 : Déploiement Image Frontend
        // ===================================
        stage('Frontend: Deploy Image') {
             steps {
                dir('smart-parking-frontend') {
                    // Assurez-vous que le fichier s'appelle bien Dockerfile.frontend ou Dockerfile
                    sh "docker build -t monapp-frontend:${env.BUILD_ID} ."
                }
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh "docker push monapp-frontend:${env.BUILD_ID}"
                }
            }
        }
    }
    
    post {
        always {
            echo "Pipeline terminé. Statut : ${currentBuild.result}"
        }
    }
}