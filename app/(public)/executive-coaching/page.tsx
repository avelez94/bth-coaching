import View from './view'
import { getViewProps } from '@/lib/site-data'

export default async function ExecutiveCoaching() {
  return <View {...await getViewProps('executive-coaching')} />
}
