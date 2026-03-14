import { getSupabase } from "./supabase";
import type { PatientInsert, AppointmentInsert, AppointmentStatus } from "./database.types";

// ─── Patients ────────────────────────────────────────────

export async function getPatients() {
  const { data, error } = await getSupabase()
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addPatient(patient: PatientInsert) {
  const { data, error } = await getSupabase()
    .from("patients")
    .insert(patient)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePatient(id: string) {
  const { error } = await getSupabase().from("patients").delete().eq("id", id);
  if (error) throw error;
}

// ─── Appointments ────────────────────────────────────────

export async function getAppointments() {
  const { data, error } = await getSupabase()
    .from("appointments")
    .select("*, patients(id, nome, cognome)")
    .order("data", { ascending: true })
    .order("orario", { ascending: true });
  if (error) throw error;
  return data;
}

export async function addAppointment(appointment: AppointmentInsert) {
  const { data, error } = await getSupabase()
    .from("appointments")
    .insert(appointment)
    .select("*, patients(id, nome, cognome)")
    .single();
  if (error) throw error;
  return data;
}

export async function updateAppointmentStatus(id: string, stato: AppointmentStatus) {
  const { error } = await getSupabase()
    .from("appointments")
    .update({ stato })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteAppointment(id: string) {
  const { error } = await getSupabase().from("appointments").delete().eq("id", id);
  if (error) throw error;
}

// ─── Dashboard Stats ─────────────────────────────────────

export async function getDashboardStats() {
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [patientsRes, todayApptRes, weekPatientsRes] = await Promise.all([
    getSupabase().from("patients").select("id", { count: "exact", head: true }),
    getSupabase().from("appointments").select("id", { count: "exact", head: true }).eq("data", today),
    getSupabase().from("patients").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
  ]);

  return {
    totalPatients: patientsRes.count ?? 0,
    todayAppointments: todayApptRes.count ?? 0,
    newThisWeek: weekPatientsRes.count ?? 0,
  };
}

export async function getRecentPatients() {
  const { data, error } = await getSupabase()
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);
  if (error) throw error;
  return data;
}
