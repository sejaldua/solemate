export default function ConfidenceBar({
  value,
  label,
  color = "bg-neon-green",
  maxValue = 1,
}: {
  value: number;
  label?: string;
  color?: string;
  maxValue?: number;
}) {
  const pct = Math.round((value / maxValue) * 100);

  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between text-xs">
          <span className="text-text-secondary">{label}</span>
          <span className="text-text-primary">{pct}%</span>
        </div>
      )}
      <div className="h-1.5 bg-bg rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
