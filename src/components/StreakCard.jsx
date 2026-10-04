export default function StreakCard({ current, longest }) {
  return (
    <div className="streak-row">
      <article className="stat-card accent">
        <p className="stat-kicker">Current Streak</p>
        <p className="stat-value">🔥 {current} {current === 1 ? 'Day' : 'Days'}</p>
      </article>
      <article className="stat-card">
        <p className="stat-kicker">Longest Streak</p>
        <p className="stat-value">🏆 {longest} {longest === 1 ? 'Day' : 'Days'}</p>
      </article>
    </div>
  )
}
