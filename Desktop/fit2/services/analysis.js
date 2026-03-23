export async function analyzeBody(imageUrl) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Tahlil qilishda xatolik")
  }

  return res.json()
}

export async function getAnalysisHistory() {
  const res = await fetch('/api/history')

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Tarixni olishda xatolik")
  }

  return res.json()
}

export async function getLatestAnalysis() {
  const res = await fetch('/api/history?latest=true')

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Natijani olishda xatolik")
  }

  return res.json()
}
