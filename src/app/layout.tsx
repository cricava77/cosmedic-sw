import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "COSMEDIC SW",
  description: "Sistema di gestione clinica e cosmetologica",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col shadow-lg">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-indigo-600">COSMEDIC SW</h1>
              <p className="text-xs text-gray-500 mt-1">Clinic Management</p>
            </div>
            
            <nav className="flex-1 space-y-2">
              <Link href="/">
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <span>🏠</span> Dashboard
                </button>
              </Link>
              <Link href="/patients">
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <span>👤</span> Pazienti
                </button>
              </Link>
              <Link href="/appointments">
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <span>📅</span> Appuntamenti
                </button>
              </Link>
              <Link href="/reports">
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <span>📊</span> Report
                </button>
              </Link>
            </nav>
            
            <div className="mt-auto pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">© 2026 COSMEDIC SW</p>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}