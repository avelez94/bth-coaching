import View from './view'
import { getViewProps } from '@/lib/site-data'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('sample-engagements')

export default async function SampleEngagements() {
  return <View {...await getViewProps('sample-engagements')} />
}
