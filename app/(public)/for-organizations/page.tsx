import View from './view'
import { getViewProps } from '@/lib/site-data'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('for-organizations')

export default async function ForOrganizations() {
  return <View {...await getViewProps('for-organizations')} />
}
