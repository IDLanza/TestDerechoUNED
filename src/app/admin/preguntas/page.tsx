// app/admin/preguntas/page.tsx
import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

async function createPregunta(formData: FormData) {
  'use server';
  const tema_id = String(formData.get('tema_id') ?? '').trim();
  const enunciado = String(formData.get('enunciado') ?? '').trim();
  const opcion_a = String(formData.get('opcion_a') ?? '').trim();
  const opcion_b = String(formData.get('opcion_b') ?? '').trim();
  const opcion_c = String(formData.get('opcion_c') ?? '').trim();
  const correcta = String(formData.get('correcta') ?? '').trim().toUpperCase();
  if (!tema_id || !enunciado || !opcion_a || !opcion_b || !opcion_c || !('ABC'.includes(correcta))) return;

  const supabase = supabaseServer();
  const { error } = await supabase.from('preguntas').insert({ tema_id, enunciado, opcion_a, opcion_b, opcion_c, correcta });
  if (error) throw error;
  revalidatePath('/admin/preguntas');
}

async function deletePregunta(id: string) {
  'use server';
  const supabase = supabaseServer();
  const { error } = await supabase.from('preguntas').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/preguntas');
}

export default async function PreguntasPage() {
  const supabase = supabaseServer();
  const [{ data: temas }, { data: preguntas, error }] = await Promise.all([
    supabase.from('temas').select('id, titulo').order('titulo'),
    supabase.from('preguntas').select('*, temas(titulo)').order('created_at', { ascending: false }).limit(200),
  ]);
  if (error) throw error;

  return (
    <main>
      <h2 style={{ marginBottom: 12 }}>Preguntas</h2>

      <form action={createPregunta} style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
        <select name="tema_id" required defaultValue="">
          <option value="" disabled>Selecciona tema…</option>
          {(temas ?? []).map((t: any) => (
            <option key={t.id} value={t.id}>{t.titulo}</option>
          ))}
        </select>

        <textarea name="enunciado" placeholder="Enunciado" required rows={3} />
        <input name="opcion_a" placeholder="Opción A" required />
        <input name="opcion_b" placeholder="Opción B" required />
        <input name="opcion_c" placeholder="Opción C" required />

        <select name="correcta" required defaultValue="A">
          <option value="A">Correcta: A</option>
          <option value="B">Correcta: B</option>
          <option value="C">Correcta: C</option>
        </select>

        <button type="submit">Añadir</button>
      </form>

      {(!preguntas || preguntas.length === 0) ? (
        <p>No hay preguntas todavía.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Tema</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Enunciado</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Opciones</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8, width: 140 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {preguntas.map((p: any) => (
              <tr key={p.id}>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{p.temas?.titulo ?? '—'}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{p.enunciado}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>
                  A) {p.opcion_a}<br/>B) {p.opcion_b}<br/>C) {p.opcion_c}<br/>
                  <strong>Correcta: {p.correcta}</strong>
                </td>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>
                  <form action={async () => deletePregunta(String(p.id))} style={{ display: 'inline' }}>
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
