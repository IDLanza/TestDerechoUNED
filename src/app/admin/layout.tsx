// app/admin/layout.tsx
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div style={{ maxWidth: 980, margin: '24px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 12 }}>Panel de administración</h1>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <a href="/admin/cursos">Cursos</a>
        <a href="/admin/asignaturas">Asignaturas</a>
        <a href="/admin/temas">Temas</a>
        <a href="/admin/preguntas">Preguntas</a>
      </nav>
      {children}
    </div>
  );
}
