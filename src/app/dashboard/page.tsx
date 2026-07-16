import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardRedirect() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const role = (session.user as any).role
  if (role === 'ADMIN') {
    redirect('/admin')
  }
  if (role === 'SELLER') {
    redirect('/seller')
  }
  redirect('/buyer')
}
