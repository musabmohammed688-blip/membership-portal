"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type Halqa = {
  id: string;
  name: string;
};

export default function NewStudentPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [halqas, setHalqas] = useState<Halqa[]>([]);
  const [fullName, setFullName] = useState("");
  const [halkaId, setHalkaId] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentPhone2, setParentPhone2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function loadHalqas() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("halqas")
        .select("*")
        .order("name");

      if (error) {
        setError(error.message);
      } else {
        setHalqas(data || []);
        if (data && data.length > 0) {
          setHalkaId(data[0].id);
        }
      }
    }
    loadHalqas();
  }, [mounted]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error: insertError } = await supabase.from("students").insert([
      {
        full_name: fullName,
        halka_id: halkaId || null,
        parent_name: parentName,
        parent_phone: parentPhone,
        parent_phone_2: parentPhone2 ? parentPhone2 : null,
      },
    ]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/students");
  }

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gray-50 p-10 text-center text-gray-500">
        Loading registration form...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <Link
            href="/students"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← Back to Students Management
          </Link>
          <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-green-700">
            حلقة الرحمانية لتحفيظ القرآن الكريم
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Register New Student
          </h1>
          <p className="mt-1 text-gray-600">
            Add a new student record and assign them to a Halqa.
          </p>
        </header>

        <div className="rounded-xl border bg-white p-6 shadow-sm md:p-8">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Muhammad Al-Amin"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Halqa Assignment *
              </label>
              <select
                required
                value={halkaId}
                onChange={(e) => setHalkaId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 bg-white"
              >
                {halqas.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Parent / Guardian Name *
              </label>
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="e.g. Sheikh Ibrahim"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Primary Parent WhatsApp Number *
              </label>
              <input
                type="text"
                required
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="e.g. +2348012345678"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                Include country code for direct WhatsApp contact integration.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Secondary WhatsApp Number (Optional)
              </label>
              <input
                type="text"
                value={parentPhone2}
                onChange={(e) => setParentPhone2(e.target.value)}
                placeholder="e.g. +2348098765432"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <Link
                href="/students"
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-green-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Save Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}