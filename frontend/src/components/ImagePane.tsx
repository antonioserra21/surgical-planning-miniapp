type Props = { title: string; src?: string }

export default function ImagePane({ title, src }: Props) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="border-b px-4 py-2 text-sm font-medium text-slate-700">{title}</div>
      <div className="aspect-video w-full p-3 flex items-center justify-center bg-slate-50">
        {src ? (
          <img src={src} alt={title} className="h-full w-auto object-contain rounded" />
        ) : (
          <div className="flex flex-col items-center text-slate-400 text-sm">
            <div className="rounded-lg border border-dashed px-3 py-2">No image</div>
            <p className="mt-2">Upload and process to preview</p>
          </div>
        )}
      </div>
    </div>
  )
}
