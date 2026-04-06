"use client";

import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { StockCountDTO } from "@/types";
import { formatDate, STATUS_LABELS } from "@/lib/utils";

interface Props {
  stockCount: StockCountDTO;
}

const statusClass: Record<string, string> = {
  PENDENTE: "badge-pendente",
  EM_ANDAMENTO: "badge-em-andamento",
  FINALIZADA: "badge-finalizada",
};

export function PageHeader({ stockCount }: Props) {
  const router = useRouter();
  const { summary } = stockCount;
  const progress =
    summary.total > 0
      ? Math.round(
          ((summary.conferido + summary.faltanteExcedente) / summary.total) * 100
        )
      : 0;

  return (
    <header className="grid-bg border-b border-neutral-800 relative overflow-hidden">
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Home button and Breadcrumb */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.push("/")}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Voltar para tela inicial"
          >
            <Home className="w-5 h-5 text-neutral-400 hover:text-blue-400 transition-colors" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-neutral-600 uppercase tracking-widest">
              StockOps
            </span>
            <span className="text-neutral-700">/</span>
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
              Contagem
            </span>
            <span className="text-neutral-700">/</span>
            <span className="font-mono text-xs text-blue-500 uppercase tracking-widest">
              {stockCount.code}
            </span>
          </div>
        </div>

        {/* Title row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-1.5 h-14 bg-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-800 text-white tracking-tight uppercase leading-none">
                {stockCount.code}
              </h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                <MetaItem label="Data" value={formatDate(stockCount.scheduledAt)} />
                <MetaItem label="Responsável" value={stockCount.employee.name} />
                <MetaItem
                  label="Total de Itens"
                  value={`${summary.total} SKUs`}
                />
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div className={`inline-flex items-center px-3 py-1.5 text-xs font-mono uppercase tracking-widest font-700 flex-shrink-0 ${statusClass[stockCount.status]}`}>
            <span
              className={`w-1.5 h-1.5 rounded-full mr-2 ${
                stockCount.status === "FINALIZADA"
                  ? "bg-emerald-400"
                  : stockCount.status === "EM_ANDAMENTO"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-neutral-400"
              }`}
            />
            {STATUS_LABELS[stockCount.status]}
          </div>
        </div>

        {/* Progress section */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
              Progresso da Conferência
            </span>
            <span className="font-display text-sm font-700 text-neutral-300">
              {progress}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-neutral-800 relative overflow-hidden">
            {/* Conferido portion */}
            <div
              className="h-full bg-emerald-600 absolute left-0 top-0 transition-all duration-500"
              style={{
                width: `${summary.total > 0 ? (summary.conferido / summary.total) * 100 : 0}%`,
              }}
            />
            {/* Faltante portion (stacked) */}
            <div
              className="h-full bg-red-600 absolute top-0 transition-all duration-500"
              style={{
                left: `${summary.total > 0 ? (summary.conferido / summary.total) * 100 : 0}%`,
                width: `${summary.total > 0 ? (summary.faltanteExcedente / summary.total) * 100 : 0}%`,
              }}
            />
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 pt-1">
            <LegendItem color="bg-neutral-600" label="A Conferir" count={summary.aConferir} />
            <LegendItem color="bg-emerald-600" label="Conferido" count={summary.conferido} />
            <LegendItem color="bg-red-600" label="Faltante/Excedente" count={summary.faltanteExcedente} />
          </div>
        </div>
      </div>
    </header>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
        {label}
      </span>
      <span className="font-mono text-sm text-neutral-300">{value}</span>
    </div>
  );
}

function LegendItem({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2.5 h-1.5 ${color}`} />
      <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
        {label}
      </span>
      <span className="font-mono text-[10px] text-neutral-400 font-700">
        ({count})
      </span>
    </div>
  );
}
