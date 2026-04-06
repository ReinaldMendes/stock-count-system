import { StockCountDTO, StockCountItemDTO, ApiResponse } from "@/types";
import { useAuthStore } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
export interface StockCountListItem {
  id: string;
  code: string;
  scheduledAt: string;
  status: string;
  employee: {
    id: string;
    name: string;
  };
  itemCount: number;
}
async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = useAuthStore.getState().token;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options?.headers && typeof options.headers === "object") {
    Object.assign(headers, options.headers);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    if (res.status === 401) {
      useAuthStore.getState().logout();
    }
    throw new Error(json.error || "Erro desconhecido.");
  }

  return json.data;
}

export const api = {
  getAllStockCounts: (): Promise<StockCountListItem[]> =>
    request<StockCountListItem[]>(`/stock-counts`),

  getStockCount: (id: string): Promise<StockCountDTO> =>
    request<StockCountDTO>(`/stock-counts/${id}`),

  updateItem: (
    itemId: string,
    body: { countedQuantity: number; observacao?: string }
  ): Promise<StockCountItemDTO> =>
    request<StockCountItemDTO>(`/stock-count-items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  saveStockCount: (id: string): Promise<{ id: string; status: string }> =>
    request(`/stock-counts/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ action: "SAVE" }),
    }),

  finalizeStockCount: (id: string): Promise<{ id: string; status: string }> =>
    request(`/stock-counts/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ action: "FINALIZE" }),
    }),
};
