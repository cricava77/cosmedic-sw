"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarDays, BarChart3 } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patients", label: "Pazienti", icon: Users },
  { href: "/appointments", label: "Appuntamenti", icon: CalendarDays },
  { href: "/reports", label: "Report", icon: BarChart3 },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <html lang="it">
      <head>
        <title>COSMEDIC SW</title>
        <meta name="description" content="Sistema di gestione clinica e cosmetologica" />
      </head>
      <body>
        <div className="flex h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-gradient-to-b from-[hsl(200,25%,16%)] to-[hsl(180,20%,12%)] flex flex-col shadow-2xl">
            {/* Logo */}
            <div className="px-6 py-6 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[hsl(168,65%,38%)] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight">COSMEDIC</h1>
                  <p className="text-[11px] text-[hsl(180,10%,55%)] font-medium">Clinic Management</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link key={href} href={href}>
                    <div
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                        active
                          ? "bg-[hsl(200,15%,22%)] text-white border-l-[3px] border-[hsl(168,65%,38%)]"
                          : "text-[hsl(180,10%,60%)] hover:bg-[hsl(200,15%,20%)] hover:text-[hsl(180,10%,80%)] border-l-[3px] border-transparent"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-colors duration-200 ${
                          active ? "text-[hsl(168,65%,48%)]" : "group-hover:text-[hsl(180,10%,75%)]"
                        }`}
                      />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="mx-6 border-t border-white/10" />

            {/* User Profile */}
            <div className="px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[hsl(168,65%,38%)] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">DC</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">Dr. Cosmedic</p>
                  <p className="text-xs text-[hsl(180,10%,50%)]">Amministratore</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-8 lg:p-10 bg-[hsl(180,10%,98%)]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
