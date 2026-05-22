INSERT INTO facilities (id, created_at, name, type, address) 
VALUES ('c2a297e2-45e0-4720-9426-1d15c71b6264', CURRENT_TIMESTAMP, 'Merkez Devlet Hastanesi', 'HOSPITAL', 'Merkez/Ankara');

INSERT INTO users (id, created_at, email, password, role, facility_id) 
VALUES ('b4f620ed-60c7-43c2-a9b0-9f9fa98db44d', CURRENT_TIMESTAMP, 'admin@vaka.com', '$2a$10$d.KpzyDkiTKcXq.5Ce8mTuxTWto6bZWKPWs43tptTCSFWfSK8P.5i', 'SUPER_ADMIN', NULL);
