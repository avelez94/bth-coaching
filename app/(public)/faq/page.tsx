import View from './view'
import { getViewProps } from '@/lib/site-data'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('faq')

export default async function Faq() {
  const props = await getViewProps('faq')
  return <View {...props} />
}
