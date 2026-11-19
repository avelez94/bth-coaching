import Nav from '../components/nav'
import Footer from '../components/footer'
import { getPageVisibility, getSettings } from '@/lib/site-data'
import { mainBookingUrl } from '@/lib/site-settings'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, visible] = await Promise.all([getSettings(), getPageVisibility()])
  return (
    <>
      <Nav bookingUrl={mainBookingUrl(settings)} visible={visible} quote={{ text: settings.navQuote, by: settings.navQuoteAttribution }} />
      <main>{children}</main>
      <Footer settings={settings} visible={visible} />
    </>
  )
}
