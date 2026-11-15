import View from './view'
import { getViewProps } from '@/lib/site-data'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('about')

export default async function About() {
  return <View {...await getViewProps('about')} />
}
