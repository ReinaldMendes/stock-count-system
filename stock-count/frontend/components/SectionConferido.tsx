"use client";

import { StockCountItemDTO } from "@/types";
import { SectionHeader } from "./SectionHeader";
import { formatDateTime } from "@/lib/utils";

interface Props {
  items: StockCountItemDTO[];
}

export function SectionConferido({ items }: Props) {
  return (
    <section className="panel overflow-hidden">
      <SectionHeader
        color="bg-emerald-600"
        label="Conferidos"
        count={items.length}
        icon="✓"
      />

      {items.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="font-mono text-sm text-neutral-600">
            Nenhum item conferido ainda.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900">
                <th className="px-6 py-3 text-left font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
                  Código
                </th>
                <th className="px-6 py-3 text-left font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
                  Produto
                </th>
                <th className="px-6 py-3 text-right font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
                  Qtd. Sistema
                </th>
                <th className="px-6 py-3 text-right font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
                  Qtd. Contada
                </th>
                <th className="px-6 py-3 text-right font-mono text-[10px] text-neutral-600 uppercase tracking-widest hidden md:table-cell">
                  Conferido em
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {items.map((item) => (
                <tr key={item.id} className="table-row-hover">
                  <td className="px-6 py-3">
                    <span className="font-mono text-[10px] text-emerald-500 bg-emerald-950/40 border border-emerald-900/50 px-1.5 py-0.5 uppercase tracking-wider">
                      {item.productCode}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="font-display text-sm font-500 text-neutral-300">
                      {item.productName}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right font-mono text-sm text-neutral-500">
                    {item.systemQuantity} {item.productUnit}
                  </td>
                  <td className="px-6 py-3 text-right font-mono text-sm text-emerald-400 font-700">
                    {item.countedQuantity} {item.productUnit}
                  </td>
                  <td className="px-6 py-3 text-right font-mono text-xs text-neutral-700 hidden md:table-cell">
                    {formatDateTime(item.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
