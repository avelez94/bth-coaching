import View from './view'
import { getViewProps } from '@/lib/site-data'

export default async function The8Pillars() {
  return <View {...await getViewProps('the-8-pillars')} />
}
