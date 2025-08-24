import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { computeScore } from '@/lib/scoring';

export async function GET(req: NextRequest, { params }:{params:{id:string}}){
  const supa = supabaseAdmin();
  const { data: items } = await supa.from('attempt_item').select('*').eq('attempt_id', params.id);
  const correct = (items||[]).filter(i=>i.is_correct === true).length;
  const answered = (items||[]).filter(i=>i.chosen_index !== null).length;
  const total = (items||[]).length;
  const wrong = answered - correct;
  const blank = total - answered;

  const { data: attempt } = await supa.from('attempt').select('scoring_snapshot').eq('id', params.id).single();
  const scoring = attempt?.scoring_snapshot || { scoring_correct: 0.5, scoring_wrong: -0.15, scoring_blank: 0 };
  const score = computeScore(correct, wrong, blank, {
    correct: scoring.scoring_correct ?? 0.5,
    wrong: scoring.scoring_wrong ?? -0.15,
    blank: scoring.scoring_blank ?? 0
  });

  await supa.from('attempt').update({ finished_at: new Date().toISOString(), score }).eq('id', params.id);
  return NextResponse.redirect(new URL(`/attempt/${params.id}/results`, req.url));
}
