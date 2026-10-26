export const dynamic = "force-dynamic";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-green-700 p-6 text-white md:p-24">
      <div className="w-full max-w-4xl">
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-green-700 font-bold shadow-sm overflow-hidden">
              <img src="/Logo.jpeg" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-sm font-semibold tracking-wide">
              حلقة الرحمانية لتحفيظ القرآن الكريم
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/students"
              className="rounded-lg bg-green-800 px-4 py-2 text-sm font-medium hover:bg-green-900 transition"
            >
              Students
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-green-800 hover:bg-gray-100 transition"
            >
              Staff Login
            </Link>
          </div>
        </header>
      </div>

      <div className="flex flex-col items-center text-center my-auto py-12">
        {/* Custom Logo Image */}
        <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-lg overflow-hidden p-1 border-2 border-white/20">
          <img 
            src="/Logo.jpeg" 
            alt="Rahmaniyya Logo" 
            className="h-full w-full object-cover rounded-full" 
          />
        </div>

        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Welcome to our Qur'an Memorization Center
        </h1>
        
        <p className="mt-4 text-lg font-medium text-green-100">
          حلقة الرحمانية لتحفيظ القرآن الكريم
        </p>
        
        <p className="mt-1 text-sm text-green-200 uppercase tracking-widest">
          Rahmaniyya Qur'an Memorization Center
        </p>

        <p className="mt-6 max-w-md text-sm text-green-100/80">
          Halqa Management System for student registrations, parent communications, and Halqa assignments.
        </p>

        <div className="mt-10">
          <Link
            href="/students/new"
            className="rounded-xl bg-white px-8 py-4 text-base font-semibold text-green-800 shadow-lg hover:bg-green-50 transition"
          >
            Start registration
          </Link>
        </div>
      </div>

      <footer className="w-full text-center text-xs text-green-200/60 py-4">
        Rahmaniyya Qur'an Memorization Center &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}