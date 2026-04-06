export type StockCountStatus = "PENDENTE" | "EM_ANDAMENTO" | "FINALIZADA";
export type StockCountItemStatus = "A_CONFERIR" | "CONFERIDO" | "FALTANTE_EXCEDENTE";

export interface StockCountItemDTO {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  productUnit: string;
  systemQuantity: number;
  countedQuantity: number | null;
  status: StockCountItemStatus;
  observacao: string | null;
  updatedAt: string;
}

export interface StockCountDTO {
  id: string;
  code: string;
  scheduledAt: string;
  status: StockCountStatus;
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

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
