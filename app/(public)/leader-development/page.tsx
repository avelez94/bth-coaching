import View from './view'
import JsonLd from '../../components/json-ld'
import { getViewProps } from '@/lib/site-data'
import { PUBLIC_PAGES, pageMetadata } from '@/lib/seo'
import { service } from '@/lib/structured-data'

export const metadata = pageMetadata('leader-development')

export default async function LeaderDevelopment() {
  const props = await getViewProps('leader-development')
  return (
    <>
      <JsonLd data={service(PUBLIC_PAGES['leader-development'].path, '8 Pillars Leadership Program', PUBLIC_PAGES['leader-development'].description, props.programs!['8-pillars'])} />
      <View {...props} />
    </>
  )
}
