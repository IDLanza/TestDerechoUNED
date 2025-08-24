import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Plataforma de Test',
  description: 'Exámenes por curso/asignatura con aleatoriedad y estadísticas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="bg-slate-900 text-white">
          <div className="container py-4 flex items-center justify-between">
            <a href="/" className="font-bold">Plataforma de Test</a>
            <nav className="text-sm opacity-90">
              <a href="/login" className="mr-4">Entrar</a>
              <a href="/signup">Crear cuenta</a>
            </nav>
          </div>
        </header>
        <main className="container py-6">{children}</main>
        <footer className="mt-10 py-6 border-t text-sm text-slate-600 container">
          © {new Date().getFullYear()} — Proyecto de tests
        </footer>
      </body>
    </html>
  );
}
