-- =============================================
-- COSMEDIC SW - Schema Database Supabase
-- Eseguire nella SQL Editor di Supabase
-- =============================================

-- Tabella Pazienti
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cognome text NOT NULL,
  email text NOT NULL,
  telefono text NOT NULL,
  data_nascita date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabella Appuntamenti
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  data date NOT NULL,
  orario time NOT NULL,
  servizio text NOT NULL,
  note text DEFAULT '',
  stato text NOT NULL DEFAULT 'In attesa',
  created_at timestamptz DEFAULT now()
);

-- Indici per query frequenti
CREATE INDEX IF NOT EXISTS idx_appointments_data ON appointments(data);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_stato ON appointments(stato);
CREATE INDEX IF NOT EXISTS idx_patients_created ON patients(created_at);

-- Disabilita RLS (no auth per ora)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policy pubblica (permette tutto senza auth)
CREATE POLICY "Allow all on patients" ON patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- Dati di esempio (opzionale)
-- =============================================

INSERT INTO patients (nome, cognome, email, telefono, data_nascita) VALUES
  ('Maria', 'Rossi', 'm.rossi@example.com', '3331234567', '1988-05-12'),
  ('Luca', 'Bianchi', 'l.bianchi@example.com', '3349876543', '1975-11-03'),
  ('Sofia', 'Verdi', 's.verdi@example.com', '3385551234', '1992-08-21'),
  ('Giulia', 'Neri', 'g.neri@example.com', '3371112233', '1985-02-14'),
  ('Marco', 'Esposito', 'm.esposito@example.com', '3399998877', '1978-09-30');

-- Appuntamenti di esempio (usa gli ID generati sopra)
INSERT INTO appointments (patient_id, data, orario, servizio, note, stato)
SELECT p.id, CURRENT_DATE, '09:00', 'Pulizia profonda', 'Prima visita', 'Confermato'
FROM patients p WHERE p.cognome = 'Rossi'
UNION ALL
SELECT p.id, CURRENT_DATE, '10:30', 'Consulenza', '', 'In attesa'
FROM patients p WHERE p.cognome = 'Bianchi'
UNION ALL
SELECT p.id, CURRENT_DATE + 1, '14:00', 'Peeling chimico', 'Allergie: nichel', 'Confermato'
FROM patients p WHERE p.cognome = 'Verdi';
