ALTER TABLE afet.invitations ADD COLUMN target_role VARCHAR(50);
UPDATE afet.invitations SET target_role = 'PERSONNEL' WHERE target_role IS NULL;
ALTER TABLE afet.invitations ALTER COLUMN target_role SET NOT NULL;
