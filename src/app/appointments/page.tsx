"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarPlus, Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle, Filter } from "lucide-react";

type AppointmentStatus = "Confermato" | "In attesa" | "Annullato" | "Completato";

interface Appointment {
  id: string;
  paziente: string;
  data: string;
  orario: string;
  servizio: string;
  note: string;
  stato: AppointmentStatus;
}

const SERVIZI = [
  "Consulenza",
  "Pulizia profonda",
  "Trattamento viso",
  "Peeling chimico",
  "Botox",
  "Filler",
  "Massaggio rilassante",
  "Laser",
];

const STATUS_CONFIG: Record<AppointmentStatus, { color: string; bg: string; dot: string; icon: React.ReactNode }> = {
  "Confermato": {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  "In attesa": {
    color: "text-amber-700",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  "Annullato": {
    color: "text-red-600",
    bg: "bg-red-50",
    dot: "bg-red-500",
    icon: <XCircle className="w-4 h-4" />,
  },
  "Completato": {
    color: "text-blue-700",
    bg: "bg-blue-50",
    dot: "bg-blue-500",
    icon: <CheckCircle className="w-4 h-4" />,
  },
};

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: "A001", paziente: "Maria Rossi", data: "2026-03-14", orario: "09:00", servizio: "Pulizia profonda", note: "Prima visita", stato: "Confermato" },
  { id: "A002", paziente: "Luca Bianchi", data: "2026-03-14", orario: "10:30", servizio: "Consulenza", note: "", stato: "In attesa" },
  { id: "A003", paziente: "Giulia Verdi", data: "2026-03-15", orario: "14:00", servizio: "Peeling chimico", note: "Allergie: nichel", stato: "Confermato" },
  { id: "A004", paziente: "Carlo Neri", data: "2026-03-13", orario: "11:00", servizio: "Trattamento viso", note: "", stato: "Completato" },
  { id: "A005", paziente: "Anna Ferrari", data: "2026-03-16", orario: "15:30", servizio: "Massaggio rilassante", note: "Preferisce stanza silenziosa", stato: "In attesa" },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [filtroStato, setFiltroStato] = useState<AppointmentStatus | "Tutti">("Tutti");
  const [showForm, setShowForm] = useState(false);
  const [newAppt, setNewAppt] = useState<Omit<Appointment, "id">>({
    paziente: "",
    data: "",
    orario: "",
    servizio: SERVIZI[0],
    note: "",
    stato: "In attesa",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appt: Appointment = {
      ...newAppt,
      id: `A${(appointments.length + 1).toString().padStart(3, "0")}`,
    };
    setAppointments(prev => [appt, ...prev]);
    setNewAppt({ paziente: "", data: "", orario: "", servizio: SERVIZI[0], note: "", stato: "In attesa" });
    setShowForm(false);
  };

  const handleStatusChange = (id: string, stato: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, stato } : a));
  };

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
                <Label htmlFor="paziente" className="text-sm font-medium text-foreground">Paziente</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="paziente" name="paziente" value={newAppt.paziente} onChange={handleChange} required placeholder="Nome e cognome" className="h-11 pl-10" />
                </div>
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
              <div className="space-y-2">
                <Label htmlFor="stato" className="text-sm font-medium text-foreground">Stato</Label>
                <select id="stato" name="stato" value={newAppt.stato} onChange={handleChange}
                  className="h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all">
                  {(["In attesa", "Confermato", "Annullato", "Completato"] as AppointmentStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-medium text-foreground">Note</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <textarea id="note" name="note" value={newAppt.note} onChange={handleChange} rows={2} placeholder="Note aggiuntive..."
                    className="w-full rounded-md border border-input bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all resize-none" />
                </div>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit" className="h-11 px-6 bg-[hsl(168,65%,38%)] hover:bg-[hsl(168,65%,32%)] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Salva Appuntamento
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
          <button
            key={stato}
            onClick={() => setFiltroStato(stato)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              filtroStato === stato
                ? "bg-[hsl(168,65%,38%)] text-white shadow-sm"
                : "bg-card text-muted-foreground border border-border/50 hover:border-teal-300 hover:text-foreground"
            }`}
          >
            {stato}
            {stato !== "Tutti" && (
              <span className="ml-1 text-xs opacity-70">
                ({appointments.filter(a => a.stato === stato).length})
              </span>
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
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">ID</TableHead>
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
                  {filtered
                    .sort((a, b) => `${a.data}${a.orario}`.localeCompare(`${b.data}${b.orario}`))
                    .map((appt) => {
                      const sc = STATUS_CONFIG[appt.stato];
                      const isToday = appt.data === today;
                      return (
                        <TableRow key={appt.id} className="hover:bg-muted/60 transition-colors duration-150">
                          <TableCell className="font-mono text-sm font-semibold text-[hsl(168,65%,38%)] px-5 py-3.5">{appt.id}</TableCell>
                          <TableCell className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[hsl(168,65%,38%)] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                {appt.paziente.charAt(0)}
                              </div>
                              <span className="font-medium text-foreground">{appt.paziente}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-3.5">
                            <span className={`text-sm ${isToday ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                              {new Date(appt.data + "T00:00:00").toLocaleDateString("it-IT")}
                              {isToday && <span className="ml-1.5 text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded font-medium">Oggi</span>}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground px-5 py-3.5">{appt.orario}</TableCell>
                          <TableCell className="px-5 py-3.5">
                            <span className="bg-muted text-foreground text-xs font-medium px-2.5 py-1 rounded-full">{appt.servizio}</span>
                          </TableCell>
                          <TableCell className="text-muted-foreground px-5 py-3.5 text-sm max-w-[140px] truncate">{appt.note || "—"}</TableCell>
                          <TableCell className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                              {appt.stato}
                            </span>
                          </TableCell>
                          <TableCell className="px-5 py-3.5">
                            <select
                              value={appt.stato}
                              onChange={e => handleStatusChange(appt.id, e.target.value as AppointmentStatus)}
                              className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-teal-400 cursor-pointer transition-colors"
                            >
                              {(["In attesa", "Confermato", "Completato", "Annullato"] as AppointmentStatus[]).map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
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
