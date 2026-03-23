'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { saveProfile } from '@/services/profile'
import { validateProfileData } from '@/lib/validation'
import { GENDER_OPTIONS } from '@/lib/constants'

export default function OnboardingForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validation = validateProfileData(form)
    if (!validation.valid) {
      setError(validation.errors[0])
      return
    }

    setLoading(true)
    try {
      await saveProfile({
        height_cm: Number(form.height),
        weight_kg: Number(form.weight),
        age: Number(form.age),
        gender: form.gender,
      })
      router.push('/upload')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card glass className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Ma&apos;lumotlaringiz</h2>
        <p className="text-gray-400 mt-1">
          Aniqroq natija uchun ma&apos;lumotlaringizni kiriting
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Bo'y (sm)"
          type="number"
          name="height"
          value={form.height}
          onChange={handleChange}
          placeholder="175"
          min="100"
          max="250"
          required
        />

        <Input
          label="Vazn (kg)"
          type="number"
          name="weight"
          value={form.weight}
          onChange={handleChange}
          placeholder="70"
          min="20"
          max="300"
          required
        />

        <Input
          label="Yosh"
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="25"
          min="10"
          max="100"
          required
        />

        <Select
          label="Jins"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          options={GENDER_OPTIONS}
          required
        />

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-2">
            {error}
          </p>
        )}

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          size="lg"
        >
          Davom etish
        </Button>
      </form>
    </Card>
  )
}
