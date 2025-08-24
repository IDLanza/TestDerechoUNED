export function computeScore(correct: number, wrong: number, blank: number, scoring: {correct:number, wrong:number, blank:number}){
  const raw = correct*scoring.correct + wrong*scoring.wrong + blank*scoring.blank;
  // Boundaries 0..10 (simple; could scale if needed)
  return Math.max(0, Math.min(10, raw));
}
