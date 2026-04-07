interface MetricCardProps {
  label: string
  value: string
  colorClass?: string
}

export default function MetricCard({
  label,
  value,
  colorClass = 'text-gray-900',
}: MetricCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  )
}
