"use client";

import { StockCountDTO } from "@/types";

interface Props {
  stockCount: StockCountDTO;
  saving: boolean;
  onSave: () => void;
  onFinalize: () => void;
}

export function GlobalActions({ stockCount, saving, onSave, onFinalize }: Props) {
  const { summary } = stockCount;
  const allCounted = summary.aConferir === 0;
  const hasPendingObs = stockCount.items.FALTANTE_EXCEDENTE.some(
    (i) => !i.observacao || i.observacao.trim().length === 0
  );
  const canFinalize = allCounted && !hasPendingObs;

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 p-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Status info */}
        <div className="space-y-1">
          <p className="font-display text-sm font-700 text-neutral-300 uppercase tracking-wide">
            Ações da Contagem
          </p>
          <div className="space-y-0.5">
            {!allCounted && (
              <p className="font-mono text-xs text-amber-600">
                ⚠ {summary.aConferir} item(s) ainda não conferido(s)
              </p>
            )}
            {hasPendingObs && (
              <p className="font-mono text-xs text-red-500">
                ✗ Há divergências sem observação preenchida
              </p>
            )}
            {canFinalize && (
              <p className="font-mono text-xs text-emerald-500">
                ✓ Todos os itens conferidos e observações preenchidas
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 flex-shrink-0">
          <button
            disabled={saving}
            onClick={onSave}
            className="btn-ghost flex items-center gap-2"
          >
            {saving ? (
              <span className="inline-block w-3 h-3 border border-neutral-400/30 border-t-neutral-300 rounded-full animate-spin" />
            ) : (
              <span className="text-xs">💾</span>
            )}
            Salvar Contagem
          </button>

          <button
            disabled={!canFinalize}
            onClick={onFinalize}
            className="btn-success flex items-center gap-2"
            title={
              !canFinalize
                ? "Confira todos os itens e preencha as observações para finalizar"
                : "Finalizar e bloquear a contagem"
            }
          >
            <span className="text-xs">🔒</span>
            Finalizar Conferência
          </button>
        </div>
      </div>
    </div>
  );
}
