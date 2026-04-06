"use client";

interface Props {
  message: string;
  type: "success" | "error" | "info";
}

const styles = {
  success: {
    bar: "bg-emerald-500",
    icon: "✓",
    text: "text-emerald-400",
    bg: "bg-neutral-900 border-emerald-800",
  },
  error: {
    bar: "bg-red-500",
    icon: "✗",
    text: "text-red-400",
    bg: "bg-neutral-900 border-red-800",
  },
  info: {
    bar: "bg-blue-500",
    icon: "i",
    text: "text-blue-400",
    bg: "bg-neutral-900 border-blue-800",
  },
};

export function Toast({ message, type }: Props) {
  const s = styles[type];

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-stretch shadow-2xl border max-w-sm ${s.bg}`}
      style={{ animation: "slideIn 0.2s ease-out" }}
    >
      <div className={`w-1 flex-shrink-0 ${s.bar}`} />
      <div className="flex items-center gap-3 px-4 py-3">
        <span className={`font-mono text-sm font-700 flex-shrink-0 ${s.text}`}>
          {s.icon}
        </span>
        <p className="font-mono text-xs text-neutral-300">{message}</p>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
