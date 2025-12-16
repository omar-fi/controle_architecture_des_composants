# Dockerfile dans projet_microservice/discovery-service/
# Phase de Build (utilise un JDK complet pour la compilation si nécessaire)
FROM eclipse-temurin:17-jdk-focal as builder

WORKDIR /app

# Copier le JAR généré par Maven dans la phase de CI
COPY target/discovery-service-1.0.0.jar app.jar

# Phase Finale (utilise un JRE léger pour l'exécution, pour une image plus petite)
FROM eclipse-temurin:17-jre-focal

WORKDIR /app

# Copier l'artefact de la phase 'builder'
COPY --from=builder /app/app.jar .

# Ouvrir le port 8761 (port standard pour un service de découverte Eureka)
EXPOSE 8082

# Commande de démarrage de l'application
ENTRYPOINT ["java", "-jar", "app.jar"]