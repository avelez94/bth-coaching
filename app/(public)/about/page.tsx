import View from './view'
import { getViewProps } from '@/lib/site-data'

export default async function About() {
  return <View {...await getViewProps('about')} />
}
