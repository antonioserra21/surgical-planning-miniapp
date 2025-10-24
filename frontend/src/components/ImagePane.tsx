// --- Props definition ---
// The component accepts two props:
// - title: string displayed at the top of the panel
// - src (optional): URL or base64 string of the image to display
type Props = {
  title: string
  src?: string
}

// --- ImagePane component ---
// A reusable UI component that displays an image (if provided)
// or a placeholder panel prompting the user to upload an image.
export default function ImagePane({ title, src }: Props) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      {/* Header section with the title */}
      <div className="border-b px-4 py-2 text-sm font-medium text-slate-700">
        {title}
      </div>

      {/* Image container with fixed aspect ratio */}
      <div className="aspect-video w-full p-3 flex items-center justify-center bg-slate-50">
        {src ? (
          // --- If an image source is provided, display the image ---
          <img
            src={src}
            alt={title}
            className="h-full w-auto object-contain rounded"
          />
        ) : (
          // --- Otherwise, show a placeholder message ---
          <div className="flex flex-col items-center text-slate-400 text-sm">
            <div className="rounded-lg border border-dashed px-3 py-2">
              No image
            </div>
            <p className="mt-2">Upload and process to preview</p>
          </div>
        )}
      </div>
    </div>
  )
}
