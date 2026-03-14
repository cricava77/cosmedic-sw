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
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id'>>({
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
      id: `P${(patients.length + 1).toString().padStart(3, '0')}`,
    };
    setPatients([...patients, patientToAdd]);
    setNewPatient({ nome: "", cognome: "", email: "", telefono: "", dataNascita: "" });
  };

  return (
    <div className="space-y-8 p-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Gestione Pazienti
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Aggiungi e visualizza i pazienti della clinica</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md">
          <Users className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-gray-700">{patients.length} Pazienti</span>
        </div>
      </div>

      {/* Form Nuovo Paziente */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <UserPlus className="w-6 h-6 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl text-gray-800">Nuovo Paziente</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-semibold text-gray-700">Nome</Label>
              <Input 
                id="nome" 
                name="nome" 
                value={newPatient.nome} 
                onChange={handleInputChange} 
                required 
                className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                placeholder="Inserisci nome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cognome" className="text-sm font-semibold text-gray-700">Cognome</Label>
              <Input 
                id="cognome" 
                name="cognome" 
                value={newPatient.cognome} 
                onChange={handleInputChange} 
                required 
                className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                placeholder="Inserisci cognome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={newPatient.email} 
                  onChange={handleInputChange} 
                  required 
                  className="h-12 pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                  placeholder="email@esempio.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-sm font-semibold text-gray-700">Telefono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  id="telefono" 
                  name="telefono" 
                  value={newPatient.telefono} 
                  onChange={handleInputChange} 
                  required 
                  className="h-12 pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                  placeholder="3331234567"
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="dataNascita" className="text-sm font-semibold text-gray-700">Data di Nascita</Label>
              <div className="relative max-w-md">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  id="dataNascita" 
                  name="dataNascita" 
                  type="date" 
                  value={newPatient.dataNascita} 
                  onChange={handleInputChange} 
                  required 
                  className="h-12 pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <Button 
                type="submit" 
                className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Aggiungi Paziente
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista Pazienti */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-800">Elenco Pazienti</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b-2 border-gray-200">
                  <TableHead className="font-bold text-gray-700 px-6 py-4">ID</TableHead>
                  <TableHead className="font-bold text-gray-700 px-6 py-4">Nome Completo</TableHead>
                  <TableHead className="font-bold text-gray-700 px-6 py-4">Email</TableHead>
                  <TableHead className="font-bold text-gray-700 px-6 py-4">Telefono</TableHead>
                  <TableHead className="font-bold text-gray-700 px-6 py-4">Data di Nascita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((p, index) => (
                  <TableRow 
                    key={p.id} 
                    className={`hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all border-b border-gray-100 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <TableCell className="font-mono text-sm font-semibold text-indigo-600 px-6 py-4">{p.id}</TableCell>
                    <TableCell className="font-semibold text-gray-800 px-6 py-4">{p.nome} {p.cognome}</TableCell>
                    <TableCell className="text-gray-600 px-6 py-4">{p.email}</TableCell>
                    <TableCell className="text-gray-600 px-6 py-4">{p.telefono}</TableCell>
                    <TableCell className="text-gray-600 px-6 py-4">{new Date(p.dataNascita).toLocaleDateString('it-IT')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}