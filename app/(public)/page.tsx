import HomeView from './home-view'
import { getPageContent, getSettings } from '@/lib/site-data'

export default async function Home() {
  const [c, settings] = await Promise.all([getPageContent('home'), getSettings()])
  return <HomeView c={c} bookingUrl={settings.bookingFreeCallUrl} />
}
