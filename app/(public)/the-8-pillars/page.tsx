import View from './view'
import { getViewProps } from '@/lib/site-data'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('the-8-pillars')

export default async function The8Pillars() {
  return <View {...await getViewProps('the-8-pillars')} />
}
