import { Star, StarSolid } from './Icons';
import { getScoreRating, MAX_GAME_SCORE } from '../game/scoring';

export function ScoreRating({ score }: { score: number }) {
  const rating = getScoreRating(score);
  return <section className="score-rating" aria-label="Lõpptulemus">
    <div className="rating-heading">
      <p className="rating-score-value"><strong>{score}</strong><span> / {MAX_GAME_SCORE} punkti</span></p>
    </div>
    <div className="rating-stars" role="img" aria-label={`${rating.stars} ${rating.stars === 1 ? 'tärn' : 'tärni'} 5-st`}>
      {[1, 2, 3, 4, 5].map(star => {
        const earned = star <= rating.stars;
        const Icon = earned ? StarSolid : Star;
        return <Icon key={star} className={`rating-star${earned ? ' is-earned' : ''}`} size={40} />;
      })}
    </div>
    <h2 className="rating-title">{rating.title}</h2>
    <p className="rating-feedback">{rating.feedback}</p>
  </section>;
}
