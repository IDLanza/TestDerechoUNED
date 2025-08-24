// app/admin/asignaturas/page.tsx
import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

async function createAsignatura(formData: FormData) {
  'use server';
  const nombre = String(formData.get('nombre') ?? '').trim();
  const curso_id = String(formData.get('curso_id') ?? '').trim();
  if (!nombre || !curso_id) return;
  const supabase = supabaseServer();
  const { error } = await supabase.from('asignaturas').insert({ nombre, curso_id });
  if (error) throw error;
  revalidatePath('/admin/asignaturas');
}

async function deleteAsignatura(id: string) {
  'use server';
  const supabase = supabaseServer();
  const { error } = await supabase.from('asignaturas').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/asignaturas');
}

export default async function AsignaturasPage() {
  const supabase = supabaseServer();
  const [{ data: cursos }, { data: asignaturas, error }] = await Promise.all([
    supabase.from('cursos').select('id, nombre').order('nombre'),
    supabase.from('asignaturas').select('*, cursos(nombre)').order('created_at', { ascending: false }).limit(200),
  ]);
  if (error) throw error;

  return (
    <main>
      <h2 style={{ marginBottom: 12 }}>Asignaturas</h2>

      <form action={createAsignatura} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input name="nombre" placeholder="Nombre de la asignatura" required />
        <select name="curso_id" required defaultValue="">
          <option value="" disabled>Selecciona curso…</option>
          {(cursos ?? []).map((c: any) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        <button type="submit">Añadir</button>
      </form>

      {(!asignaturas || asignaturas.length === 0) ? (
        <p>No hay asignaturas todavía.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Asignatura</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Curso</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8, width: 140 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asignaturas.map((a: any) => (
              <tr key={a.id}>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{a.nombre}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{a.cursos?.nombre ?? '—'}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>
                  <form action={async () => deleteAsignatura(String(a.id))} style={{ display: 'inline' }}>
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
