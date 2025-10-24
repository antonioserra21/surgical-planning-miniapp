import { useState } from 'react'
import UploadForm from './components/UploadForm'
import ImagePane from './components/ImagePane'

export default function App() {
  const [orig, setOrig] = useState<string | undefined>()
  const [proc, setProc] = useState<string | undefined>()
  const [isProcessing, setIsProcessing] = useState(false)


  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-50">
      {/* Top bar */}
      <header className="border-b bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Surgical Planning — Phase Simulator</h1>
          <span className="text-xs text-slate-500">Demo • server-side processing</span>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Upload / controls */}
        <div className="rounded-2xl border bg-white shadow-sm p-6">
          <p className="mb-4 text-sm text-slate-600">
            Upload a PNG/JPG, choose a phase, and process on the Python backend. The browser never
            manipulates pixels; everything happens server-side.
          </p>
          <UploadForm
            onImages={(o, p) => { setOrig(o); setProc(p) }}
            onProcessingChange={setIsProcessing}
          />
        </div>

        {/* Images */}
        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <ImagePane title="Original" src={orig} />
          <ImagePane title="Processed" src={proc} />
        </section>

        {/* Status bar */}
        <div className="mt-6">
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="px-5 py-3 text-center text-sm">
              {isProcessing ? (
                <span className="inline-flex items-center gap-2 text-slate-700">
                  <span className="loading-spinner" aria-hidden />
                  Processing the image…
                </span>
              ) : proc ? (
                <span className="inline-flex items-center gap-2 text-emerald-700">
                  <span className="i-check" aria-hidden>✓</span>
                  Processing completed
                </span>
              ) : (
                <span className="text-slate-500">Awaiting input</span>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-10 border-t bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Surgical Planning Demo — For evaluation only
        </div>
      </footer>
    </div>
  )
}
