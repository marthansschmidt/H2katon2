export function DayProgress({ day }: { day: number }) {
  return <div className="day-progress" role="img" aria-label={`Päev ${day} kolmest`}>{[1, 2, 3].map(value => <span key={value} className={`day-dot ${value < day ? 'done' : ''} ${value === day ? 'active' : ''}`} />)}</div>;
}
