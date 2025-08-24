import React from 'react';
import { supabaseAdmin } from '@/lib/supabaseClient';

export default async function AttemptQuestion({ params }:{ params:{ id:string, n:string }}){
  const supa = supabaseAdmin();
  const n = Number(params.n);
  const { data: item } = await supa.from('attempt_item').select('*, question:question(*), attempt:attempt(*)')
    .eq('attempt_id', params.id).eq('order_index', n).single();

  if (!item) return <div className="card">No existe esta pregunta.</div>;

  const choices = (item.choices_order as any[]);

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-600">Pregunta {n} de {item.attempt.total_questions}</div>
      <div className="card">
        <div className="font-semibold mb-3">{item.question.stem}</div>
        <form action={`/api/attempt/${params.id}/answer`} method="post">
          <input type="hidden" name="attempt_id" value={params.id} />
          <input type="hidden" name="order_index" value={n} />
          <div className="space-y-2">
            {choices.map((choiceId, idx)=> (
              <label key={choiceId} className="flex items-center gap-2">
                <input type="radio" name="choice_index" value={idx} required/>
                <span>Opción {String.fromCharCode(97+idx)}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            {n>1 ? <a className="btn" href={`/attempt/${params.id}/q/${n-1}`}>← Anterior</a> : <span/>}
            <button className="btn btn-primary" type="submit">Continuar →</button>
          </div>
        </form>
      </div>
    </div>
  );
}
