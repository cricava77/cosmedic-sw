"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Users, Mail, Phone, Calendar, Trash2, Loader2 } from "lucide-react";
import { getPatients, addPatient, deletePatient } from "@/lib/supabase-queries";
import type { Patient, PatientInsert } from "@/lib/database.types";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPatient, setNewPatient] = useState<PatientInsert>({
    nome: "", cognome: "", email: "", telefono: "", data_nascita: "",
  });

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      console.error("Errore caricamento pazienti:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const saved = await addPatient(newPatient);
      setPatients(prev => [saved, ...prev]);
      setNewPatient({ nome: "", cognome: "", email: "", telefono: "", data_nascita: "" });
    } catch (err) {
      console.error("Errore salvataggio paziente:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo paziente?")) return;
    try {
      await deletePatient(id);
      setPatients(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Errore eliminazione paziente:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Gestione Pazienti</h1>
          <p className="text-muted-foreground mt-1 text-base">Aggiungi e visualizza i pazienti della clinica</p>
        </div>
        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl shadow-sm border border-border/50">
          <Users className="w-4 h-4 text-teal-600" />
          <span className="text-sm font-medium text-foreground">{patients.length} Pazienti</span>
        </div>
      </div>

      {/* Form */}
      <Card className="bg-card rounded-xl shadow-sm border border-border/50 animate-fade-in">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 rounded-lg">
              <UserPlus className="w-5 h-5 text-teal-600" />
            </div>
            <CardTitle className="text-lg font-semibold text-foreground">Nuovo Paziente</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium text-foreground">Nome</Label>
              <Input id="nome" name="nome" value={newPatient.nome} onChange={handleInputChange} required className="h-11" placeholder="Inserisci nome" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cognome" className="text-sm font-medium text-foreground">Cognome</Label>
              <Input id="cognome" name="cognome" value={newPatient.cognome} onChange={handleInputChange} required className="h-11" placeholder="Inserisci cognome" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" name="email" type="email" value={newPatient.email} onChange={handleInputChange} required className="h-11 pl-10" placeholder="email@esempio.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-sm font-medium text-foreground">Telefono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="telefono" name="telefono" value={newPatient.telefono} onChange={handleInputChange} required className="h-11 pl-10" placeholder="3331234567" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="data_nascita" className="text-sm font-medium text-foreground">Data di Nascita</Label>
              <div className="relative max-w-md">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="data_nascita" name="data_nascita" type="date" value={newPatient.data_nascita} onChange={handleInputChange} required className="h-11 pl-10" />
              </div>
            </div>
            <div className="md:col-span-2">
              <Button
                type="submit"
                disabled={saving}
                className="h-11 px-6 bg-[hsl(168,65%,38%)] hover:bg-[hsl(168,65%,32%)] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                {saving ? "Salvataggio..." : "Aggiungi Paziente"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Patient List */}
      <Card className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden">
        <CardHeader className="bg-teal-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[hsl(168,65%,38%)] rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-lg font-semibold text-foreground">Elenco Pazienti</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <Users className="w-14 h-14 mx-auto mb-3 text-muted-foreground/25" />
              <p className="text-lg font-medium text-muted-foreground">Nessun paziente</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Aggiungi il primo paziente usando il modulo sopra</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Nome</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Email</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Telefono</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Data di Nascita</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3 w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/60 transition-colors duration-150">
                      <TableCell className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[hsl(168,65%,38%)] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {p.nome.charAt(0)}
                          </div>
                          <span className="font-medium text-foreground">{p.nome} {p.cognome}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground px-5 py-3.5">{p.email}</TableCell>
                      <TableCell className="text-muted-foreground px-5 py-3.5">{p.telefono}</TableCell>
                      <TableCell className="text-muted-foreground px-5 py-3.5">{new Date(p.data_nascita).toLocaleDateString("it-IT")}</TableCell>
                      <TableCell className="px-5 py-3.5">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-muted-foreground/50 hover:text-red-500 transition-colors p-1 rounded"
                          title="Elimina paziente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
