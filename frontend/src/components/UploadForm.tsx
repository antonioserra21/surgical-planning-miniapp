import { useRef, useState } from 'react'
import { processImage } from '../lib/api'

interface UploadFormProps {
  onImages: (o: string, p: string) => void
  onProcessingChange?: (loading: boolean) => void
}

export default function UploadForm({ onImages, onProcessingChange }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [phase, setPhase] = useState<'arterial' | 'venous'>('arterial')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputId = 'file-input'

  // Open native picker and FORCE onChange to fire even if selecting same file again
  const openPicker = () => {
    if (!inputRef.current) return
    inputRef.current.value = '' // key: reset so same-file reselection triggers onChange
    inputRef.current.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { setError('Please choose an image'); return }
    setError(null)
    setLoading(true)
    onProcessingChange?.(true)
    try {
      const { original_b64, processed_b64 } = await processImage(file, phase)
      const withPrefix = (b64: string) =>
        b64.startsWith('data:') ? b64 : `data:image/png;base64,${b64}`
      onImages(withPrefix(original_b64), withPrefix(processed_b64))
    } catch (err: any) {
      setError(err.message || 'Processing failed')
    } finally {
      setLoading(false)
      onProcessingChange?.(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
      {/* File picker */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Image</label>

        {/* Clickable area (dropzone-style) */}
        <div
          className="group flex items-center justify-between rounded-xl border border-dashed p-3 pl-4 hover:border-slate-400 transition cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPicker()}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600">PNG/JPG</div>
            <div className="truncate text-sm text-slate-700">
              {file ? file.name : 'Click to choose an image'}
            </div>
          </div>

          {/* Browse "button" implemented as a label bound to the hidden input */}
          <label
            htmlFor={inputId}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white shadow-sm hover:bg-slate-800 cursor-pointer"
            onClick={(e) => {
              // Prevent bubbling to the container (avoids double-trigger)
              e.stopPropagation()
              if (inputRef.current) inputRef.current.value = ''
            }}
          >
            Browse
          </label>
        </div>

        {/* Hidden native input */}
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleChange}
          className="sr-only"
        />

        <p className="mt-1 text-xs text-slate-500">Max a few MB is fine for this demo.</p>
      </div>

      {/* Phase selector + real submit button */}
      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Phase</label>
          <div className="inline-flex items-center rounded-xl border bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setPhase('arterial')}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                phase === 'arterial' ? 'bg-white shadow-sm border' : 'text-slate-600 hover:text-slate-800'
              }`}
              aria-pressed={phase === 'arterial'}
            >
              Arterial
            </button>
            <button
              type="button"
              onClick={() => setPhase('venous')}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                phase === 'venous' ? 'bg-white shadow-sm border' : 'text-slate-600 hover:text-slate-800'
              }`}
              aria-pressed={phase === 'venous'}
            >
              Venous
            </button>
          </div>
        </div>

        {/* IMPORTANT: this is the actual submit */}
        <button
          type="submit"
          disabled={loading || !file}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="loading-spinner" aria-hidden />
              Processing…
            </span>
          ) : (
            'Process'
          )}
        </button>

        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
    </form>
  )
}
