# Smart Parking System

Système intelligent de gestion de parkings connectés avec architecture microservices.

## Architecture

Le projet est composé de 3 microservices :

1. **parking-service** (Port 8081)
   - Gestion des places de parking disponibles
   - Utilise Spring Data REST pour exposer l'API
   - Base de données H2 en mémoire

2. **reservation-service** (Port 8082)
   - Gestion des réservations de parking
   - Communication avec parking-service via FeignClient
   - Base de données H2 en mémoire

3. **notification-service** (Port 8083)
   - Envoi de notifications (Email/SMS)
   - Utilise WebClient pour communiquer avec des APIs externes (Twilio, Email API)
   - Supporte l'envoi par email, SMS ou les deux

## Prérequis

- Java 17 ou supérieur
- Maven 3.6 ou supérieur

## Installation

```bash
mvn clean install
```

## Démarrage des services

### 1. Parking Service
```bash
cd parking-service
mvn spring-boot:run
```
Service disponible sur : http://localhost:8081

### 2. Reservation Service
```bash
cd reservation-service
mvn spring-boot:run
```
Service disponible sur : http://localhost:8082

### 3. Notification Service
```bash
cd notification-service
mvn spring-boot:run
```
Service disponible sur : http://localhost:8083

## API Endpoints

### Parking Service (Spring Data REST)

- `GET /api/parking-spots` - Liste toutes les places
- `GET /api/parking-spots/{id}` - Détails d'une place
- `GET /api/parking-spots/search/disponibles?statut=DISPONIBLE` - Places disponibles
- `POST /api/parking-spots` - Créer une place
- `PUT /api/parking-spots/{id}` - Mettre à jour une place
- `DELETE /api/parking-spots/{id}` - Supprimer une place

### Reservation Service

- `GET /api/reservations` - Liste toutes les réservations
- `GET /api/reservations/{id}` - Détails d'une réservation
- `POST /api/reservations` - Créer une réservation
- `PUT /api/reservations/{id}/annuler` - Annuler une réservation
- `GET /api/reservations/email/{email}` - Réservations par email
- `GET /api/reservations/actives` - Réservations actives
- `GET /api/reservations/places-disponibles` - Places disponibles (via FeignClient)

### Notification Service

- `POST /api/notifications/envoyer` - Envoyer une notification
- `POST /api/notifications/reservation-confirmee` - Confirmation de réservation
- `POST /api/notifications/rappel-reservation` - Rappel de réservation

## Exemples d'utilisation

### Créer une réservation

```bash
POST http://localhost:8082/api/reservations
Content-Type: application/json

{
  "parkingSpotId": 1,
  "nomClient": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "telephone": "+33612345678",
  "dateDebut": "2024-01-15T10:00:00",
  "dateFin": "2024-01-15T14:00:00"
}
```

### Envoyer une notification

```bash
POST http://localhost:8083/api/notifications/envoyer
Content-Type: application/json

{
  "destinataire": "jean.dupont@example.com",
  "telephone": "+33612345678",
  "type": "LES_DEUX",
  "sujet": "Confirmation de réservation",
  "message": "Votre réservation pour la place P001 a été confirmée."
}
```

## Configuration

### Twilio (pour SMS)

Pour utiliser Twilio, configurez les variables d'environnement :
```bash
export TWILIO_ACCOUNT_SID=votre_account_sid
export TWILIO_AUTH_TOKEN=votre_auth_token
```

Ou modifiez `notification-service/src/main/resources/application.properties`

### Email API

Configurez l'URL de l'API email dans `notification-service/src/main/resources/application.properties`

## Base de données

Chaque service utilise H2 Database en mémoire. Les consoles H2 sont accessibles :
- Parking Service : http://localhost:8081/h2-console
- Reservation Service : http://localhost:8082/h2-console

JDBC URL : `jdbc:h2:mem:parkingdb` (parking) ou `jdbc:h2:mem:reservationdb` (reservation)
Username : `sa`
Password : (vide)

## Concepts clés implémentés

- ✅ **Spring Data REST** : parking-service expose automatiquement une API REST
- ✅ **FeignClient** : reservation-service communique avec parking-service
- ✅ **WebClient** : notification-service communique avec des APIs externes
- ✅ **Communication interservices** : FeignClient pour appels synchrones
- ✅ **Intégration API externe** : WebClient pour Twilio et Email API

## Structure du projet

```
smart-parking-system/
├── pom.xml (parent)
├── parking-service/
│   ├── src/main/java/com/smartparking/parking/
│   └── src/main/resources/
├── reservation-service/
│   ├── src/main/java/com/smartparking/reservation/
│   └── src/main/resources/
└── notification-service/
    ├── src/main/java/com/smartparking/notification/
    └── src/main/resources/
```
