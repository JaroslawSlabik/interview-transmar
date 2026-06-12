
--
-- MAIN STRUCTURE
--

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(200) NOT NULL,
    last_name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assembly_lines (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (product_id, name)
);

CREATE TABLE workstations (
    id BIGSERIAL PRIMARY KEY,
    short_name VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,             -- Dopytać biznes o unikalność
    pc_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assembly_line_workstations (
    assembly_line_id BIGINT NOT NULL REFERENCES assembly_lines(id) ON DELETE CASCADE,
    workstation_id BIGINT NOT NULL REFERENCES workstations(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    allocated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (assembly_line_id, workstation_id)
);


---
--- INDEKSY OPTYMALIZACYJNE
---

CREATE INDEX idx_assembly_lines_active_name ON assembly_lines(name) WHERE is_active = TRUE;
CREATE INDEX idx_alw_workstation_id ON assembly_line_workstations(workstation_id);

