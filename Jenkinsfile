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
                echo 'Nettoyage et construction du Frontend React...'
                dir('smart-parking-frontend') {
                    // Supprime les anciens modules et le lock pour éviter les conflits d'architecture
                    sh 'rm -rf node_modules package-lock.json'
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        // ===================================
        // Stage 2 : Microservices - Chemin corrigé
        // ===================================
        // ... (reste du fichier identique)

        stage('Backend: Parallel CI/CD') {
            steps {
                script {
                    def branches = [:]
                    microservices.each { serviceName ->
                        branches["${serviceName}"] = {
                            node { 
                                stage("CI/CD ${serviceName}") {
                                    // AJUSTEMENT ICI : vérifiez si un dossier intermédiaire existe
                                    // Si vos services sont directement dans projet_microservice, gardez tel quel
                                    // Sinon, utilisez : dir("projet_microservice/NOM_DU_DOSSIER/${serviceName}")
                                    dir("projet_microservice/${serviceName}") {
                                        echo "Vérification du dossier actuel :"
                                        sh "pwd"
                                        sh "ls -F" // Pour voir si le pom.xml est présent
                                        
                                        sh 'mvn clean install -DskipTests'
                                        
                                        // On vérifie aussi si le Dockerfile est présent avant de build
                                        sh "docker build -t ${serviceName}:${env.BUILD_ID} ."
                                    }
                                }
                            }
                        }
                    }
                    parallel branches
                }
            }
        }
// ...
        
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