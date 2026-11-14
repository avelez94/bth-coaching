import View from './view'
import { getViewProps } from '@/lib/site-data'

export default async function Contact() {
  return <View {...await getViewProps('contact')} />
}
