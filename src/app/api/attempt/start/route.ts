import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { makeFilterHash } from '@/lib/filterHash';

export async function POST(req: NextRequest){
  const form = await req.formData();
  const subjectId = Number(form.get('subject_id'));
  const n = Number(form.get('n') || 10);
  const topics = form.getAll('topics').map(v => Number(v));
  const tags = form.getAll('tags').map(v => Number(v));
  const seed = Date.now();
  const filterHash = makeFilterHash(subjectId, topics as number[], tags as number[]);

  const supa = supabaseAdmin();

  // 1) Build pool: published questions for subject + filters
  let q = supa.from('question').select('id').eq('subject_id', subjectId).eq('status','published');
  if (topics.length){
    q = q.in('id', (await supa.from('question_topic').select('question_id').in('topic_id', topics)).data?.map(r=>r.question_id) || []);
  }
  if (tags.length){
    q = q.in('id', (await supa.from('question_tag').select('question_id').in('tag_id', tags)).data?.map(r=>r.question_id) || []);
  }
  const poolRes = await q;
  const pool = (poolRes.data||[]).map(r=>r.id);

  // 2) Subtract seen for this user+filter (NOTE: replace user_id with real session user in production)
  const user_id = '00000000-0000-0000-0000-000000000000'; // TODO: use auth
  const seenRes = await supa.from('user_question_seen').select('question_id').eq('user_id', user_id).eq('subject_id', subjectId).eq('filter_hash', filterHash);
  const seen = new Set((seenRes.data||[]).map(r=>r.question_id));
  const remaining = pool.filter(id => !seen.has(id));

  // 3) Deterministic shuffle by seed (simple sort as placeholder)
  const shuffled = [...remaining];
  shuffled.sort(() => Math.random() - 0.5);

  const chosen = shuffled.slice(0, Math.min(n, shuffled.length));

  // If not enough, fill with least-recently-seen from pool (placeholder: take from start of pool)
  if (chosen.length < n){
    const fill = pool.filter(id => !chosen.includes(id)).slice(0, n - chosen.length);
    chosen.push(...fill);
  }

  // 4) Create attempt and items
  const { data: subj } = await supa.from('subject').select('scoring_correct, scoring_wrong, scoring_blank').eq('id', subjectId).single();
  const scoring_snapshot = subj || { scoring_correct: 0.5, scoring_wrong: -0.15, scoring_blank: 0 };
  const attemptIns = await supa.from('attempt').insert({
    user_id,
    subject_id: subjectId,
    filter_hash: filterHash,
    seed,
    total_questions: n,
    scoring_snapshot
  }).select('id').single();

  const attemptId = attemptIns.data!.id as string;

  // Fetch choices for each question and shuffle options deterministically (placeholder shuffle)
  const items: any[] = [];
  let orderIndex = 1;
  for (const qid of chosen){
    const { data: choices } = await supa.from('choice').select('id, is_correct').eq('question_id', qid);
    const ifc = (choices||[]).map(c=>c.id);
    // naive shuffle just for starter
    const shuffledChoices = ifc.sort(() => Math.random() - 0.5);
    const correctIdx = shuffledChoices.findIndex(id => choices?.find(c=>c.id===id)?.is_correct);
    items.push({
      attempt_id: attemptId,
      question_id: qid,
      order_index: orderIndex++,
      choices_order: shuffledChoices,
      correct_index: correctIdx
    });
  }
  await supa.from('attempt_item').insert(items);

  return NextResponse.redirect(new URL(`/attempt/${attemptId}/q/1`, req.url));
}
