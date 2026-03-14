"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarPlus, Calendar, Clock, FileText, CheckCircle, XCircle, AlertCircle, Filter, Trash2, Loader2 } from "lucide-react";
import { getAppointments, addAppointment, updateAppointmentStatus, deleteAppointment, getPatients } from "@/lib/supabase-queries";
import type { Patient, AppointmentStatus, AppointmentWithPatient, AppointmentInsert } from "@/lib/database.types";

const SERVIZI = [
  "Consulenza", "Pulizia profonda", "Trattamento viso", "Peeling chimico",
  "Botox", "Filler", "Massaggio rilassante", "Laser",
];

const STATUS_CONFIG: Record<AppointmentStatus, { color: string; bg: string; dot: string }> = {
  "Confermato": { color: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-500" },
  "In attesa": { color: "text-amber-700", bg: "bg-amber-50", dot: "bg-amber-500" },
  "Annullato": { color: "text-red-600", bg: "bg-red-50", dot: "bg-red-500" },
  "Completato": { color: "text-blue-700", bg: "bg-blue-50", dot: "bg-blue-500" },
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filtroStato, setFiltroStato] = useState<AppointmentStatus | "Tutti">("Tutti");
  const [showForm, setShowForm] = useState(false);
  const [newAppt, setNewAppt] = useState<AppointmentInsert>({
    patient_id: "",
    data: "",
    orario: "",
    servizio: SERVIZI[0],
    note: "",
    stato: "In attesa",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [apptData, patientData] = await Promise.all([getAppointments(), getPatients()]);
      setAppointments(apptData as AppointmentWithPatient[]);
      setPatients(patientData);
    } catch (err) {
      console.error("Errore caricamento:", err);
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  const counts = {
    totali: appointments.length,
    oggi: appointments.filter(a => a.data === today).length,
    inAttesa: appointments.filter(a => a.stato === "In attesa").length,
    confermati: appointments.filter(a => a.stato === "Confermato").length,
  };

  const filtered = filtroStato === "Tutti"
    ? appointments
    : appointments.filter(a => a.stato === filtroStato);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAppt(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const saved = await addAppointment(newAppt);
      setAppointments(prev => [...prev, saved as AppointmentWithPatient]);
      setNewAppt({ patient_id: "", data: "", orario: "", servizio: SERVIZI[0], note: "", stato: "In attesa" });
      setShowForm(false);
    } catch (err) {
      console.error("Errore salvataggio appuntamento:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, stato: AppointmentStatus) => {
    try {
      await updateAppointmentStatus(id, stato);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, stato } : a));
    } catch (err) {
      console.error("Errore aggiornamento stato:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo appuntamento?")) return;
    try {
      await deleteAppointment(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Errore eliminazione:", err);
    }
  };

  const getPatientName = (appt: AppointmentWithPatient) => {
    if (appt.patients) return `${appt.patients.nome} ${appt.patients.cognome}`;
    return "—";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Appuntamenti</h1>
          <p className="text-muted-foreground mt-1 text-base">Gestisci le prenotazioni della clinica</p>
        </div>
        <Button
          onClick={() => setShowForm(v => !v)}
          className="bg-[hsl(168,65%,38%)] hover:bg-[hsl(168,65%,32%)] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
        >
          <CalendarPlus className="w-4 h-4 mr-2" />
          Nuovo Appuntamento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
        {[
          { label: "Totali", value: counts.totali, icon: <Calendar className="w-5 h-5 text-teal-600" />, bg: "bg-teal-50", border: "border-teal-100" },
          { label: "Oggi", value: counts.oggi, icon: <Clock className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50", border: "border-amber-100" },
          { label: "In attesa", value: counts.inAttesa, icon: <AlertCircle className="w-5 h-5 text-yellow-600" />, bg: "bg-yellow-50", border: "border-yellow-100" },
          { label: "Confermati", value: counts.confermati, icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50", border: "border-emerald-100" },
        ].map(s => (
          <Card key={s.label} className={`shadow-sm border ${s.border} ${s.bg}/30`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">{s.icon}</div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="bg-card rounded-xl shadow-sm border border-border/50 animate-scale-in">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-lg">
                <CalendarPlus className="w-5 h-5 text-teal-600" />
              </div>
              <CardTitle className="text-lg font-semibold text-foreground">Nuovo Appuntamento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="patient_id" className="text-sm font-medium text-foreground">Paziente</Label>
                <select id="patient_id" name="patient_id" value={newAppt.patient_id} onChange={handleChange} required
                  className="h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all">
                  <option value="">Seleziona paziente...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.nome} {p.cognome}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="servizio" className="text-sm font-medium text-foreground">Servizio</Label>
                <select id="servizio" name="servizio" value={newAppt.servizio} onChange={handleChange} required
                  className="h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all">
                  {SERVIZI.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data" className="text-sm font-medium text-foreground">Data</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="data" name="data" type="date" value={newAppt.data} onChange={handleChange} required className="h-11 pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orario" className="text-sm font-medium text-foreground">Orario</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="orario" name="orario" type="time" value={newAppt.orario} onChange={handleChange} required className="h-11 pl-10" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="note" className="text-sm font-medium text-foreground">Note</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <textarea id="note" name="note" value={newAppt.note} onChange={handleChange} rows={2} placeholder="Note aggiuntive..."
                    className="w-full rounded-md border border-input bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all resize-none" />
                </div>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit" disabled={saving}
                  className="h-11 px-6 bg-[hsl(168,65%,38%)] hover:bg-[hsl(168,65%,32%)] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CalendarPlus className="w-4 h-4 mr-2" />}
                  {saving ? "Salvataggio..." : "Salva Appuntamento"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="h-11 px-5 rounded-xl">
                  Annulla
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5 text-muted-foreground mr-1">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Filtra</span>
        </div>
        {(["Tutti", "Confermato", "In attesa", "Completato", "Annullato"] as const).map(stato => (
          <button key={stato} onClick={() => setFiltroStato(stato)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              filtroStato === stato
                ? "bg-[hsl(168,65%,38%)] text-white shadow-sm"
                : "bg-card text-muted-foreground border border-border/50 hover:border-teal-300 hover:text-foreground"
            }`}>
            {stato}
            {stato !== "Tutti" && (
              <span className="ml-1 text-xs opacity-70">({appointments.filter(a => a.stato === stato).length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden">
        <CardHeader className="bg-teal-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[hsl(168,65%,38%)] rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-foreground">Elenco Appuntamenti</CardTitle>
            </div>
            <span className="text-sm text-muted-foreground">{filtered.length} risultati</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
              <p className="text-lg font-medium text-muted-foreground">Nessun appuntamento trovato</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Prova a modificare i filtri o aggiungi un nuovo appuntamento</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Paziente</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Data</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Orario</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Servizio</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Note</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Stato</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((appt) => {
                    const sc = STATUS_CONFIG[appt.stato];
                    const isToday = appt.data === today;
                    const name = getPatientName(appt);
                    return (
                      <TableRow key={appt.id} className="hover:bg-muted/60 transition-colors duration-150">
                        <TableCell className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[hsl(168,65%,38%)] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                              {name.charAt(0)}
                            </div>
                            <span className="font-medium text-foreground">{name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-3.5">
                          <span className={`text-sm ${isToday ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                            {new Date(appt.data + "T00:00:00").toLocaleDateString("it-IT")}
                            {isToday && <span className="ml-1.5 text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded font-medium">Oggi</span>}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground px-5 py-3.5">{appt.orario?.slice(0, 5)}</TableCell>
                        <TableCell className="px-5 py-3.5">
                          <span className="bg-muted text-foreground text-xs font-medium px-2.5 py-1 rounded-full">{appt.servizio}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground px-5 py-3.5 text-sm max-w-[140px] truncate">{appt.note || "—"}</TableCell>
                        <TableCell className="px-5 py-3.5">
                          <select value={appt.stato} onChange={e => handleStatusChange(appt.id, e.target.value as AppointmentStatus)}
                            className={`text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:border-teal-400 cursor-pointer transition-colors ${sc.bg} ${sc.color} border-transparent`}>
                            {(["In attesa", "Confermato", "Completato", "Annullato"] as AppointmentStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </TableCell>
                        <TableCell className="px-5 py-3.5">
                          <button onClick={() => handleDelete(appt.id)}
                            className="text-muted-foreground/50 hover:text-red-500 transition-colors p-1 rounded" title="Elimina">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
