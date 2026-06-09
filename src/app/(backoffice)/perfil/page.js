import { getProfile } from '@/lib/auth'
import PerfilClient from './PerfilClient'

export default async function PerfilPage() {
  const profile = await getProfile()
  return <PerfilClient profile={profile} />
}
