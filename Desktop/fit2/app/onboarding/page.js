import OnboardingForm from '@/components/onboarding/OnboardingForm'
import PageWrapper from '@/components/layout/PageWrapper'

export default function OnboardingPage() {
  return (
    <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <OnboardingForm />
    </PageWrapper>
  )
}
