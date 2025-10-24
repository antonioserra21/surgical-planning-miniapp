export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export async function processImage(file: File, phase: 'arterial'|'venous') {
const form = new FormData()
form.append('file', file)
form.append('phase', phase)

const res = await fetch(`${API_URL}/process`, {
method: 'POST',
body: form
})

if (!res.ok) {
const text = await res.text()
throw new Error(text || 'Processing failed')
}

// Response: { original_b64: string, processed_b64: string }
const json = await res.json()
return json as { original_b64: string; processed_b64: string }
}