"use client";

import { useState, useCallback, useEffect } from "react";
import { StockCountDTO } from "@/types";
import { api } from "@/lib/api";
import { PageHeader } from "./PageHeader";
import { SectionAConferir } from "./SectionAConferir";
import { SectionConferido } from "./SectionConferido";
import { SectionFaltanteExcedente } from "./SectionFaltanteExcedente";
import { GlobalActions } from "./GlobalActions";
import { FinalizeModal } from "./FinalizeModal";
import { Toast } from "./Toast";

interface Props {
  id: string;
}

export type ToastType = { message: string; type: "success" | "error" | "info" };

export function StockCountClient({ id }: Props) {
  const [stockCount, setStockCount] = useState<StockCountDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [toast, setToast] = useState<ToastType | null>(null);

  const showToast = useCallback((message: string, type: ToastType["type"]) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Fetch stock count
  const fetchStockCount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getStockCount(id);
      setStockCount(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar contagem.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStockCount();
  }, [fetchStockCount]);

  // Update item after counting
  const handleItemUpdate = useCallback(
    async (itemId: string, countedQuantity: number, observacao?: string) => {
      if (!stockCount) return;
      try {
        const updatedItem = await api.updateItem(itemId, {
          countedQuantity,
          observacao,
        });

        // Optimistic update: rebuild groups with new item status
        setStockCount((prev) => {
          if (!prev) return prev;
          const allItems = [
            ...prev.items.A_CONFERIR,
            ...prev.items.CONFERIDO,
            ...prev.items.FALTANTE_EXCEDENTE,
          ].map((item) => (item.id === itemId ? updatedItem : item));

          const grouped = {
            A_CONFERIR: allItems.filter((i) => i.status === "A_CONFERIR"),
            CONFERIDO: allItems.filter((i) => i.status === "CONFERIDO"),
            FALTANTE_EXCEDENTE: allItems.filter(
              (i) => i.status === "FALTANTE_EXCEDENTE"
            ),
          };

          return {
            ...prev,
            items: grouped,
            summary: {
              total: allItems.length,
              aConferir: grouped.A_CONFERIR.length,
              conferido: grouped.CONFERIDO.length,
              faltanteExcedente: grouped.FALTANTE_EXCEDENTE.length,
            },
          };
        });

        showToast("Item conferido com sucesso.", "success");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao atualizar item.";
        showToast(msg, "error");
        throw err; // Re-throw so child can handle loading state
      }
    },
    [stockCount, showToast]
  );

  // Save as EM_ANDAMENTO
  const handleSave = useCallback(async () => {
    if (!stockCount) return;
    try {
      setSaving(true);
      await api.saveStockCount(id);
      setStockCount((prev) =>
        prev ? { ...prev, status: "EM_ANDAMENTO" } : prev
      );
      showToast("Contagem salva com sucesso.", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar.";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }, [stockCount, id, showToast]);

  // Finalize
  const handleFinalize = useCallback(async () => {
    if (!stockCount) return;
    try {
      setFinalizing(true);
      await api.finalizeStockCount(id);
      setStockCount((prev) =>
        prev ? { ...prev, status: "FINALIZADA" } : prev
      );
      setShowFinalizeModal(false);
      showToast("Conferência finalizada com sucesso!", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao finalizar.";
      showToast(msg, "error");
      setShowFinalizeModal(false);
    } finally {
      setFinalizing(false);
    }
  }, [stockCount, id, showToast]);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="panel p-8 max-w-md text-center space-y-4">
          <div className="w-2 h-2 bg-red-500 rounded-full mx-auto" />
          <p className="font-display text-lg font-700 text-red-400 uppercase tracking-wide">
            Erro ao carregar
          </p>
          <p className="font-mono text-sm text-neutral-400">{error}</p>
          <button className="btn-ghost w-full" onClick={fetchStockCount}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || !stockCount) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-blue-500 animate-pulse" />
          <span className="font-mono text-sm text-neutral-500">
            Carregando contagem...
          </span>
        </div>
      </div>
    );
  }

  const isFinalized = stockCount.status === "FINALIZADA";

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Page Header */}
      <PageHeader stockCount={stockCount} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {/* Section A_CONFERIR */}
        <SectionAConferir
          items={stockCount.items.A_CONFERIR}
          isFinalized={isFinalized}
          onItemUpdate={handleItemUpdate}
        />

        {/* Section FALTANTE_EXCEDENTE */}
        <SectionFaltanteExcedente
          items={stockCount.items.FALTANTE_EXCEDENTE}
          isFinalized={isFinalized}
          onItemUpdate={handleItemUpdate}
        />

        {/* Section CONFERIDO */}
        <SectionConferido items={stockCount.items.CONFERIDO} />

        {/* Global Actions */}
        {!isFinalized && (
          <GlobalActions
            stockCount={stockCount}
            saving={saving}
            onSave={handleSave}
            onFinalize={() => setShowFinalizeModal(true)}
          />
        )}

        {/* Finalized banner */}
        {isFinalized && (
          <div className="border border-emerald-800 bg-emerald-950/50 p-6 flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
            <div>
              <p className="font-display text-lg font-700 text-emerald-400 uppercase tracking-wide">
                Conferência Finalizada
              </p>
              <p className="font-mono text-xs text-emerald-700 mt-1">
                Esta contagem foi finalizada e está bloqueada para edição.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Finalize Modal */}
      {showFinalizeModal && (
        <FinalizeModal
          stockCount={stockCount}
          finalizing={finalizing}
          onConfirm={handleFinalize}
          onCancel={() => setShowFinalizeModal(false)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
