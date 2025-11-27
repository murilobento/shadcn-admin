import { ContentSection } from '../components/content-section'
import { DisplayForm } from './display-form'

export function SettingsDisplay() {
  return (
    <ContentSection
      title='Exibição'
      desc="Ative ou desative itens para controlar o que é exibido no app."
    >
      <DisplayForm />
    </ContentSection>
  )
}
