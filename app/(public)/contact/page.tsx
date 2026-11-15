import View from './view'
import { getViewProps } from '@/lib/site-data'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('contact')

export default async function Contact() {
  return <View {...await getViewProps('contact')} />
}
