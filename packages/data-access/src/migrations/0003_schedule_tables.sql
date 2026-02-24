-- Rooms table
CREATE TABLE IF NOT EXISTS room (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    floor INTEGER,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Appointments table (parent + overrides)
CREATE TABLE IF NOT EXISTS appointment (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    patient_id TEXT NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    doctor_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    room_id TEXT NOT NULL REFERENCES room(id) ON DELETE CASCADE,
    start TIMESTAMPTZ NOT NULL,
    "end" TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'SCHEDULED',
    recurrence_rule TEXT,
    series_id TEXT REFERENCES appointment(id),
    override_date DATE,
    created_by TEXT REFERENCES "user"(id),
    updated_by TEXT REFERENCES "user"(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointment_org_start ON appointment(organization_id, start);

-- Queue entries table
CREATE TABLE IF NOT EXISTS queue_entry (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES room(id) ON DELETE CASCADE,
    patient_id TEXT NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    appointment_id TEXT REFERENCES appointment(id) ON DELETE SET NULL,
    ticket_no TEXT NOT NULL,
    priority INTEGER NOT NULL DEFAULT 0,
    state TEXT DEFAULT 'WAITING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_queue_room_state_priority ON queue_entry(room_id, state, priority DESC, created_at);