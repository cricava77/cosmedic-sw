"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Users, Mail, Phone, Calendar } from "lucide-react";

interface Patient {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  dataNascita: string;
}

export default function PatientsPage() {
  const [newPatient, setNewPatient] = useState<Omit<Patient, "id">>({
    nome: "", cognome: "", email: "", telefono: "", dataNascita: "",
  });
  const [patients, setPatients] = useState<Patient[]>([
    { id: "P001", nome: "Maria", cognome: "Rossi", email: "m.rossi@example.com", telefono: "3331234567", dataNascita: "1988-05-12" },
    { id: "P002", nome: "Luca", cognome: "Bianchi", email: "l.bianchi@example.com", telefono: "3349876543", dataNascita: "1975-11-03" },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientToAdd: Patient = {
      ...newPatient,
      id: `P${(patients.length + 1).toString().padStart(3, "0")}`,
    };
    setPatients([...patients, patientToAdd]);
    setNewPatient({ nome: "", cognome: "", email: "", telefono: "", dataNascita: "" });
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
              <Input
                id="nome"
                name="nome"
                value={newPatient.nome}
                onChange={handleInputChange}
                required
                className="h-11"
                placeholder="Inserisci nome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cognome" className="text-sm font-medium text-foreground">Cognome</Label>
              <Input
                id="cognome"
                name="cognome"
                value={newPatient.cognome}
                onChange={handleInputChange}
                required
                className="h-11"
                placeholder="Inserisci cognome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newPatient.email}
                  onChange={handleInputChange}
                  required
                  className="h-11 pl-10"
                  placeholder="email@esempio.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-sm font-medium text-foreground">Telefono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="telefono"
                  name="telefono"
                  value={newPatient.telefono}
                  onChange={handleInputChange}
                  required
                  className="h-11 pl-10"
                  placeholder="3331234567"
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="dataNascita" className="text-sm font-medium text-foreground">Data di Nascita</Label>
              <div className="relative max-w-md">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="dataNascita"
                  name="dataNascita"
                  type="date"
                  value={newPatient.dataNascita}
                  onChange={handleInputChange}
                  required
                  className="h-11 pl-10"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <Button
                type="submit"
                className="h-11 px-6 bg-[hsl(168,65%,38%)] hover:bg-[hsl(168,65%,32%)] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Aggiungi Paziente
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
          {patients.length === 0 ? (
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
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">ID</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Nome Completo</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Email</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Telefono</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Data di Nascita</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/60 transition-colors duration-150">
                      <TableCell className="font-mono text-sm font-semibold text-[hsl(168,65%,38%)] px-5 py-3.5">{p.id}</TableCell>
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
                      <TableCell className="text-muted-foreground px-5 py-3.5">{new Date(p.dataNascita).toLocaleDateString("it-IT")}</TableCell>
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
