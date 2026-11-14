import View from './view'
import { getViewProps } from '@/lib/site-data'

export default async function ForOrganizations() {
  return <View {...await getViewProps('for-organizations')} />
}
