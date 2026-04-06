"use client";

import { useState } from "react";
import { StockCountItemDTO } from "@/types";
import { SectionHeader } from "./SectionHeader";

interface Props {
  items: StockCountItemDTO[];
  isFinalized: boolean;
  onItemUpdate: (
    itemId: string,
    countedQuantity: number,
    observacao?: string
  ) => Promise<void>;
}

export function SectionFaltanteExcedente({ items, isFinalized, onItemUpdate }: Props) {
  const [editingObs, setEditingObs] = useState<Record<string, string>>({});
  const [savingObs, setSavingObs] = useState<Record<string, boolean>>({});
  const [obsErrors, setObsErrors] = useState<Record<string, string>>({});

  const handleObsSave = async (item: StockCountItemDTO) => {
    const obs = editingObs[item.id] ?? item.observacao ?? "";
    if (!obs.trim()) {
      setObsErrors((p) => ({ ...p, [item.id]: "Observação não pode estar vazia." }));
      return;
    }
    setSavingObs((p) => ({ ...p, [item.id]: true }));
    setObsErrors((p) => ({ ...p, [item.id]: "" }));
    try {
      await onItemUpdate(item.id, item.countedQuantity!, obs.trim());
      setEditingObs((p) => { const n = { ...p }; delete n[item.id]; return n; });
    } catch {
      // error shown via toast in parent
    } finally {
      setSavingObs((p) => ({ ...p, [item.id]: false }));
    }
  };

  return (
    <section className="panel overflow-hidden">
      <SectionHeader
        color="bg-red-600"
        label="Faltante / Excedente"
        count={items.length}
        icon="⚠"
      />

      {items.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="font-mono text-sm text-neutral-600">
            Nenhuma divergência encontrada.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-800">
          {items.map((item) => {
            const diff = (item.countedQuantity ?? 0) - item.systemQuantity;
            const isExcess = diff > 0;
            const obsValue = editingObs[item.id] ?? item.observacao ?? "";
            const isEditing = item.id in editingObs;

            return (
              <div key={item.id} className="px-4 md:px-6 py-4 space-y-3 table-row-hover">
                {/* Top row: product info + diff badge */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-red-400 bg-red-950/50 border border-red-900 px-1.5 py-0.5 uppercase tracking-wider">
                        {item.productCode}
                      </span>
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.5 uppercase tracking-wider font-700 ${
                          isExcess
                            ? "text-amber-400 bg-amber-950/50 border border-amber-900"
                            : "text-red-400 bg-red-950/50 border border-red-900"
                        }`}
                      >
                        {isExcess ? `+${diff}` : diff} {item.productUnit}
                      </span>
                    </div>
                    <p className="font-display text-base font-600 text-neutral-200">
                      {item.productName}
                    </p>
                  </div>

                  {/* Quantities */}
                  <div className="flex gap-6">
                    <div className="text-right">
                      <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
                        Sistema
                      </p>
                      <p className="font-mono text-sm text-neutral-400">
                        {item.systemQuantity} {item.productUnit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
                        Contado
                      </p>
                      <p className={`font-mono text-sm font-700 ${isExcess ? "text-amber-400" : "text-red-400"}`}>
                        {item.countedQuantity} {item.productUnit}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Observation */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-red-600 uppercase tracking-widest block">
                    Observação {!item.observacao && !isFinalized && "(obrigatória)"}
                  </label>

                  {isFinalized ? (
                    <div className="bg-neutral-800/50 border border-neutral-800 px-3 py-2">
                      <p className="font-mono text-xs text-neutral-400">
                        {item.observacao || (
                          <span className="text-neutral-600 italic">Sem observação registrada.</span>
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-start">
                      <div className="flex-1 space-y-1">
                        <textarea
                          rows={2}
                          value={obsValue}
                          placeholder="Descreva a divergência..."
                          onChange={(e) => {
                            setEditingObs((p) => ({ ...p, [item.id]: e.target.value }));
                            setObsErrors((p) => ({ ...p, [item.id]: "" }));
                          }}
                          className="input-field w-full resize-none"
                        />
                        {obsErrors[item.id] && (
                          <p className="font-mono text-xs text-red-400">
                            {obsErrors[item.id]}
                          </p>
                        )}
                      </div>
                      {(isEditing || !item.observacao) && (
                        <button
                          disabled={savingObs[item.id]}
                          onClick={() => handleObsSave(item)}
                          className="btn-ghost flex-shrink-0 flex items-center gap-2"
                        >
                          {savingObs[item.id] ? (
                            <span className="inline-block w-3 h-3 border border-neutral-400/30 border-t-neutral-300 rounded-full animate-spin" />
                          ) : (
                            "Salvar obs."
                          )}
                        </button>
                      )}
                      {item.observacao && !isEditing && (
                        <button
                          onClick={() =>
                            setEditingObs((p) => ({ ...p, [item.id]: item.observacao! }))
                          }
                          className="btn-ghost flex-shrink-0 text-xs"
                        >
                          Editar
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
