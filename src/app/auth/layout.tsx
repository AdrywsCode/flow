export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border bg-white/80 p-8 shadow-sm backdrop-blur">
        {children}
      </div>
    </main>
  );
}
