import React from 'react';
import { supabaseAdmin } from '@/lib/supabaseClient';

export default async function SubjectPage({ params }:{params:{id:string}}){
  const supa = supabaseAdmin();
  const sid = Number(params.id);
  const { data: subject } = await supa.from('subject').select('*').eq('id', sid).single();
  const { data: topics } = await supa.from('topic').select('*').eq('subject_id', sid).order('name');
  const { data: tags } = await supa.from('tag').select('*').eq('subject_id', sid).order('name');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{subject?.name}</h1>
      <form action={`/api/attempt/start`} method="post" className="card space-y-3">
        <input type="hidden" name="subject_id" value={sid} />
        <div>
          <label className="label">Número de preguntas</label><br/>
          <input name="n" type="number" defaultValue={10} min={1} className="mt-1" />
        </div>
        <div>
          <label className="label">Temas (opcional)</label>
          <div className="grid md:grid-cols-3 gap-2 mt-2">
            {(topics||[]).map(t=> (
              <label key={t.id} className="flex items-center gap-2">
                <input type="checkbox" name="topics" value={t.id}/>{t.name}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Etiquetas (opcional)</label>
          <div className="grid md:grid-cols-3 gap-2 mt-2">
            {(tags||[]).map(t=> (
              <label key={t.id} className="flex items-center gap-2">
                <input type="checkbox" name="tags" value={t.id}/>{t.name}
              </label>
            ))}
          </div>
        </div>
        <button className="btn btn-primary" type="submit">Iniciar examen</button>
      </form>
    </div>
  );
}
