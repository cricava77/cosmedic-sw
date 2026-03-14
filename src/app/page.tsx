"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, Calendar, TrendingUp, UserPlus, Activity, ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { getDashboardStats, getRecentPatients } from "@/lib/supabase-queries";
import type { Patient } from "@/lib/database.types";

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalPatients: 0, todayAppointments: 0, newThisWeek: 0 });
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, p] = await Promise.all([getDashboardStats(), getRecentPatients()]);
        setStats(s);
        setRecentPatients(p);
      } catch (err) {
        console.error("Errore caricamento dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    {
      name: "Pazienti Totali",
      value: stats.totalPatients,
      icon: Users,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      name: "Appuntamenti Oggi",
      value: stats.todayAppointments,
      icon: Calendar,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      name: "Nuovi Questa Settimana",
      value: stats.newThisWeek,
      icon: TrendingUp,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
  ];

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
        {statCards.map((stat) => (
          <Card key={stat.name} className="bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
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
          {recentPatients.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
              <p className="text-muted-foreground">Nessun paziente registrato</p>
              <Link href="/patients">
                <Button variant="outline" className="mt-3 text-sm border-teal-200 text-teal-700 hover:bg-teal-50 rounded-lg">
                  Aggiungi il primo
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Nome</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Email</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Telefono</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Registrato il</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPatients.map((p) => (
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
                      <TableCell className="text-muted-foreground px-5 py-3.5">
                        {new Date(p.created_at).toLocaleDateString("it-IT")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="text-center text-muted-foreground text-xs pt-6">
        <p>© {new Date().getFullYear()} COSMEDIC SW — Gestione clinica intelligente</p>
      </footer>
    </div>
  );
}
