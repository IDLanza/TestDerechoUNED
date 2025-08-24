import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(req: NextRequest, { params }:{params:{id:string}}){
  const form = await req.formData();
  const attempt_id = form.get('attempt_id') as string;
  const order_index = Number(form.get('order_index'));
  const choice_index = Number(form.get('choice_index'));

  const supa = supabaseAdmin();
  const { data: item } = await supa.from('attempt_item').select('*').eq('attempt_id', attempt_id).eq('order_index', order_index).single();
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  const is_correct = (choice_index === item.correct_index);

  await supa.from('attempt_item').update({
    chosen_index: choice_index,
    is_correct,
    answered_at: new Date().toISOString()
  }).eq('id', item.id);

  const nextIndex = order_index + 1;
  const { data: attempt } = await supa.from('attempt').select('total_questions, subject_id, filter_hash, user_id').eq('id', attempt_id).single();
  // Mark seen (placeholder user)
  await supa.from('user_question_seen').upsert({
    user_id: attempt!.user_id,
    subject_id: attempt!.subject_id,
    filter_hash: attempt!.filter_hash,
    question_id: item.question_id,
    last_seen_at: new Date().toISOString()
  });

  if (nextIndex > attempt!.total_questions){
    return NextResponse.redirect(new URL(`/api/attempt/${attempt_id}/finish`, req.url));
  }
  return NextResponse.redirect(new URL(`/attempt/${attempt_id}/q/${nextIndex}`, req.url));
}
