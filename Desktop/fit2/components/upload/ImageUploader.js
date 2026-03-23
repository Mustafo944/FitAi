'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { uploadImage } from '@/services/storage'
import { analyzeBody } from '@/services/analysis'
import { validateImage } from '@/lib/validation'

export default function ImageUploader() {
  const router = useRouter()
  const fileRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState('') // upload | analyzing

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setError('')
    const validation = validateImage(selected)
    if (!validation.valid) {
      setError(validation.errors[0])
      return
    }

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleRemove = () => {
    setFile(null)
    setPreview(null)
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async () => {
    if (!file) {
      setError('Rasm tanlang')
      return
    }

    setLoading(true)
    setError('')

    try {
      setStep('upload')
      const { url } = await uploadImage(file)

      setStep('analyzing')
      await analyzeBody(url)

      router.push('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setStep('')
    }
  }

  const stepText = {
    upload: 'Rasm yuklanmoqda...',
    analyzing: 'AI tahlil qilmoqda... (30 soniyagacha)',
  }

  return (
    <Card glass className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Tana rasmingiz</h2>
        <p className="text-gray-400 mt-1">
          AI tahlil uchun to&apos;liq tana rasmingizni yuklang
        </p>
      </div>

      {!preview ? (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all duration-200">
          <svg
            className="w-12 h-12 text-gray-500 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-gray-400 text-sm">
            Rasm tanlash uchun bosing
          </span>
          <span className="text-gray-500 text-xs mt-1">
            JPG, PNG yoki WebP • Max 5 MB
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Tanlangan rasm"
            className="w-full h-64 object-cover rounded-2xl"
          />
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white rounded-full p-1.5 hover:bg-black/80 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-2">
          {error}
        </p>
      )}

      {loading && step && (
        <div className="mt-4 flex items-center gap-2 text-sm text-violet-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-500" />
          {stepText[step]}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        loading={loading}
        disabled={!file}
        className="w-full mt-6"
        size="lg"
      >
        Tahlil qilish
      </Button>
    </Card>
  )
}
