CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION logbook_trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS logbook_sections (
    id              UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id       UUID,
    ord_id          SERIAL,
    user_id         VARCHAR(128),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    region          TEXT            NOT NULL,
    river           TEXT            NOT NULL,
    section         TEXT            NOT NULL,
    difficulty      SMALLINT        NOT NULL,
    put_in          GEOGRAPHY(POINTZ,4326),
    take_out        GEOGRAPHY(POINTZ,4326),

    upstream_id     VARCHAR(128),
    upstream_data   JSONB
);

ALTER TABLE logbook_sections
ADD CONSTRAINT logbook_sections_parent_id FOREIGN KEY (parent_id) REFERENCES logbook_sections (id)
ON DELETE SET NULL;

CREATE INDEX logbook_sections_idx_ord ON logbook_sections(ord_id);
CREATE INDEX logbook_sections_idx_user ON logbook_sections(user_id);
CREATE INDEX logbook_sections_idx_created ON logbook_sections(created_at);
CREATE INDEX logbook_sections_idx_difficulty ON logbook_sections(difficulty);
CREATE INDEX logbook_sections_idx_fullname ON logbook_sections ((region || ' ' || river || ' ' || section) varchar_pattern_ops);

DROP TRIGGER IF EXISTS set_logbook_sections_timestamp on logbook_sections;
CREATE TRIGGER set_logbook_sections_timestamp
BEFORE UPDATE ON logbook_sections
FOR EACH ROW
EXECUTE PROCEDURE logbook_trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS logbook_descents (
    id              UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id       UUID,
    ord_id          SERIAL,
    user_id         VARCHAR(128),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    section_id      UUID            NOT NULL REFERENCES logbook_sections(id) ON DELETE CASCADE,

    comment         TEXT,
    started_at      TIMESTAMPTZ     NOT NULL,
    duration        INT,
    level_value     NUMERIC,
    level_unit      VARCHAR(10),
    public          BOOLEAN,

    upstream_data   JSONB
);

ALTER TABLE logbook_descents
ADD CONSTRAINT logbook_descent_parent_id FOREIGN KEY (parent_id) REFERENCES logbook_descents (id)
ON DELETE SET NULL;

CREATE INDEX logbook_descents_idx_ord ON logbook_descents(ord_id);
CREATE INDEX logbook_descents_idx_user ON logbook_descents(user_id);
CREATE INDEX logbook_descents_idx_started ON logbook_descents(started_at);
CREATE INDEX logbook_descents_idx_public ON logbook_descents(public);
CREATE INDEX logbook_descents_idx_section_id ON logbook_descents(section_id);


DROP TRIGGER IF EXISTS set_logbook_descent_timestamp on logbook_descents;
CREATE TRIGGER set_logbook_descent_timestamp
BEFORE UPDATE ON logbook_descents
FOR EACH ROW
EXECUTE PROCEDURE logbook_trigger_set_timestamp();
