import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(req: NextRequest){
  const form = await req.formData();
  const question_id = form.get('question_id') as string;
  const attempt_id = form.get('attempt_id') as string;
  const message = (form.get('message') as string || '').slice(0, 2000);

  const supa = supabaseAdmin();
  // TODO: pull user from auth session
  const user_id = '00000000-0000-0000-0000-000000000000';

  // Capture a basic snapshot (could be expanded)
  const { data: q } = await supa.from('question').select('id, stem, explanation').eq('id', question_id).single();
  const { data: it } = await supa.from('attempt_item').select('*').eq('attempt_id', attempt_id).eq('question_id', question_id).single();
  const context = { stem: q?.stem, explanation: q?.explanation, chosen_index: it?.chosen_index, correct_index: it?.correct_index, choices_order: it?.choices_order };

  await supa.from('question_report').insert({
    user_id, subject_id: null, question_id, attempt_id,
    type: 'other', message, status: 'new', context
  });

  return NextResponse.redirect(new URL(`/attempt/${attempt_id}/results`, req.url));
}
