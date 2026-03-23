export async function saveProfile(profileData) {
  const res = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Profilni saqlashda xatolik")
  }

  return res.json()
}

export async function getProfile() {
  const res = await fetch('/api/profile')

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Profilni olishda xatolik")
  }

  return res.json()
}
