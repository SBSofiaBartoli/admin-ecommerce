interface StatusBadgeProps {
  status: string;
  labels: Record<string, string>;
  colors: Record<string, string>;
}

export default function StatusBadge({
  status,
  labels,
  colors,
}: StatusBadgeProps) {
  return (
    <span
      className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap ${colors[status] ?? "bg-gray-100 text-gray-700 border border-gray-200"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}
