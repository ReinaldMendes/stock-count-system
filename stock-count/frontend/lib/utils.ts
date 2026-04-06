export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const STATUS_LABELS = {
  PENDENTE: "Pendente",
  EM_ANDAMENTO: "Em andamento",
  FINALIZADA: "Finalizada",
  A_CONFERIR: "A conferir",
  CONFERIDO: "Conferido",
  FALTANTE_EXCEDENTE: "Faltante / Excedente",
} as const;
