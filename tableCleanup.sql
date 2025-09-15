-- Drop triggers first (they depend on tables)
DROP TRIGGER trg_delete_response_on_hazard_delete;
DROP TRIGGER trg_update_hazard_status_on_response;
DROP TRIGGER trg_create_response_for_hazard;
DROP TRIGGER trg_generate_hazard_code;
DROP TRIGGER trg_limit_hazard_images;

-- Drop tables in reverse dependency order
DROP TABLE hazard_image;
DROP TABLE response;
DROP TABLE hazard;
DROP TABLE hazard_type;
DROP TABLE location;
DROP TABLE location_group;

-- Optionally, drop sequences if they were created automatically
-- (Oracle creates sequences automatically for IDENTITY columns)
-- You can check what sequences exist with: SELECT sequence_name FROM user_sequences;
-- DROP SEQUENCE ISEQ$$_[table_id]; -- Replace with actual sequence names if needed