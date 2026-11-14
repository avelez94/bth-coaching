import View from './view'
import { getViewProps } from '@/lib/site-data'

export default async function LeaderDevelopment() {
  return <View {...await getViewProps('leader-development')} />
}
