// --- React hooks ---
import { useRef, useState } from 'react'

// --- API function for image processing ---
// processImage(file, phase) sends the file to the backend and returns processed + original images
import { processImage } from '../lib/api'

// --- Props definition ---
// onImages: callback to return both original and processed images (as base64 URLs) to the parent
// onProcessingChange (optional): callback to inform the parent when processing starts/ends (for loading states)
interface UploadFormProps {
  onImages: (o: string, p: string) => void
  onProcessingChange?: (loading: boolean) => void
}

// --- UploadForm component ---
// Handles image selection, phase choice (arterial vs venous), and submission to the API.
// Displays a simple UI with a clickable upload zone, a phase selector, and a processing button.
export default function UploadForm({ onImages, onProcessingChange }: UploadFormProps) {
  // --- Local state ---
  const [file, setFile] = useState<File | null>(null)                      // Selected image file
  const [phase, setPhase] = useState<'arterial' | 'venous'>('arterial')    // Selected phase
  const [loading, setLoading] = useState(false)                            // Submission/loading state
  const [error, setError] = useState<string | null>(null)                  // Error messages

  // Reference to the hidden <input type="file" /> element (used to programmatically trigger file picker)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputId = 'file-input'

  // --- File picker trigger ---
  // Opens native file picker and forces onChange to trigger even when selecting the same file again
  const openPicker = () => {
    if (!inputRef.current) return
    inputRef.current.value = '' // reset ensures selecting the same file again works
    inputRef.current.click()
  }

  // --- Handle file selection ---
  // Updates state with the selected file (if any)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
  }

  // --- Form submission ---
  // Sends the image and phase to the API for processing and returns the results via callback
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!file) { 
      setError('Please choose an image')
      return
    }

    // Reset errors and start loading
    setError(null)
    setLoading(true)
    onProcessingChange?.(true)

    try {
      // Send file and phase to backend
      const { original_b64, processed_b64 } = await processImage(file, phase)

      // Add base64 prefix if not included by the backend
      const withPrefix = (b64: string) =>
        b64.startsWith('data:') ? b64 : `data:image/png;base64,${b64}`

      // Send the images to the parent component
      onImages(withPrefix(original_b64), withPrefix(processed_b64))
    } catch (err: any) {
      // Handle errors gracefully
      setError(err.message || 'Processing failed')
    } finally {
      // Reset loading state
      setLoading(false)
      onProcessingChange?.(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
      {/* -------------------- File Picker Section -------------------- */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Image</label>

        {/* Clickable dropzone area to trigger file selection */}
        <div
          className="group flex items-center justify-between rounded-xl border border-dashed p-3 pl-4 hover:border-slate-400 transition cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPicker()}
        >
          {/* Left part: file format + file name (or placeholder) */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600">PNG/JPG</div>
            <div className="truncate text-sm text-slate-700">
              {file ? file.name : 'Click to choose an image'}
            </div>
          </div>

          {/* Right part: browse button (label for the hidden input) */}
          <label
            htmlFor={inputId}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white shadow-sm hover:bg-slate-800 cursor-pointer"
            onClick={(e) => {
              // Prevent bubbling to container (avoids double-trigger of picker)
              e.stopPropagation()
              if (inputRef.current) inputRef.current.value = ''
            }}
          >
            Browse
          </label>
        </div>

        {/* Hidden native input element */}
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleChange}
          className="sr-only"
        />

        <p className="mt-1 text-xs text-slate-500">
          Max a few MB is fine for this demo.
        </p>
      </div>

      {/* -------------------- Phase Selector & Submit -------------------- */}
      <div className="flex flex-col gap-3">
        {/* Phase selection buttons (Arterial / Venous) */}
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

        {/* --- Submit button --- */}
        {/* Disabled if no file is selected or processing is ongoing */}
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

        {/* --- Error message --- */}
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
    </form>
  )
}
