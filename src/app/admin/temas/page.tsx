// app/admin/temas/page.tsx
import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

async function createTema(formData: FormData) {
  'use server';
  const titulo = String(formData.get('titulo') ?? '').trim();
  const asignatura_id = String(formData.get('asignatura_id') ?? '').trim();
  if (!titulo || !asignatura_id) return;
  const supabase = supabaseServer();
  const { error } = await supabase.from('temas').insert({ titulo, asignatura_id });
  if (error) throw error;
  revalidatePath('/admin/temas');
}

async function deleteTema(id: string) {
  'use server';
  const supabase = supabaseServer();
  const { error } = await supabase.from('temas').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/temas');
}

export default async function TemasPage() {
  const supabase = supabaseServer();
  const [{ data: asignaturas }, { data: temas, error }] = await Promise.all([
    supabase.from('asignaturas').select('id, nombre').order('nombre'),
    supabase.from('temas').select('*, asignaturas(nombre)').order('created_at', { ascending: false }).limit(200),
  ]);
  if (error) throw error;

  return (
    <main>
      <h2 style={{ marginBottom: 12 }}>Temas</h2>

      <form action={createTema} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input name="titulo" placeholder="Título del tema" required />
        <select name="asignatura_id" required defaultValue="">
          <option value="" disabled>Selecciona asignatura…</option>
          {(asignaturas ?? []).map((a: any) => (
            <option key={a.id} value={a.id}>{a.nombre}</option>
          ))}
        </select>
        <button type="submit">Añadir</button>
      </form>

      {(!temas || temas.length === 0) ? (
        <p>No hay temas todavía.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Tema</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Asignatura</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8, width: 140 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {temas.map((t: any) => (
              <tr key={t.id}>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{t.titulo}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{t.asignaturas?.nombre ?? '—'}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>
                  <form action={async () => deleteTema(String(t.id))} style={{ display: 'inline' }}>
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
