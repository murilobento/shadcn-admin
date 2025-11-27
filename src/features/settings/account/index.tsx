import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  return (
    <ContentSection
      title='Conta'
      desc='Atualize as configurações da sua conta. Defina seu idioma e fuso horário preferidos.'
    >
      <AccountForm />
    </ContentSection>
  )
}
