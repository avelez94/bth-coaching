import Nav from '../components/nav'
import Footer from '../components/footer'
import { getPageVisibility, getSettings } from '@/lib/site-data'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, visible] = await Promise.all([getSettings(), getPageVisibility()])
  return (
    <>
      <Nav bookingUrl={settings.bookingFreeCallUrl} visible={visible} />
      <main>{children}</main>
      <Footer settings={settings} visible={visible} />
    </>
  )
}
