"use client";

import { useState, useRef } from "react";
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

interface ItemRowState {
  qty: string;
  obs: string;
  loading: boolean;
  error: string | null;
  needsObs: boolean;
}

export function SectionAConferir({ items, isFinalized, onItemUpdate }: Props) {
  const [rowStates, setRowStates] = useState<Record<string, ItemRowState>>({});

  const getState = (id: string): ItemRowState =>
    rowStates[id] ?? { qty: "", obs: "", loading: false, error: null, needsObs: false };

  const setState = (id: string, patch: Partial<ItemRowState>) =>
    setRowStates((prev) => ({
      ...prev,
      [id]: { ...getState(id), ...patch },
    }));

  const handleConfirm = async (item: StockCountItemDTO) => {
    const state = getState(item.id);
    const qty = parseFloat(state.qty);

    if (state.qty.trim() === "" || isNaN(qty) || qty < 0) {
      setState(item.id, { error: "Informe uma quantidade válida." });
      return;
    }

    // Check if divergence and no obs
    const differs = qty !== item.systemQuantity;
    if (differs && (!state.obs || state.obs.trim().length === 0)) {
      setState(item.id, {
        needsObs: true,
        error: "Quantidade divergente — preencha a observação.",
      });
      return;
    }

    setState(item.id, { loading: true, error: null });
    try {
      await onItemUpdate(item.id, qty, state.obs || undefined);
      setState(item.id, { qty: "", obs: "", loading: false, needsObs: false });
    } catch {
      setState(item.id, { loading: false });
    }
  };

  return (
    <section className="panel overflow-hidden">
      <SectionHeader
        color="bg-blue-600"
        label="A Conferir"
        count={items.length}
        icon="⬜"
      />

      {items.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="font-mono text-sm text-neutral-600">
            Todos os itens foram conferidos.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-800">
          {items.map((item) => {
            const state = getState(item.id);
            const qty = parseFloat(state.qty);
            const differs =
              !isNaN(qty) && state.qty !== "" && qty !== item.systemQuantity;

            return (
              <div key={item.id} className="table-row-hover">
                {/* Item row */}
                <div className="px-4 md:px-6 py-4 grid grid-cols-12 gap-3 items-start">
                  {/* Product info */}
                  <div className="col-span-12 md:col-span-5 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-blue-500 bg-blue-950/50 border border-blue-900 px-1.5 py-0.5 uppercase tracking-wider">
                        {item.productCode}
                      </span>
                    </div>
                    <p className="font-display text-base font-600 text-neutral-200">
                      {item.productName}
                    </p>
                    <p className="font-mono text-xs text-neutral-600">
                      Sistema:{" "}
                      <span className="text-neutral-400 font-700">
                        {item.systemQuantity} {item.productUnit}
                      </span>
                    </p>
                  </div>

                  {/* Quantity input */}
                  <div className="col-span-7 md:col-span-4">
                    <label className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest block mb-1">
                      Quantidade Contada
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        disabled={isFinalized || state.loading}
                        value={state.qty}
                        onChange={(e) =>
                          setState(item.id, {
                            qty: e.target.value,
                            error: null,
                            needsObs: parseFloat(e.target.value) !== item.systemQuantity,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleConfirm(item);
                        }}
                        className="input-field w-full"
                      />
                      <span className="font-mono text-xs text-neutral-600 flex-shrink-0">
                        {item.productUnit}
                      </span>
                    </div>
                    {/* Divergence hint */}
                    {differs && (
                      <p className="font-mono text-[10px] text-amber-500 mt-1">
                        ⚠ Divergência:{" "}
                        {qty - item.systemQuantity > 0 ? "+" : ""}
                        {(qty - item.systemQuantity).toFixed(0)} {item.productUnit}
                      </p>
                    )}
                  </div>

                  {/* Confirm button */}
                  <div className="col-span-5 md:col-span-3 flex flex-col justify-end">
                    <label className="font-mono text-[10px] text-transparent uppercase tracking-widest block mb-1 select-none">
                      .
                    </label>
                    <button
                      disabled={isFinalized || state.loading || state.qty.trim() === ""}
                      onClick={() => handleConfirm(item)}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {state.loading ? (
                        <span className="inline-block w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Confirmar"
                      )}
                    </button>
                  </div>

                  {/* Error message */}
                  {state.error && (
                    <div className="col-span-12">
                      <p className="font-mono text-xs text-red-400 bg-red-950/30 border border-red-900/50 px-3 py-2">
                        {state.error}
                      </p>
                    </div>
                  )}
                </div>

                {/* Observation field — shown when divergence */}
                {(state.needsObs || differs) && (
                  <div className="px-4 md:px-6 pb-4">
                    <label className="font-mono text-[10px] text-amber-600 uppercase tracking-widest block mb-1">
                      Observação (obrigatória para divergências)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Descreva a divergência encontrada..."
                      disabled={isFinalized || state.loading}
                      value={state.obs}
                      onChange={(e) =>
                        setState(item.id, { obs: e.target.value, error: null })
                      }
                      className="input-field w-full resize-none"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
