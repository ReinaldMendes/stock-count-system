"use client";

import { useEffect } from "react";
import { StockCountDTO } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props {
  stockCount: StockCountDTO;
  finalizing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function FinalizeModal({ stockCount, finalizing, onConfirm, onCancel }: Props) {
  const { summary } = stockCount;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !finalizing) onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [finalizing, onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={(e) => { if (e.target === e.currentTarget && !finalizing) onCancel(); }}
    >
      <div className="bg-neutral-900 border border-neutral-700 w-full max-w-md shadow-2xl">
        {/* Modal header stripe */}
        <div className="h-1 w-full bg-emerald-600" />

        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <p className="font-mono text-[10px] text-emerald-600 uppercase tracking-widest mb-1">
              Confirmação
            </p>
            <h2 className="font-display text-2xl font-800 text-white uppercase tracking-tight">
              Finalizar Conferência?
            </h2>
          </div>

          {/* Warning */}
          <div className="bg-amber-950/40 border border-amber-900/50 px-4 py-3">
            <p className="font-mono text-xs text-amber-400">
              ⚠ Esta ação não pode ser desfeita. A contagem será bloqueada para edição.
            </p>
          </div>

          {/* Summary */}
          <div className="space-y-1.5">
            <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
              Resumo da Contagem
            </p>
            <div className="bg-neutral-800/50 border border-neutral-800 divide-y divide-neutral-800">
              <SummaryRow label="Código" value={stockCount.code} />
              <SummaryRow label="Data" value={formatDate(stockCount.scheduledAt)} />
              <SummaryRow label="Responsável" value={stockCount.employee.name} />
              <SummaryRow label="Total de Itens" value={`${summary.total}`} />
              <SummaryRow
                label="Conferidos"
                value={`${summary.conferido}`}
                valueClass="text-emerald-400"
              />
              <SummaryRow
                label="Divergências"
                value={`${summary.faltanteExcedente}`}
                valueClass={summary.faltanteExcedente > 0 ? "text-red-400" : "text-neutral-400"}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              disabled={finalizing}
              onClick={onCancel}
              className="btn-ghost flex-1"
            >
              Cancelar
            </button>
            <button
              disabled={finalizing}
              onClick={onConfirm}
              className="btn-success flex-1 flex items-center justify-center gap-2"
            >
              {finalizing ? (
                <>
                  <span className="inline-block w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  Finalizando...
                </>
              ) : (
                <>
                  <span>🔒</span>
                  Confirmar Finalização
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueClass = "text-neutral-300",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center px-3 py-2">
      <span className="font-mono text-xs text-neutral-500">{label}</span>
      <span className={`font-mono text-xs font-700 ${valueClass}`}>{value}</span>
    </div>
  );
}
