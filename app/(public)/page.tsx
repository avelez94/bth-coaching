import type { Metadata } from 'next'
import HomeView from './home-view'
import JsonLd from '../components/json-ld'
import { getPageContent, getSettings, getViewProps } from '@/lib/site-data'
import { homeDescription, pageMetadata } from '@/lib/seo'
import { organization, website } from '@/lib/structured-data'

// The tagline is the Home supporting statement (editable in the admin),
// so the page, the meta description, the link preview and the structured
// data always carry the same words.
export async function generateMetadata(): Promise<Metadata> {
  const c = await getPageContent('home')
  return pageMetadata('home', { description: homeDescription(c['hero.subhead']) })
}

export default async function Home() {
  const [props, settings] = await Promise.all([getViewProps('home'), getSettings()])
  const tagline = props.c['hero.subhead']
  return (
    <>
      <JsonLd data={[organization(tagline, settings), website(tagline)]} />
      <HomeView c={props.c} bookingUrl={props.booking?.free} engagements={props.engagements} />
    </>
  )
}
