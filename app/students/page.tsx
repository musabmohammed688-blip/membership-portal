"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type Student = {
  id: string;
  full_name: string;
  parent_name: string;
  parent_phone: string;
  parent_phone_2?: string | null;
  created_at?: string;
  halqas?: { name: string } | null;
};

export default function StudentsPage() {
  const [mounted, setMounted] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function checkAuthAndLoad() {
    setLoading(true);
    setError("");

    // 1. Check if staff is logged in
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      router.push("/login");
      return;
    }

    // 2. Fetch students if logged in
    const { data, error: dbError } = await supabase
      .from("students")
      .select("*, halqas(name)")
      .order("full_name");

    if (dbError) {
      setError(dbError.message);
      setStudents([]);
    } else {
      setStudents((data ?? []) as unknown as Student[]);
    }

    setLoading(false);
  }

  async function deleteStudent(student: Student) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.full_name}? This action cannot be undone.`
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", student.id);

    if (error) {
      window.alert(`Unable to delete student: ${error.message}`);
      return;
    }

    await checkAuthAndLoad();
  }

  function exportToExcel() {
    if (students.length === 0) {
      window.alert("No student records available to export.");
      return;
    }

    const headers = [
      "Student Name",
      "Halqa",
      "Parent Name",
      "Parent WhatsApp Number",
      "Secondary WhatsApp Number",
      "Registration Date",
    ];

    const rows = students.map((s) => [
      `"${s.full_name || ""}"`,
      `"${s.halqas?.name || "Unassigned"}"`,
      `"${s.parent_name || ""}"`,
      `"${s.parent_phone || ""}"`,
      `"${s.parent_phone_2 || ""}"`,
      `"${s.created_at ? new Date(s.created_at).toLocaleDateString() : ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Al-Rahmaniyyah_Students_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    if (mounted) {
      checkAuthAndLoad();
    }
  }, [mounted, supabase]);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gray-50 p-10 text-center text-gray-500">
        Loading portal...
      </main>
    );
  }

  const filteredStudents = students.filter((student) => {
    const query = search.toLowerCase();
    const halqaName = student.halqas?.name?.toLowerCase() || "";

    return (
      student.full_name?.toLowerCase().includes(query) ||
      student.parent_name?.toLowerCase().includes(query) ||
      student.parent_phone?.toLowerCase().includes(query) ||
      student.parent_phone_2?.toLowerCase().includes(query) ||
      halqaName.includes(query)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
              حلقة الرحمانية لتحفيظ القرآن الكريم
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Students Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage registered students and their Halqa assignments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center justify-center rounded-lg border border-green-700 bg-white px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50"
            >
              📥 Download Excel (CSV)
            </button>

            <Link
              href="/students/new"
              className="inline-flex items-center justify-center rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800"
            >
              + Register New Student
            </Link>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/login");
              }}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {loading ? "..." : students.length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Search Results</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {loading ? "..." : filteredStudents.length}
            </p>
          </div>
        </section>

        <section className="rounded-xl border bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5">
            <label
              htmlFor="student-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Search students
            </label>

            <input
              id="student-search"
              type="search"
              placeholder="Search by student name, parent name, WhatsApp, or Halqa..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {loading ? (
            <p className="py-10 text-center text-gray-500">
              Verifying staff session & loading students...
            </p>
          ) : error ? (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              <p>Unable to load students.</p>
              <p className="mt-1">{error}</p>

              <button
                onClick={checkAuthAndLoad}
                className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-white"
              >
                Try again
              </button>
            </div>
          ) : filteredStudents.length === 0 ? (
            <p className="py-10 text-center text-gray-500">
              {students.length === 0
                ? "No students have been registered yet."
                : "No students match your search."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="border-b bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Student Name</th>
                    <th className="px-4 py-3 font-semibold">Halqa</th>
                    <th className="px-4 py-3 font-semibold">Parent Name</th>
                    <th className="px-4 py-3 font-semibold">
                      Parent WhatsApp Number
                    </th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">
                        {student.full_name}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {student.halqas?.name || "Unassigned"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        {student.parent_name}
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        <div>
                          <a
                            href={`https://wa.me/${student.parent_phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-700 hover:underline font-medium"
                          >
                            {student.parent_phone}
                          </a>
                        </div>
                        {student.parent_phone_2 && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            <a
                              href={`https://wa.me/${student.parent_phone_2.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {student.parent_phone_2}
                            </a>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <button
                          onClick={() => deleteStudent(student)}
                          className="rounded-lg border border-red-200 px-3 py-2 font-medium text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}