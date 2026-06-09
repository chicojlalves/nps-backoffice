import { getProfile } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'

export default async function BackofficeLayout({ children }) {
  const profile = await getProfile()

  return (
    <div className="min-h-screen flex bg-[#0f1117]">
      <Sidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
