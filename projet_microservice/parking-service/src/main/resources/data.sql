-- Insertion des parkings
INSERT INTO parking (nom, adresse, capacite) VALUES 
('Parking Central', '123 Rue Principale', 50),
('Parking Gare', '45 Avenue de la Gare', 30),
('Parking Stade', '10 Boulevard des Sports', 100);

-- Insertion de places de parking pour Parking Central (ID = 1)
INSERT INTO parking_spot (numero_place, emplacement, statut, date_creation, date_modification, parking_id) 
VALUES 
    ('P001', 'Niveau 1 - Zone A', 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
    ('P002', 'Niveau 1 - Zone A', 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
    ('P003', 'Niveau 1 - Zone B', 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
    ('P004', 'Niveau 1 - Zone B', 'OCCUPEE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
    ('P005', 'Niveau 2 - Zone A', 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1);

-- Insertion de places de parking pour Parking Gare (ID = 2)
INSERT INTO parking_spot (numero_place, emplacement, statut, date_creation, date_modification, parking_id) 
VALUES 
    ('G001', 'Niveau 0 - Hall', 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
    ('G002', 'Niveau 0 - Hall', 'RESERVEE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
    ('G003', 'Sous-sol - Zone Sud', 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2);

-- Insertion de places de parking pour Parking Stade (ID = 3)
INSERT INTO parking_spot (numero_place, emplacement, statut, date_creation, date_modification, parking_id) 
VALUES 
    ('S001', 'Zone VIP', 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
    ('S002', 'Zone VIP', 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
    ('S003', 'Zone Sud', 'DISPONIBLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
    ('S004', 'Zone Sud', 'OCCUPEE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3);
