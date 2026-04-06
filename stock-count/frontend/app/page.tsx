"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import type { StockCountListItem } from "@/lib/api";
import {
  Search,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  ChevronDown,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const [stockCounts, setStockCounts] = useState<StockCountListItem[]>([]);
  const [filtered, setFiltered] = useState<StockCountListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Proteção de rota
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  // Buscar dados
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await api.getAllStockCounts();
        setStockCounts(data);
        setFiltered(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchData();
    }
  }, [token]);

  // Filtrar e buscar
  useEffect(() => {
    let result = stockCounts;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.code.toLowerCase().includes(term) ||
          item.employee.name.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    setFiltered(result);
  }, [searchTerm, statusFilter, stockCounts]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case "EM_ANDAMENTO":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "FINALIZADA":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      PENDENTE: "Pendente",
      EM_ANDAMENTO: "Em andamento",
      FINALIZADA: "Finalizada",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "PENDENTE":
        return "bg-amber-900/20 border-amber-800 text-amber-200";
      case "EM_ANDAMENTO":
        return "bg-blue-900/20 border-blue-800 text-blue-200";
      case "FINALIZADA":
        return "bg-green-900/20 border-green-800 text-green-200";
      default:
        return "bg-neutral-900/20 border-neutral-800 text-neutral-200";
    }
  };

  if (!token) return null;

  return (
    <main className="min-h-screen flex flex-col grid-bg">
      {/* Header */}
      <header className="border-b border-neutral-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-8 bg-blue-500 rounded" />
            <h1 className="text-2xl font-bold text-white">StockOps</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-neutral-400">Bem-vindo,</p>
              <p className="font-semibold text-white">{user?.name}</p>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="p-2 hover:bg-neutral-800 rounded transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5 text-neutral-400 hover:text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Buscar por código ou responsável..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="all">Todos os Status</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="FINALIZADA">Finalizada</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              </div>
            </div>
            <p className="text-sm text-neutral-500">
              {filtered.length} contagem{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Stock Counts Grid */}
          {error ? (
            <div className="panel p-6 border-red-800 bg-red-900/20 text-red-400">
              {error}
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-neutral-400">Carregando contagens...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="panel p-6 text-center text-neutral-500">
              Nenhuma contagem encontrada
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <Link key={item.id} href={`/stock-count/${item.id}`}>
                  <div className="panel p-6 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-mono text-lg font-semibold text-white">
                          {item.code}
                        </p>
                        <p className="text-sm text-neutral-500 mt-1">
                          {item.employee.name}
                        </p>
                      </div>
                      <div
                        className={`p-2 rounded border ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusIcon(item.status)}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      <span
                        className={`inline-block px-3 py-1 rounded text-xs font-medium border ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>Itens:</span>
                        <span className="font-semibold text-white">
                          {item.itemCount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>Agendada em:</span>
                        <span className="font-mono text-xs text-neutral-300">
                          {new Date(item.scheduledAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-4 border-t border-neutral-800">
                      <p className="text-xs text-blue-400 font-medium">
                        Clique para abrir →
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
