"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import { Lock, Mail, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [email, setEmail] = useState("joao@example.com");
  const [password, setPassword] = useState("password123");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      // Erro já está no store
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center grid-bg p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-2 h-10 bg-blue-500 rounded" />
            <span className="font-display text-5xl font-800 tracking-tight text-white uppercase">
              StockOps
            </span>
          </div>
          <p className="font-mono text-xs text-neutral-500 tracking-widest uppercase">
            Sistema de Contagem de Estoque
          </p>
        </div>

        {/* Login Form */}
        <div className="panel p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Entrar</h1>
            <p className="text-sm text-neutral-400">
              Acesse sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                placeholder="seu@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                <Lock className="inline w-4 h-4 mr-2" />
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-neutral-800">
            <p className="text-xs text-neutral-500 mb-2">Credenciais de teste:</p>
            <div className="space-y-1 text-xs text-neutral-600">
              <p>📧 joao@example.com (admin)</p>
              <p>📧 maria@example.com (user)</p>
              <p>🔑 Senha: password123</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
