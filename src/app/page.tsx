export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center p-8">
        <h1 className="text-5xl font-bold">SenpaiSucks</h1>
        <p className="mt-4 text-xl text-slate-300">This Next.js app is ready.</p>
        <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-900/80 p-6 text-slate-200 shadow-xl shadow-slate-950/20">
          <p>Features included:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
            <li>TypeScript</li>
            <li>ESLint</li>
            <li>Tailwind CSS</li>
            <li>src/ directory</li>
            <li>App Router</li>
            <li>Turbopack-ready structure</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
