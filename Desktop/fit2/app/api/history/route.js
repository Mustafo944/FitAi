import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request) {
  const supabase = await getSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ message: 'Avtorizatsiya kerak' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const latest = searchParams.get('latest')

  // Bitta tahlilni olish (id orqali)
  if (id) {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      return Response.json({ message: 'Tahlil topilmadi' }, { status: 404 })
    }

    return Response.json(data)
  }

  // Oxirgi tahlilni olish
  if (latest) {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return Response.json({ message: 'Tahlil topilmadi' }, { status: 404 })
    }

    return Response.json(data)
  }

  // Barcha tahlillarni olish
  const { data, error } = await supabase
    .from('analyses')
    .select('id, created_at, height_cm, weight_kg, result')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return Response.json(
      { message: 'Tarixni olishda xatolik' },
      { status: 500 }
    )
  }

  return Response.json(data || [])
}
