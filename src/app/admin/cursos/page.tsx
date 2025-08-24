// app/admin/cursos/page.tsx
import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

async function createCurso(formData: FormData) {
  'use server';
  const nombre = String(formData.get('nombre') ?? '').trim();
  if (!nombre) return;
  const supabase = supabaseServer();
  const { error } = await supabase.from('cursos').insert({ nombre });
  if (error) throw error;
  revalidatePath('/admin/cursos');
}

async function deleteCurso(id: string) {
  'use server';
  const supabase = supabaseServer();
  const { error } = await supabase.from('cursos').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/cursos');
}

export default async function CursosPage() {
  const supabase = supabaseServer();
  const { data: cursos, error } = await supabase.from('cursos').select('*').order('created_at', { ascending: false }).limit(200);
  if (error) throw error;

  return (
    <main>
      <h2 style={{ marginBottom: 12 }}>Cursos</h2>
      <form action={createCurso} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input name="nombre" placeholder="Nombre del curso" required />
        <button type="submit">Añadir</button>
      </form>
      {(!cursos || cursos.length === 0) ? (
        <p>No hay cursos todavía.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Nombre</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8, width: 140 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((c: any) => (
              <tr key={c.id}>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{c.nombre}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>
                  <form action={async () => deleteCurso(String(c.id))} style={{ display: 'inline' }}>
                    <button type="submit">Borrar</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
