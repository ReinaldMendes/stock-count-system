interface Props {
  color: string;
  label: string;
  count: number;
  icon: string;
}

export function SectionHeader({ color, label, count, icon }: Props) {
  return (
    <div className="flex items-center gap-0 border-b border-neutral-800">
      {/* Color stripe */}
      <div className={`w-1 self-stretch ${color} flex-shrink-0`} />
      <div className="flex items-center justify-between w-full px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-base select-none" aria-hidden>
            {icon}
          </span>
          <span className="font-display text-lg font-700 text-neutral-200 uppercase tracking-wide">
            {label}
          </span>
        </div>
        <div className={`font-mono text-xs font-700 px-2 py-0.5 border ${
          color.includes("blue")
            ? "text-blue-400 border-blue-800 bg-blue-950/50"
            : color.includes("emerald")
            ? "text-emerald-400 border-emerald-800 bg-emerald-950/50"
            : "text-red-400 border-red-800 bg-red-950/50"
        }`}>
          {count} {count === 1 ? "item" : "itens"}
        </div>
      </div>
    </div>
  );
}
