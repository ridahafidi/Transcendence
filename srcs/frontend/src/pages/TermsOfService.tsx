import LegalPage from './LegalPage'

const SECTIONS = [
  { id: 'acceptance', title: 'Acceptance', text: 'By creating an account or using Nexa, you agree to these terms. If you do not agree, please stop using the service.' },
  { id: 'accounts', title: 'Accounts', text: 'Keep your credentials private and tell the Nexa team if you suspect someone has accessed your account. Use your own account when joining a workspace.' },
  { id: 'acceptable-use', title: 'Acceptable use', text: 'Do not upload unlawful or harmful content, access data without permission, bypass API limits, or interfere with other users’ access to Nexa.' },
  { id: 'content', title: 'Content', text: 'You keep ownership of the content you create. You allow Nexa to store and display it to the people you choose to share it with.' },
  { id: 'moderation', title: 'Moderation and suspension', text: 'Nexa administrators may remove content or restrict access when these terms are violated.' },
  { id: 'changes', title: 'Changes and availability', text: 'Nexa is an educational project. Features may change or become unavailable. When these terms change, the date at the top of this page will be updated.' },
]

export default function TermsOfService() {
  return <LegalPage title="Terms of Service" sections={SECTIONS} />
}
