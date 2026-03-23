import { getSupabaseServerClient } from '@/lib/supabase/server'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, STORAGE_BUCKET } from '@/lib/constants'

export async function POST(request) {
  const supabase = await getSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ message: 'Avtorizatsiya kerak' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!file) {
    return Response.json({ message: 'Rasm tanlang' }, { status: 400 })
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return Response.json(
      { message: 'Faqat JPG, PNG yoki WebP formatlar qabul qilinadi' },
      { status: 400 }
    )
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return Response.json(
      { message: 'Rasm hajmi 5 MB dan oshmasligi kerak' },
      { status: 400 }
    )
  }

  const ext = file.name.split('.').pop()
  const fileName = `${user.id}/${Date.now()}.${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return Response.json(
      { message: 'Rasmni yuklashda xatolik' },
      { status: 500 }
    )
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName)

  return Response.json({ url: urlData.publicUrl })
}
