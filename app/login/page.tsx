"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Wrong email or password.");
      setLoading(false);
      return;
    }

    router.push("/students");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl font-bold text-brand">Staff login</h1>
      <p className="mt-2 text-slate-600">
        Only approved staff can view student records.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        {message && <p className="text-sm text-red-600">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}
