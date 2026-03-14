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

const STATUS_CONFIG: Record<AppointmentStatus, { color: string; bg: string; icon: React.ReactNode }> = {
  "Confermato": {
    color: "text-green-700",
    bg: "bg-green-100",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  "In attesa": {
    color: "text-yellow-700",
    bg: "bg-yellow-100",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  "Annullato": {
    color: "text-red-700",
    bg: "bg-red-100",
    icon: <XCircle className="w-4 h-4" />,
  },
  "Completato": {
    color: "text-blue-700",
    bg: "bg-blue-100",
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
    <div className="space-y-8 p-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Appuntamenti
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Gestisci le prenotazioni della clinica</p>
        </div>
        <Button
          onClick={() => setShowForm(v => !v)}
          className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <CalendarPlus className="w-5 h-5 mr-2" />
          Nuovo Appuntamento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Totali", value: counts.totali, icon: <Calendar className="w-6 h-6 text-indigo-600" />, bg: "bg-indigo-50", border: "border-indigo-200" },
          { label: "Oggi", value: counts.oggi, icon: <Clock className="w-6 h-6 text-purple-600" />, bg: "bg-purple-50", border: "border-purple-200" },
          { label: "In attesa", value: counts.inAttesa, icon: <AlertCircle className="w-6 h-6 text-yellow-600" />, bg: "bg-yellow-50", border: "border-yellow-200" },
          { label: "Confermati", value: counts.confermati, icon: <CheckCircle className="w-6 h-6 text-green-600" />, bg: "bg-green-50", border: "border-green-200" },
        ].map(s => (
          <Card key={s.label} className={`shadow-md border ${s.border} ${s.bg}`}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">{s.icon}</div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form Nuovo Appuntamento */}
      {showForm && (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <CalendarPlus className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Nuovo Appuntamento</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Paziente */}
              <div className="space-y-2">
                <Label htmlFor="paziente" className="text-sm font-semibold text-gray-700">Paziente</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="paziente"
                    name="paziente"
                    value={newAppt.paziente}
                    onChange={handleChange}
                    required
                    placeholder="Nome e cognome"
                    className="h-12 pl-10 border-gray-200 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Servizio */}
              <div className="space-y-2">
                <Label htmlFor="servizio" className="text-sm font-semibold text-gray-700">Servizio</Label>
                <select
                  id="servizio"
                  name="servizio"
                  value={newAppt.servizio}
                  onChange={handleChange}
                  required
                  className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  {SERVIZI.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Data */}
              <div className="space-y-2">
                <Label htmlFor="data" className="text-sm font-semibold text-gray-700">Data</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="data"
                    name="data"
                    type="date"
                    value={newAppt.data}
                    onChange={handleChange}
                    required
                    className="h-12 pl-10 border-gray-200 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Orario */}
              <div className="space-y-2">
                <Label htmlFor="orario" className="text-sm font-semibold text-gray-700">Orario</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="orario"
                    name="orario"
                    type="time"
                    value={newAppt.orario}
                    onChange={handleChange}
                    required
                    className="h-12 pl-10 border-gray-200 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Stato */}
              <div className="space-y-2">
                <Label htmlFor="stato" className="text-sm font-semibold text-gray-700">Stato</Label>
                <select
                  id="stato"
                  name="stato"
                  value={newAppt.stato}
                  onChange={handleChange}
                  className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  {(["In attesa", "Confermato", "Annullato", "Completato"] as AppointmentStatus[]).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-semibold text-gray-700">Note</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    id="note"
                    name="note"
                    value={newAppt.note}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Note aggiuntive..."
                    className="w-full rounded-md border border-gray-200 bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex gap-3">
                <Button
                  type="submit"
                  className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <CalendarPlus className="w-5 h-5 mr-2" />
                  Salva Appuntamento
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="h-12 px-6 rounded-xl"
                >
                  Annulla
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtri */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-gray-600">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-semibold">Filtra:</span>
        </div>
        {(["Tutti", "Confermato", "In attesa", "Completato", "Annullato"] as const).map(stato => (
          <button
            key={stato}
            onClick={() => setFiltroStato(stato)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filtroStato === stato
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
            }`}
          >
            {stato}
            {stato !== "Tutti" && (
              <span className="ml-1.5 text-xs opacity-75">
                ({appointments.filter(a => a.stato === stato).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tabella Appuntamenti */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Elenco Appuntamenti</CardTitle>
            </div>
            <span className="text-sm text-gray-500">{filtered.length} risultati</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">Nessun appuntamento trovato</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b-2 border-gray-200">
                    <TableHead className="font-bold text-gray-700 px-6 py-4">ID</TableHead>
                    <TableHead className="font-bold text-gray-700 px-6 py-4">Paziente</TableHead>
                    <TableHead className="font-bold text-gray-700 px-6 py-4">Data</TableHead>
                    <TableHead className="font-bold text-gray-700 px-6 py-4">Orario</TableHead>
                    <TableHead className="font-bold text-gray-700 px-6 py-4">Servizio</TableHead>
                    <TableHead className="font-bold text-gray-700 px-6 py-4">Note</TableHead>
                    <TableHead className="font-bold text-gray-700 px-6 py-4">Stato</TableHead>
                    <TableHead className="font-bold text-gray-700 px-6 py-4">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered
                    .sort((a, b) => `${a.data}${a.orario}` > `${b.data}${b.orario}` ? 1 : -1)
                    .map((appt, index) => {
                      const sc = STATUS_CONFIG[appt.stato];
                      const isToday = appt.data === today;
                      return (
                        <TableRow
                          key={appt.id}
                          className={`hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all border-b border-gray-100 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                          }`}
                        >
                          <TableCell className="font-mono text-sm font-semibold text-indigo-600 px-6 py-4">{appt.id}</TableCell>
                          <TableCell className="font-semibold text-gray-800 px-6 py-4">{appt.paziente}</TableCell>
                          <TableCell className="px-6 py-4">
                            <span className={`text-sm ${isToday ? "font-bold text-indigo-600" : "text-gray-600"}`}>
                              {new Date(appt.data + "T00:00:00").toLocaleDateString("it-IT")}
                              {isToday && <span className="ml-1 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Oggi</span>}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-600 px-6 py-4">{appt.orario}</TableCell>
                          <TableCell className="text-gray-700 px-6 py-4">
                            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{appt.servizio}</span>
                          </TableCell>
                          <TableCell className="text-gray-500 px-6 py-4 text-sm max-w-[150px] truncate">{appt.note || "—"}</TableCell>
                          <TableCell className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.color}`}>
                              {sc.icon}
                              {appt.stato}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <select
                              value={appt.stato}
                              onChange={e => handleStatusChange(appt.id, e.target.value as AppointmentStatus)}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-indigo-400 cursor-pointer"
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
