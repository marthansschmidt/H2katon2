import { getScoreGrade, MAX_GAME_SCORE, SCORE_GRADES } from '../game/scoring';

export function ScoreGrade({ score }: { score: number }) {
  const grade = getScoreGrade(score);
  return <section className={`score-grade grade-${grade.letter}`} aria-label="Lõpphinne">
    <div className="grade-heading"><strong className="grade-letter" aria-label={`Hinne ${grade.letter}`}>{grade.letter}</strong><div>
      <span className="eyebrow">Sinu lõpphinne</span><h2>{grade.title}</h2><p>{score} / {MAX_GAME_SCORE} punkti</p>
    </div></div>
    <p className="grade-feedback">{grade.feedback}</p>
    <ul className="grade-scale" aria-label="Hindeskaala">{SCORE_GRADES.map((item, index) => {
      const upper = index === 0 ? MAX_GAME_SCORE : SCORE_GRADES[index - 1].minScore - 1;
      return <li key={item.letter} aria-current={item.letter === grade.letter ? 'true' : undefined} title={`${item.letter}: ${item.minScore}–${upper} punkti`}>
        <strong>{item.letter}</strong><span>{item.letter === 'F' ? `<${SCORE_GRADES[index - 1].minScore}` : `${item.minScore}+`}</span>
      </li>;
    })}</ul>
  </section>;
}
