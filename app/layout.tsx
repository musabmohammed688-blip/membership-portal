import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <nav className="border-b bg-white shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.jpeg"
                alt="Halakatu Rahmaniyya Logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="font-bold text-lg text-green-800">
                حلقة الرحمانية لتحفيظ القرآن الكريم
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/students" className="text-sm font-medium text-gray-700 hover:text-green-700">
                Students
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
              >
                Staff Login
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}