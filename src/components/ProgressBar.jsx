export default function ProgressBar({ value, label }) {
  const clamped = Math.max(0, Math.min(100, value || 0))

  return (
    <div className="progress">
      <div className="progress-track" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${clamped}%` }} />
      </div>
      {label ? <span className="progress-label">{label}</span> : null}
    </div>
  )
}
