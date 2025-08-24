import React from 'react';
import { supabaseAdmin } from '@/lib/supabaseClient';

export default async function AttemptResults({ params }:{params:{id:string}}){
  const supa = supabaseAdmin();
  const { data: attempt } = await supa.from('attempt').select('*').eq('id', params.id).single();
  const { data: items } = await supa.from('attempt_item').select('*, question:question(*)').eq('attempt_id', params.id).order('order_index');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Resultados</h1>
      <div className="card">
        <div><b>Nota:</b> {attempt?.score ?? '—'} / 10</div>
      </div>
      {(items||[]).map((it:any)=> (
        <div key={it.id} className="card">
          <div className="mb-2 font-semibold">{it.question.stem}</div>
          <div>{it.is_correct ? '✅ Correcto' : '❌ Incorrecto'}</div>
          {it.question.explanation && (
            <div className="text-sm text-slate-600 mt-2">
              <b>Explicación:</b> {it.question.explanation}
            </div>
          )}
          <form action="/api/report" method="post" className="mt-3">
            <input type="hidden" name="question_id" value={it.question_id} />
            <input type="hidden" name="attempt_id" value={params.id} />
            <label className="block text-sm mb-1">¿Algo no cuadra? Describe el problema</label>
            <textarea name="message" className="w-full border rounded p-2" rows={3} placeholder="Clave incorrecta, enunciado ambiguo, etc." required></textarea>
            <div className="mt-2">
              <button className="btn" type="submit">Enviar reporte</button>
            </div>
          </form>
        </div>
      ))}
      <a className="btn" href="/">Volver al catálogo</a>
    </div>
  );
}
