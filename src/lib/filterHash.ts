import crypto from 'crypto';

export function makeFilterHash(subjectId: number, topicIds: number[], tagIds: number[]) {
  const s = JSON.stringify({
    subjectId,
    topics: [...new Set(topicIds)].sort((a,b)=>a-b),
    tags: [...new Set(tagIds)].sort((a,b)=>a-b),
  });
  return crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
}
