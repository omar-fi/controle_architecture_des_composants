def microservices = [
    'discovery-service', 
    'gateway-service', 
    'identity-service', 
    'reservation-service', 
    'notification-service', 
    'parking-service'
]
// Le reste de votre Jenkinsfile suit...
pipeline {
    agent any 
    tools {
        maven 'Maven_3.8.6' // Pour les microservices Spring Boot
        jdk 'JDK_17'        // Pour les microservices Spring Boot
        nodejs 'Node_20'    // NOUVEAU : Pour la construction de React
    }

    stages {
        // ===================================
        // Stage 1 : Construction du Frontend (React) - Séquentiel
        // ===================================
        stage('Frontend: Build') {
            steps {
                echo 'Démarrage de la construction du Frontend React...'
                dir('frontend') {
                    // Cette commande Node.js est maintenant garantie de fonctionner avec Node_20
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        // ===================================
        // Stage 2 : Build, Test & Conteneurisation des Microservices - PARALLÈLE
        // ===================================
        stage('Backend: Parallel CI/CD') {
            steps {
                script {
                    def branches = [:]

                    microservices.each { serviceName ->
                        // Définir une branche de pipeline pour chaque service
                        branches["${serviceName}"] = {
                            node { // Assure que le travail est exécuté sur un nœud
                                stage("CI/CD ${serviceName}") {
                                    dir("microservices/${serviceName}") {
                                        echo "Début de la CI/CD pour ${serviceName}"
                                        
                                        // 1. Build & Test
                                        sh 'mvn clean install'
                                        
                                        // 2. Conteneurisation (Docker Build)
                                        sh "docker build -t ${serviceName}:${env.BUILD_ID} ."

                                        // 3. Déploiement (Push vers un registre)
                                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                                            sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                                            sh "docker push ${serviceName}:${env.BUILD_ID}"
                                            sh 'docker logout'
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // Exécuter toutes les tâches en parallèle
                    parallel branches
                }
            }
        }
        
        // ===================================
        // Stage 3 : Déploiement du Frontend (Image Nginx) - Séquentiel
        // ===================================
        stage('Frontend: Deploy Image') {
             steps {
                dir('frontend') {
                    sh "docker build -f Dockerfile.frontend -t monapp-frontend:${env.BUILD_ID} ."
                }
                // Push de l'image Frontend
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                    sh "docker push monapp-frontend:${env.BUILD_ID}"
                    sh 'docker logout'
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