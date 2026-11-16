import { redirect } from 'next/navigation'
import View from './view'
import JsonLd from '../../components/json-ld'
import { getViewProps, isPageActive } from '@/lib/site-data'
import { PUBLIC_PAGES, pageMetadata } from '@/lib/seo'
import { service } from '@/lib/structured-data'
import { OPTIONAL_PAGES } from '@/lib/optional-pages'

export const metadata = pageMetadata('sprint')

export default async function Sprint() {
  // Page Status: while Hidden, visitors are sent to the 8 Pillars
  // Leadership page instead (temporary redirect, nothing is deleted).
  if (!(await isPageActive('sprint'))) redirect(OPTIONAL_PAGES.sprint.hiddenRedirect)
  const props = await getViewProps('sprint')
  return (
    <>
      {props.sprint && (
        <JsonLd data={service(PUBLIC_PAGES.sprint.path, '8 Pillar Sprint', PUBLIC_PAGES.sprint.description, { fullPriceCents: props.sprint.priceCents })} />
      )}
      <View {...props} />
    </>
  )
}
