-- Add tattoo_shape array column
ALTER TABLE victims ADD COLUMN tattoo_shape text[];

-- Rename clothing color columns to clothing type
ALTER TABLE victims RENAME COLUMN upper_clothing_color TO upper_clothing_type;
ALTER TABLE victims RENAME COLUMN lower_clothing_color TO lower_clothing_type;
