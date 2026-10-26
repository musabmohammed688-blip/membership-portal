"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type Halqa = {
  id: number;
  name: string;
};

export default function NewStudentPage() {
  const router = useRouter();
  const supabase = createClient();

  const [halqas, setHalqas] = useState<Halqa[]>([]);
  const [fullName, setFullName] = useState("");
  const [halkaId, setHalkaId] = useState<number | "">("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentPhone2, setParentPhone2] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingHalqas, setLoadingHalqas] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHalqas() {
      const { data, error } = await supabase
        .from("halqas")
        .select("*")
        .order("id");

      if (error) {
        setError(`Unable to load Halqas: ${error.message}`);
      } else if (data && data.length > 0) {
        setHalqas(data);
        setHalkaId(data[0].id);
      }
      setLoadingHalqas(false);
    }

    loadHalqas();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!halkaId) return;

    setLoading(true);
    setError("");

    const { error: insertError } = await supabase.from("students").insert([
      {
        full_name: fullName,
        halka_id: Number(halkaId),
        parent_name: parentName,
        parent_phone: parentPhone,
        parent_phone_2: parentPhone2 || null,
      },
    ]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/students");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <Link
            href="/students"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← Back to Students
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Register New Student
          </h1>
          <p className="mt-1 text-gray-600">
            Add a new student to حلقة الرحمانية لتحفيظ القرآن الكريم records.
          </p>
        </header>

        <section className="rounded-xl border bg-white p-6 shadow-sm md:p-8">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold">Unable to process request.</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="full_name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Student Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="full_name"
                type="text"
                required
                placeholder="e.g. Abdullah Ahmed"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="halka_id"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Assign Halqa <span className="text-red-500">*</span>
              </label>
              <select
                id="halka_id"
                required
                disabled={loadingHalqas}
                value={halkaId}
                onChange={(e) => setHalkaId(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
              >
                {loadingHalqas ? (
                  <option>Loading Halqas...</option>
                ) : (
                  halqas.map((halqa) => (
                    <option key={halqa.id} value={halqa.id}>
                      {halqa.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="parent_name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Parent's Name <span className="text-red-500">*</span>
              </label>
              <input
                id="parent_name"
                type="text"
                required
                placeholder="e.g. Ahmed Ali"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="parent_phone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Parent's WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <input
                id="parent_phone"
                type="tel"
                required
                placeholder="e.g. +233097609"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="parent_phone_2"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Secondary WhatsApp Number (Optional)
              </label>
              <input
                id="parent_phone_2"
                type="tel"
                placeholder="e.g. +233097610"
                value={parentPhone2}
                onChange={(e) => setParentPhone2(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <Link
                href="/students"
                className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || loadingHalqas}
                className="rounded-lg bg-green-700 px-6 py-2.5 font-medium text-white hover:bg-green-800 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register Student"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}