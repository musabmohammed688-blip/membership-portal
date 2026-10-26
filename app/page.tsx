import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-green-800 text-white py-20 px-6 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex justify-center">
            <Image
              src="/logo.jpeg"
              alt="Al-Rahmaniyyah Logo"
              width={100}
              height={100}
              className="h-24 w-24 rounded-full object-cover shadow-md border-2 border-white"
              priority
            />
          </div>

          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Welcome to our Qur'an Memorization center
          </h1>

          <div className="space-y-1">
            <p className="text-xl font-bold text-green-200">
              حلقة الرحمانية لتحفيظ القرآن الكريم
            </p>
            <p className="text-sm font-medium tracking-wide text-green-100 uppercase">
              Al-Rahmaniyyah Qur'an Memorization center
            </p>
          </div>

          <p className="mx-auto max-w-xl text-green-100 text-base">
            Halqa Management System for student registrations, parent communications, and Halqa assignments.
          </p>

          <div className="pt-4">
            <Link
              href="/students/new"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-bold text-green-800 shadow-md hover:bg-green-50 transition-colors"
            >
              Start registration
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mx-auto max-w-5xl py-16 px-6">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
          Our Mission
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Growth</h3>
            <p className="mt-2 text-sm text-gray-600">
              Programs and gatherings that help members grow in faith and character.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">
              Academic Excellence
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Study groups, mentoring, and support to help every student succeed in Hifz.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">
              Community Support
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Connecting parents, teachers, and students to build a supportive learning environment.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}