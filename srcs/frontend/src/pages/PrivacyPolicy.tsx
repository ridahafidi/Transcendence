import LegalPage from './LegalPage'

const SECTIONS = [
  { id: 'data', title: 'Data we collect', text: 'When you use 42 sign-in, Nexa receives profile information such as your 42 account identifier, login, name, and email. When workspace features are available, Nexa also processes the tasks, messages, and files you add.' },
  { id: 'use', title: 'How we use it', text: 'Nexa uses account information to identify you and associate your 42 account with your Nexa account. Workspace content is used to provide the collaboration features you choose to use.' },
  { id: 'cookies', title: 'Cookies', text: 'Nexa uses an HTTP-only session cookie to keep track of your 42 sign-in request as you move between Nexa and 42.' },
  { id: 'security', title: 'Storage and security', text: 'Nexa stores account records in its database. The backend handles the exchange with 42 and keeps the 42 client secret and access token out of the browser.' },
  { id: 'requests', title: 'Your data requests', text: 'Contact the Nexa project team if you want to access, correct, or request deletion of your personal data, or ask about your linked 42 account.' },
  { id: 'contact', title: 'Contact', text: 'Send privacy questions to the Nexa project team through the channel where you received access to the project.' },
]

export default function PrivacyPolicy() {
  return <LegalPage title="Privacy Policy" sections={SECTIONS} />
}
