import View from './view'
import JsonLd from '../../components/json-ld'
import { getViewProps } from '@/lib/site-data'
import { PUBLIC_PAGES, pageMetadata } from '@/lib/seo'
import { service } from '@/lib/structured-data'

export const metadata = pageMetadata('executive-coaching')

export default async function ExecutiveCoaching() {
  const props = await getViewProps('executive-coaching')
  return (
    <>
      <JsonLd data={service(PUBLIC_PAGES['executive-coaching'].path, 'Executive Coaching', PUBLIC_PAGES['executive-coaching'].description, props.programs!['executive-coaching'])} />
      <View {...props} />
    </>
  )
}
