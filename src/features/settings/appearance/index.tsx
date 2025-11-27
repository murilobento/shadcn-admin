import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function SettingsAppearance() {
  return (
    <ContentSection
      title='Aparência'
      desc='Personalize a aparência do app. Alterne automaticamente entre temas diurnos e noturnos.'
    >
      <AppearanceForm />
    </ContentSection>
  )
}
