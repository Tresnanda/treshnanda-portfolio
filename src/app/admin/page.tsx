"use client";

import { useState } from "react";
import { login } from "@/actions/admin";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login(password);
    if (res.success) {
      router.push("/admin/dashboard");
    } else {
      setError(res.error || "Login failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a]">
      <div className="w-full max-w-md p-12 border border-white/10 bg-white/[0.02]">
        <h1 className="text-2xl font-bold tracking-tighter uppercase mb-8">Admin Access</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest opacity-40 mb-2 block">System Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 focus:border-emerald-500 outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 p-4 font-bold uppercase tracking-widest text-xs transition-colors">
            Authorize
          </button>
        </form>
      </div>
    </main>
  );
}
