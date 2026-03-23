export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Rasmni yuklashda xatolik")
  }

  return res.json()
}
