

export interface StockCountItemDTO {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  productUnit: string;
  systemQuantity: number;
  countedQuantity: number | null;
  status: string;
  observacao: string | null;
  updatedAt: string;
}

export interface StockCountDTO {
  id: string;
  code: string;
  scheduledAt: string;
  status: string;
  employee: {
    id: string;
    name: string;
    email: string;
  };
  items: {
    A_CONFERIR: StockCountItemDTO[];
    CONFERIDO: StockCountItemDTO[];
    FALTANTE_EXCEDENTE: StockCountItemDTO[];
  };
  summary: {
    total: number;
    aConferir: number;
    conferido: number;
    faltanteExcedente: number;
  };
}

export interface UpdateItemInput {
  countedQuantity: number;
  observacao?: string;
}

export interface UpdateStockCountStatusInput {
  action: "SAVE" | "FINALIZE";
}

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

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: unknown };
