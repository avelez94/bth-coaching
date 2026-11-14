import View from './view'
import { getViewProps } from '@/lib/site-data'

export default async function SampleEngagements() {
  return <View {...await getViewProps('sample-engagements')} />
}
