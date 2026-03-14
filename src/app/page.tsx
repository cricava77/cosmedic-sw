"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Calendar, TrendingUp, UserPlus, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Dati statistiche
const stats = [
  { 
    name: "Pazienti Totali", 
    value: 142, 
    icon: Users, 
    color: "text-blue-600", 
    bg: "bg-blue-50",
    trend: "+12%",
    trendUp: true
  },
  { 
    name: "Appuntamenti Oggi", 
    value: 8, 
    icon: Calendar, 
    color: "text-green-600", 
    bg: "bg-green-50",
    trend: "3 in attesa",
    trendUp: null
  },
  { 
    name: "Nuovi Questa Settimana", 
    value: 12, 
    icon: TrendingUp, 
    color: "text-purple-600", 
    bg: "bg-purple-50",
    trend: "+5",
    trendUp: true
  },
];

// Dati grafico
const chartData = [
  { giorno: "Lun", visite: 24 },
  { giorno: "Mar", visite: 18 },
  { giorno: "Mer", visite: 32 },
  { giorno: "Gio", visite: 27 },
  { giorno: "Ven", visite: 21 },
  { giorno: "Sab", visite: 15 },
  { giorno: "Dom", visite: 8 },
];

// Dati pazienti recenti
const recentPatients = [
  { id: "P001", nome: "Maria Rossi", età: 34, ultimaVisita: "12/03/2026", stato: "Attivo" },
  { id: "P002", nome: "Luca Bianchi", età: 41, ultimaVisita: "10/03/2026", stato: "In attesa" },
  { id: "P003", nome: "Sofia Verdi", età: 29, ultimaVisita: "09/03/2026", stato: "Chiuso" },
  { id: "P004", nome: "Giulia Neri", età: 38, ultimaVisita: "08/03/2026", stato: "Attivo" },
  { id: "P005", nome: "Marco Esposito", età: 45, ultimaVisita: "07/03/2026", stato: "Attivo" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-2">
      {/* Header Pagina */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Panoramica completa della tua clinica</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-100">
            <Activity className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-gray-700">Online</span>
          </div>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <UserPlus className="w-5 h-5 mr-2" />
            Nuovo Paziente
          </Button>
        </div>
      </div>

      {/* Cards Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-medium text-gray-600 mb-1">
                  {stat.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                  {stat.trendUp === true && <ArrowUpRight className="w-4 h-4 text-green-500" />}
                  {stat.trendUp === false && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                  <p className={`text-xs ${stat.trendUp === true ? 'text-green-600' : stat.trendUp === false ? 'text-red-600' : 'text-gray-400'}`}>
                    {stat.trend}
                  </p>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} shadow-sm`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grafico Visite */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-gray-800">Visite Settimanali</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Andamento delle visite negli ultimi 7 giorni</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Container con dimensioni esplicite per recharts - elimina warning */}
          <div style={{ width: '100%', height: '350px', minHeight: '350px' }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="giorno" 
                  stroke="#6b7280" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 14 }}
                  dy={10}
                />
                <YAxis 
                  stroke="#6b7280" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 14 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                    padding: "16px",
                  }}
                />
                <Bar 
                  dataKey="visite" 
                  fill="url(#colorGradient)" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                  maxBarSize={50}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabella Pazienti Recenti */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-800">Pazienti Recenti</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Ultimi pazienti registrati nella clinica</p>
              </div>
            </div>
            <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-xl">
              Vedi Tutti
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 border-b-2 border-gray-200">
                  <TableHead className="font-bold text-gray-700 px-6 py-4 text-sm uppercase tracking-wide">ID</TableHead>
                  <TableHead className="font-bold text-gray-700 px-6 py-4 text-sm uppercase tracking-wide">Nome</TableHead>
                  <TableHead className="font-bold text-gray-700 px-6 py-4 text-sm uppercase tracking-wide">Età</TableHead>
                  <TableHead className="font-bold text-gray-700 px-6 py-4 text-sm uppercase tracking-wide">Ultima Visita</TableHead>
                  <TableHead className="font-bold text-gray-700 px-6 py-4 text-sm uppercase tracking-wide">Stato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPatients.map((p, index) => (
                  <TableRow 
                    key={p.id} 
                    className={`transition-all duration-200 border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <TableCell className="font-mono text-sm font-bold text-indigo-600 px-6 py-4">{p.id}</TableCell>
                    <TableCell className="font-semibold text-gray-800 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold">
                          {p.nome.charAt(0)}
                        </div>
                        {p.nome}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 px-6 py-4">{p.età} anni</TableCell>
                    <TableCell className="text-gray-600 px-6 py-4">{p.ultimaVisita}</TableCell>
                    <TableCell className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                          p.stato === "Attivo"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : p.stato === "In attesa"
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          p.stato === "Attivo" ? "bg-green-500" :
                          p.stato === "In attesa" ? "bg-yellow-500" :
                          "bg-gray-500"
                        }`}></span>
                        {p.stato}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm pt-8 border-t border-gray-200">
        <p>© {new Date().getFullYear()} COSMEDIC SW — Gestione clinica intelligente</p>
        <p className="text-xs mt-1">Versione 1.0.0</p>
      </footer>
    </div>
  );
}