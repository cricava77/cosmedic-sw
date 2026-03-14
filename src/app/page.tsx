"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, Calendar, TrendingUp, UserPlus, Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const stats = [
  {
    name: "Pazienti Totali",
    value: 142,
    icon: Users,
    color: "text-teal-600",
    bg: "bg-teal-50",
    trend: "+12%",
    trendUp: true,
  },
  {
    name: "Appuntamenti Oggi",
    value: 8,
    icon: Calendar,
    color: "text-amber-600",
    bg: "bg-amber-50",
    trend: "3 in attesa",
    trendUp: null,
  },
  {
    name: "Nuovi Questa Settimana",
    value: 12,
    icon: TrendingUp,
    color: "text-rose-500",
    bg: "bg-rose-50",
    trend: "+5",
    trendUp: true,
  },
];

const recentPatients = [
  { id: "P001", nome: "Maria Rossi", età: 34, ultimaVisita: "12/03/2026", stato: "Attivo" },
  { id: "P002", nome: "Luca Bianchi", età: 41, ultimaVisita: "10/03/2026", stato: "In attesa" },
  { id: "P003", nome: "Sofia Verdi", età: 29, ultimaVisita: "09/03/2026", stato: "Chiuso" },
  { id: "P004", nome: "Giulia Neri", età: 38, ultimaVisita: "08/03/2026", stato: "Attivo" },
  { id: "P005", nome: "Marco Esposito", età: 45, ultimaVisita: "07/03/2026", stato: "Attivo" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-base">Panoramica completa della tua clinica</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl shadow-sm border border-border/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
            <Activity className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-foreground">Online</span>
          </div>
          <Link href="/patients">
            <Button className="bg-[hsl(168,65%,38%)] hover:bg-[hsl(168,65%,32%)] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
              <UserPlus className="w-4 h-4 mr-2" />
              Nuovo Paziente
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                  {stat.trendUp === true && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />}
                  <p className={`text-xs ${stat.trendUp === true ? "text-emerald-600" : "text-muted-foreground"}`}>
                    {stat.trend}
                  </p>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Patients */}
      <Card className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden">
        <CardHeader className="bg-teal-50/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[hsl(168,65%,38%)] rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">Pazienti Recenti</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Ultimi pazienti registrati</p>
              </div>
            </div>
            <Link href="/patients">
              <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50 rounded-lg text-sm">
                Vedi Tutti
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">ID</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Nome</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Età</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Ultima Visita</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Stato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPatients.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/60 transition-colors duration-150">
                    <TableCell className="font-mono text-sm font-semibold text-[hsl(168,65%,38%)] px-5 py-3.5">{p.id}</TableCell>
                    <TableCell className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[hsl(168,65%,38%)] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {p.nome.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{p.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground px-5 py-3.5">{p.età} anni</TableCell>
                    <TableCell className="text-muted-foreground px-5 py-3.5">{p.ultimaVisita}</TableCell>
                    <TableCell className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          p.stato === "Attivo"
                            ? "bg-emerald-50 text-emerald-700"
                            : p.stato === "In attesa"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.stato === "Attivo" ? "bg-emerald-500" : p.stato === "In attesa" ? "bg-amber-500" : "bg-gray-400"
                          }`}
                        />
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
      <footer className="text-center text-muted-foreground text-xs pt-6">
        <p>© {new Date().getFullYear()} COSMEDIC SW — Gestione clinica intelligente</p>
      </footer>
    </div>
  );
}
