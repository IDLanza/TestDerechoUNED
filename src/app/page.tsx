import React from 'react';
import AdSlot from '@/components/AdSlot';
import { supabaseAdmin } from '@/lib/supabaseClient';

export default async function Home(){
  const supa = supabaseAdmin();
  const { data: courses } = await supa.from('course').select('*').order('sort_order', {ascending: true});
  const { data: subjects } = await supa.from('subject').select('*, course:course(*)').eq('visible', true);

  return (
    <div className="space-y-4">
      <AdSlot position="top" />
      <h1 className="text-2xl font-bold">Catálogo</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {(subjects||[]).map((s:any)=>(
          <a key={s.id} href={`/subject/${s.id}`} className="card hover:shadow">
            <div className="text-sm text-slate-600">{s.course?.name} — Semestre {s.semester}</div>
            <div className="text-lg font-semibold">{s.name}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
