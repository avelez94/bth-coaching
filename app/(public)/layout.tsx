import Nav from '../components/nav'
import Footer from '../components/footer'
import { getSettings } from '@/lib/site-data'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <>
      <Nav bookingUrl={settings.bookingFreeCallUrl} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  )
}
