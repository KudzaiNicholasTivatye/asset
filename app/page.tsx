// app/page.tsx
import { redirect } from 'next/navigation'

export default function Home() {
  // Always start the app at the auth (login) page
  redirect('/auth')
}
