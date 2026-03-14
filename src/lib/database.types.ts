export interface Patient {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  data_nascita: string;
  created_at: string;
}

export type PatientInsert = Omit<Patient, "id" | "created_at">;

export type AppointmentStatus = "Confermato" | "In attesa" | "Annullato" | "Completato";

export interface Appointment {
  id: string;
  patient_id: string;
  data: string;
  orario: string;
  servizio: string;
  note: string;
  stato: AppointmentStatus;
  created_at: string;
}

export type AppointmentInsert = Omit<Appointment, "id" | "created_at">;

export interface AppointmentWithPatient extends Appointment {
  patients: Pick<Patient, "id" | "nome" | "cognome">;
}
