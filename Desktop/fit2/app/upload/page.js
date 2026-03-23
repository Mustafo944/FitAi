import ImageUploader from '@/components/upload/ImageUploader'
import PageWrapper from '@/components/layout/PageWrapper'

export default function UploadPage() {
  return (
    <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full">
        <ImageUploader />
      </div>
    </PageWrapper>
  )
}
